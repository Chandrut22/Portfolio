// API route for getting analytics data

import { type NextRequest, NextResponse } from "next/server"
import { getVisitors, generateAnalyticsSummary } from "@/lib/analytics/db"
import { verifyAuth } from "@/lib/analytics/auth"

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifyAuth(request)

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get analytics data from MongoDB
    const visitors = await getVisitors()
    const summary = await generateAnalyticsSummary()

    // Sort visitors by timestamp (newest first)
    const recentVisitors = [...visitors]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50) // Limit to 50 most recent visitors

    // Ensure we're returning valid JSON
    return NextResponse.json({
      summary,
      recentVisitors,
    })
  } catch (error) {
    console.error("Error getting analytics data:", error)

    // Return a structured error response
    return NextResponse.json(
      {
        error: "Failed to get analytics data",
        summary: {
          totalViews: 0,
          uniqueVisitors: 0,
          topCountries: [],
          topReferrers: [],
          viewsByDay: [],
          topPages: [],
        },
        recentVisitors: [],
      },
      { status: 500 },
    )
  }
}
