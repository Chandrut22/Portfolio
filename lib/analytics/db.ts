// Database utilities for analytics using MongoDB
import type { Visitor, AnalyticsSummary } from "./types"
import clientPromise from "@/lib/mongodb"
import { v4 as uuidv4 } from "uuid"

// Save a new visitor
export const saveVisitor = async (visitor: Omit<Visitor, "id" | "timestamp">): Promise<Visitor> => {
  try {
    const client = await clientPromise
    const db = client.db("portfolio")
    const collection = db.collection("visitors")

    const newVisitor: Visitor = {
      id: uuidv4(), // In production, you might use a hashed IP
      timestamp: new Date(),
      ...visitor,
    }

    await collection.insertOne(newVisitor)
    return newVisitor
  } catch (error) {
    console.error("Error saving visitor:", error)
    throw new Error("Failed to save visitor data")
  }
}

// Get all visitors
export const getVisitors = async (): Promise<Visitor[]> => {
  try {
    const client = await clientPromise
    const db = client.db("portfolio")
    const collection = db.collection("visitors")

    const visitors = await collection.find({}).toArray()
    const mappedVisitors: Visitor[] = visitors.map((doc) => ({
      id: doc.id || doc._id.toString(),
      timestamp: doc.timestamp,
      country: doc.country,
      referrer: doc.referrer,
      path: doc.path,
    }))
    return mappedVisitors
  } catch (error) {
    console.error("Error getting visitors:", error)
    return []
  }
}

// Generate analytics summary
export const generateAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  try {
    const client = await clientPromise
    const db = client.db("portfolio")
    const collection = db.collection("visitors")

    // Filter to last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentVisitors = (await collection
      .find({
        timestamp: { $gt: thirtyDaysAgo },
      })
      .toArray())
      .map((doc) => ({
        id: doc.id || doc._id.toString(),
        timestamp: doc.timestamp,
        country: doc.country,
        referrer: doc.referrer,
        path: doc.path,
      })) as Visitor[]

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
