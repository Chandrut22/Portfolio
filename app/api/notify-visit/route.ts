import { NextResponse } from "next/server"
import { sendVisitNotification } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { visitorId, timestamp, userAgent, path, referrer, ipAddress, location, country, browser, device } = data

    // Get admin email from environment variable
    const adminEmail = process.env.ADMIN_EMAIL

    if (!adminEmail) {
      console.error("Admin email not configured")
      return NextResponse.json({ error: "Admin email not configured" }, { status: 500 })
    }

    // Log the visit information to the server console
    console.log("New Portfolio Visit:", {
      time: new Date(timestamp).toLocaleString(),
      visitorId,
      path,
      location: location || "Unknown",
      country: country || "Unknown",
      browser: browser || "Unknown",
      device: device || "Unknown",
      referrer: referrer || "Direct",
      ipAddress: ipAddress || "Unknown",
      userAgent: userAgent || "Unknown",
    })

    // Send notification email using nodemailer
    await sendVisitNotification({
      timestamp,
      visitorId,
      path,
      location,
      country,
      browser,
      device,
      referrer,
      ipAddress,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing visit notification:", error)
    return NextResponse.json({ error: "Failed to process notification" }, { status: 500 })
  }
}
