import { type NextRequest, NextResponse } from "next/server"

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

    // Log the contact form submission
    console.log("Contact form submission:", { name, email, subject, message })

    // In a real application, you would send an email or save to a database here
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: "Your message has been received. We'll get back to you soon.",
    })
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
