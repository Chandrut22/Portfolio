import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, subject, message } = data

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    console.log("Processing contact form submission:", {
      name,
      email,
      subject,
      messageLength: message.length,
    })

    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn("SMTP not fully configured. Email will be logged but not sent.")

      // Log the email that would have been sent
      console.log("Email would be sent with data:", { name, email, subject, message })

      // In development, we'll pretend it succeeded
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({
          success: true,
          warning: "SMTP not configured. Email logged but not sent.",
        })
      }
    }

    // Send email using nodemailer
    const success = await sendEmail({ name, email, subject, message })

    if (!success) {
      console.error("Failed to send email")
      return NextResponse.json(
        {
          error: "Failed to send email. Please try again later or contact directly via email.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    )
  }
}
