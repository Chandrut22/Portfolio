import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { visitorId, timestamp, userAgent, path, referrer, ipAddress } = data

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
      referrer: referrer || "Direct",
      ipAddress: ipAddress || "Unknown",
      userAgent: userAgent || "Unknown",
      adminEmail: adminEmail, // Log the admin email that would receive the notification
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing visit notification:", error)
    return NextResponse.json({ error: "Failed to process notification" }, { status: 500 })
  }
}

