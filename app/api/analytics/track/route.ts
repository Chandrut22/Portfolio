import { type NextRequest, NextResponse } from "next/server"
import { saveVisitor } from "@/lib/analytics/db"
import { getGeoData, parseUserAgent, parseReferrer } from "@/lib/analytics/geo"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

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

    // Compute visitor local date/time if timezone available
    let localDate = ""
    let localTime = ""
    if (geoData.timezone) {
      const now = new Date()
      const dateFmt = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: geoData.timezone })
      const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: geoData.timezone })
      localDate = (dateFmt.format(now)).replace(/\//g, "-")
      localTime = timeFmt.format(now)
    }

    // Get or create session ID - Fix the async cookies issue
    let sessionId = ""

    try {
      // Use request cookies instead of the cookies() API
      const cookieHeader = request.headers.get("cookie") || ""
      const analyticsCookie = cookieHeader
        .split(";")
        .find((c) => c.trim().startsWith("analytics_session="))
        ?.split("=")[1]

      sessionId = analyticsCookie || uuidv4()
    } catch (error) {
      console.error("Error accessing cookies:", error)
      sessionId = uuidv4()
    }

    // Save visitor data to MongoDB
    await saveVisitor({
      sessionId,
      path,
      referrer: parsedReferrer,
      browser,
      device,
      ...geoData,
      localDate,
      localTime,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return NextResponse.json({ error: "Failed to track visitor" }, { status: 500 })
  }
}
