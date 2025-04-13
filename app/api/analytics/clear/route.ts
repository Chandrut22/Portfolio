import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/analytics/auth"
import { clearAnalyticsData } from "@/lib/analytics/db"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifyAuth(request)

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Clear analytics data
    const success = await clearAnalyticsData()

    if (!success) {
      return NextResponse.json({ error: "Failed to clear analytics data" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error clearing analytics data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
