// Database utilities for analytics
// This is a simplified implementation - in production you would use a real database

import type { Visitor, AnalyticsSummary } from "./types"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// In a real app, you'd use a proper database like MongoDB, PostgreSQL, etc.
// This is a simple file-based implementation for demonstration

const DATA_DIR = path.join(process.cwd(), ".analytics")
const VISITORS_FILE = path.join(DATA_DIR, "visitors.json")

// Ensure the data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  if (!fs.existsSync(VISITORS_FILE)) {
    fs.writeFileSync(VISITORS_FILE, JSON.stringify([]))
  }
}

// Load visitors from file
export const getVisitors = (): Visitor[] => {
  ensureDataDir()

  try {
    const data = fs.readFileSync(VISITORS_FILE, "utf8")

    // Handle empty file case
    if (!data.trim()) {
      return []
    }

    const visitors = JSON.parse(data) as Visitor[]

    // Convert string timestamps back to Date objects
    return visitors.map((visitor) => ({
      ...visitor,
      timestamp: new Date(visitor.timestamp),
    }))
  } catch (error) {
    console.error("Error reading visitors file:", error)
    return []
  }
}

// Save a new visitor
export const saveVisitor = async (visitor: Omit<Visitor, "id" | "timestamp">): Promise<Visitor> => {
  ensureDataDir()

  const visitors = getVisitors()

  const newVisitor: Visitor = {
    id: uuidv4(), // In production, you might use a hashed IP
    timestamp: new Date(),
    ...visitor,
  }

  visitors.push(newVisitor)

  try {
    fs.writeFileSync(VISITORS_FILE, JSON.stringify(visitors, null, 2))
    return newVisitor
  } catch (error) {
    console.error("Error saving visitor:", error)
    throw new Error("Failed to save visitor data")
  }
}

// Improve the generateAnalyticsSummary function to handle edge cases
export const generateAnalyticsSummary = (): AnalyticsSummary => {
  const visitors = getVisitors()

  // If no visitors, return empty summary
  if (visitors.length === 0) {
    return {
      totalViews: 0,
      uniqueVisitors: 0,
      topCountries: [],
      topReferrers: [],
      viewsByDay: [],
      topPages: [],
    }
  }

  // Filter to last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentVisitors = visitors.filter((v) => v.timestamp.getTime() > thirtyDaysAgo.getTime())

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

  // Rest of the function remains the same...
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
}

