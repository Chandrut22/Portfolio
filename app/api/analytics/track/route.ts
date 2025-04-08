// API route for tracking page views

import { type NextRequest, NextResponse } from "next/server"
import { saveVisitor } from "@/lib/analytics/db"
import { getGeoData, parseUserAgent, parseReferrer } from "@/lib/analytics/geo"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || request.ip || "127.0.0.1"

    // Get request data
    const data = await request.json()
    const { path } = data

    // Get referrer
    const referrer = request.headers.get("referer")
    const parsedReferrer = parseReferrer(referrer)

    // Get user agent
    const userAgent = request.headers.get("user-agent") || ""
    const { browser, device } = parseUserAgent(userAgent)

    // Get geolocation data
    const geoData = await getGeoData(ip)

    // Get or create session ID - Fix the async cookies issue
    let sessionId = ""

    try {
      // Use a try-catch block to handle the cookies() function
      const cookieStore = cookies()
      const analyticsCookie = cookieStore.get("analytics_session")
      sessionId = analyticsCookie?.value || ""
    } catch (error) {
      console.error("Error accessing cookies:", error)
    }

    if (!sessionId) {
      sessionId = uuidv4()
      // In a real implementation, you'd set the cookie here
    }

    // Save visitor data
    await saveVisitor({
      sessionId,
      path,
      referrer: parsedReferrer,
      browser,
      device,
      ...geoData,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return NextResponse.json({ error: "Failed to track visitor" }, { status: 500 })
  }
}

