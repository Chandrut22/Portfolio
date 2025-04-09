import { type NextRequest, NextResponse } from "next/server";
import { saveVisitor } from "@/lib/analytics/db";
import { getGeoData, parseUserAgent, parseReferrer } from "@/lib/analytics/geo";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // Get client IP (Edge Runtime doesn't support request.ip)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || "127.0.0.1";

    // Request body
    const data = await request.json();
    const { path } = data;

    // Referrer & User Agent
    const referrer = request.headers.get("referer") || "";
    const parsedReferrer = parseReferrer(referrer);

    const userAgent = request.headers.get("user-agent") || "";
    const { browser, device } = parseUserAgent(userAgent);

    // Get geolocation data
    let geoData = {};
    try {
      geoData = await getGeoData(ip);
    } catch (geoError) {
      console.error("Geo location fetch failed:", geoError);
    }

    // Get or create session ID from cookie
    let sessionId = "";
    try {
      const cookieHeader = request.headers.get("cookie") || "";
      const analyticsCookie = cookieHeader
        .split(";")
        .find((c) => c.trim().startsWith("analytics_session="))
        ?.split("=")[1];
      sessionId = analyticsCookie || uuidv4();
    } catch (error) {
      console.error("Error parsing cookies:", error);
      sessionId = uuidv4();
    }

    // Save to DB
    await saveVisitor({
      sessionId,
      path,
      referrer: parsedReferrer,
      browser,
      device,
      ...geoData,
    });

    // Send notification email (ensure it's a full URL)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // define in .env
      await fetch(`${baseUrl}/api/notify-visit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitorId: sessionId,
          timestamp: new Date().toISOString(),
          userAgent,
          path,
          referrer: parsedReferrer,
          ip,
          ...geoData,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send visit notification email:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json({ error: "Failed to track visitor" }, { status: 500 });
  }
}
