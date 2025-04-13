// Database utilities for analytics using MongoDB
import type { Visitor, AnalyticsSummary } from "./types"
import clientPromise from "@/lib/mongodb"
import { v4 as uuidv4 } from "uuid"

// In-memory fallback storage for development
const inMemoryVisitors: Visitor[] = []

// Save a new visitor
export const saveVisitor = async (visitor: Omit<Visitor, "id" | "timestamp">): Promise<Visitor> => {
  try {
    const newVisitor: Visitor = {
      id: uuidv4(), // In production, you might use a hashed IP
      timestamp: new Date(),
      ...visitor,
    }

    if (!process.env.MONGODB_URI) {
      // Use in-memory storage if MongoDB is not configured
      inMemoryVisitors.push(newVisitor)
      console.log("Saved visitor to in-memory storage:", newVisitor.id)
      return newVisitor
    }

    const client = await clientPromise
    const db = client.db("portfolio")
    const collection = db.collection("visitors")

    await collection.insertOne(newVisitor)
    return newVisitor
  } catch (error) {
    console.error("Error saving visitor:", error)

    // Fallback to in-memory storage on error
    const newVisitor: Visitor = {
      id: uuidv4(),
      timestamp: new Date(),
      ...visitor,
    }
    inMemoryVisitors.push(newVisitor)
    console.log("Saved visitor to in-memory fallback storage:", newVisitor.id)

    return newVisitor
  }
}

// Get all visitors
export const getVisitors = async (): Promise<Visitor[]> => {
  try {
    if (!process.env.MONGODB_URI) {
      // Return in-memory visitors if MongoDB is not configured
      return inMemoryVisitors
    }

    const client = await clientPromise
    const db = client.db("portfolio")
    const collection = db.collection("visitors")

    const visitors = await collection.find({}).toArray()
    return visitors.map((doc) => ({
      id: doc.id,
      timestamp: new Date(doc.timestamp),
      country: doc.country,
      referrer: doc.referrer,
      path: doc.path,
    })) as Visitor[]
  } catch (error) {
    console.error("Error getting visitors:", error)
    // Return in-memory visitors as fallback
    return inMemoryVisitors
  }
}

// Generate analytics summary
export const generateAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  try {
    let recentVisitors: Visitor[]

    if (!process.env.MONGODB_URI) {
      // Use in-memory visitors if MongoDB is not configured
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      recentVisitors = inMemoryVisitors.filter((v) => v.timestamp.getTime() > thirtyDaysAgo.getTime())
    } else {
      const client = await clientPromise
      const db = client.db("portfolio")
      const collection = db.collection("visitors")

      // Filter to last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      recentVisitors = (await collection
        .find({
          timestamp: { $gt: thirtyDaysAgo },
        })
        .toArray())
        .map((doc) => ({
          id: doc.id,
          timestamp: new Date(doc.timestamp),
          country: doc.country,
          referrer: doc.referrer,
          path: doc.path,
        })) as Visitor[]
    }

    // If no recent visitors, return empty summary
    if (recentVisitors.length === 0) {
      return {
        totalViews: 0,
        uniqueVisitors: 0,
        topCountries: [],
        topReferrers: [],
        viewsByDay: [],
        topPages: [],
      }
    }

    // Count unique visitors
    const uniqueVisitorIds = new Set(recentVisitors.map((v) => v.id))

    // Count by country
    const countryCount: Record<string, number> = {}
    recentVisitors.forEach((v) => {
      if (v.country) {
        countryCount[v.country] = (countryCount[v.country] || 0) + 1
      }
    })

    const topCountries = Object.entries(countryCount)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Count by referrer
    const referrerCount: Record<string, number> = {}
    recentVisitors.forEach((v) => {
      const referrer = v.referrer || "Direct"
      referrerCount[referrer] = (referrerCount[referrer] || 0) + 1
    })

    const topReferrers = Object.entries(referrerCount)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Count by page
    const pageCount: Record<string, number> = {}
    recentVisitors.forEach((v) => {
      if (v.path) {
        pageCount[v.path] = (pageCount[v.path] || 0) + 1
      }
    })

    const topPages = Object.entries(pageCount)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Views by day
    const viewsByDay: Record<string, number> = {}
    recentVisitors.forEach((v) => {
      const dateStr = v.timestamp.toISOString().split("T")[0]
      viewsByDay[dateStr] = (viewsByDay[dateStr] || 0) + 1
    })

    // Get the last 14 days, filling in zeros for days with no views
    const last14Days: { date: string; count: number }[] = []
    for (let i = 13; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      last14Days.push({
        date: dateStr,
        count: viewsByDay[dateStr] || 0,
      })
    }

    return {
      totalViews: recentVisitors.length,
      uniqueVisitors: uniqueVisitorIds.size,
      topCountries,
      topReferrers,
      viewsByDay: last14Days,
      topPages,
    }
  } catch (error) {
    console.error("Error generating analytics summary:", error)
    return {
      totalViews: 0,
      uniqueVisitors: 0,
      topCountries: [],
      topReferrers: [],
      viewsByDay: [],
      topPages: [],
    }
  }
}

// Save analytics data to MongoDB
export const saveAnalyticsData = async (data: any): Promise<boolean> => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log("MongoDB URI not configured, skipping saveAnalyticsData")
      return false
    }

    const client = await clientPromise
    const db = client.db("portfolio")

    // Save user data
    if (data.users) {
      const usersCollection = db.collection("analytics_users")

      // For each user, upsert their data
      for (const [userId, userData] of Object.entries(data.users)) {
        await usersCollection.updateOne(
          { userId },
          { $set: { userId, ...(typeof userData === "object" && userData !== null ? userData : {}), updatedAt: new Date() } },
          { upsert: true },
        )
      }
    }

    // Save link clicks
    if (data.linkClicks) {
      const linksCollection = db.collection("analytics_links")

      for (const [linkId, linkData] of Object.entries(data.linkClicks)) {
        await linksCollection.updateOne(
          { linkId },
          { $set: { linkId, ...(typeof linkData === "object" && linkData !== null ? linkData : {}), updatedAt: new Date() } },
          { upsert: true },
        )
      }
    }

    // Save navigation clicks
    if (data.navigationClicks) {
      const navCollection = db.collection("analytics_navigation")

      for (const [navId, count] of Object.entries(data.navigationClicks)) {
        await navCollection.updateOne({ navId }, { $set: { navId, count, updatedAt: new Date() } }, { upsert: true })
      }
    }

    // Save project clicks
    if (data.projectClicks) {
      const projectsCollection = db.collection("analytics_projects")

      for (const [projectId, projectData] of Object.entries(data.projectClicks)) {
        await projectsCollection.updateOne(
          { projectId },
          { $set: { projectId, ...(typeof projectData === "object" && projectData !== null ? projectData : {}), updatedAt: new Date() } },
          { upsert: true },
        )
      }
    }

    // Save session data
    if (data.sessionDurations) {
      const sessionsCollection = db.collection("analytics_sessions")

      for (const session of data.sessionDurations) {
        await sessionsCollection.updateOne(
          { sessionId: session.sessionId },
          { $set: { ...session, updatedAt: new Date() } },
          { upsert: true },
        )
      }
    }

    return true
  } catch (error) {
    console.error("Error saving analytics data to MongoDB:", error)
    return false
  }
}

// Clear all analytics data from MongoDB
export const clearAnalyticsData = async (): Promise<boolean> => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log("MongoDB URI not configured, skipping clearAnalyticsData")
      return false
    }

    const client = await clientPromise
    const db = client.db("portfolio")

    // Clear all analytics collections
    await db.collection("visitors").deleteMany({})
    await db.collection("analytics_users").deleteMany({})
    await db.collection("analytics_links").deleteMany({})
    await db.collection("analytics_navigation").deleteMany({})
    await db.collection("analytics_projects").deleteMany({})
    await db.collection("analytics_sessions").deleteMany({})

    console.log("All analytics data cleared from MongoDB")
    return true
  } catch (error) {
    console.error("Error clearing analytics data from MongoDB:", error)
    return false
  }
}

// Load analytics data from MongoDB
export const loadAnalyticsData = async (): Promise<any> => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log("MongoDB URI not configured, skipping loadAnalyticsData")
      return null
    }

    const client = await clientPromise
    const db = client.db("portfolio")

    // Load users
    const usersCollection = db.collection("analytics_users")
    const users = await usersCollection.find({}).toArray()

    // Load link clicks
    const linksCollection = db.collection("analytics_links")
    const links = await linksCollection.find({}).toArray()

    // Load navigation clicks
    const navCollection = db.collection("analytics_navigation")
    const navigation = await navCollection.find({}).toArray()

    // Load project clicks
    const projectsCollection = db.collection("analytics_projects")
    const projects = await projectsCollection.find({}).toArray()

    // Load sessions
    const sessionsCollection = db.collection("analytics_sessions")
    const sessions = await sessionsCollection.find({}).toArray()

    // Format the data
    const formattedData: {
      users: Record<string, {
        firstVisit: Date;
        lastVisit: Date;
        totalSessions: number;
        totalDuration: number;
        linkClicks: Record<string, number>;
        navigationClicks: Record<string, number>;
        projectClicks: Record<string, number>;
        sessionDurations: any[];
      }>;
      linkClicks: Record<string, { count: number; lastClicked: Date; url: string }>;
      navigationClicks: Record<string, number>;
      projectClicks: Record<string, { count: number; lastClicked: Date }>;
      sessionDurations: any[];
    } = {
      users: {},
      linkClicks: {},
      navigationClicks: {},
      projectClicks: {},
      sessionDurations: sessions,
    }

    // Format users
    users.forEach((user) => {
      formattedData.users[user.userId] = {
        firstVisit: user.firstVisit,
        lastVisit: user.lastVisit,
        totalSessions: user.totalSessions,
        totalDuration: user.totalDuration,
        linkClicks: user.linkClicks || {},
        navigationClicks: user.navigationClicks || {},
        projectClicks: user.projectClicks || {},
        sessionDurations: user.sessionDurations || [],
      }
    })

    // Format links
    links.forEach((link) => {
      formattedData.linkClicks[link.linkId] = {
        count: link.count,
        lastClicked: link.lastClicked,
        url: link.url,
      }
    })

    // Format navigation
    navigation.forEach((nav) => {
      formattedData.navigationClicks[nav.navId] = nav.count
    })

    // Format projects
    projects.forEach((project) => {
      formattedData.projectClicks[project.projectId] = {
        count: project.count,
        lastClicked: project.lastClicked,
      }
    })

    return formattedData
  } catch (error) {
    console.error("Error loading analytics data from MongoDB:", error)
    return null
  }
}
