import nodemailer from "nodemailer"

type EmailData = {
  name: string
  email: string
  subject: string
  message: string
}

// Create a transporter using the default SMTP transport
const createTransporter = () => {
  // For development/testing, you can use a service like Mailtrap or Ethereal
  // In production, use your actual SMTP settings
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASSWORD || "",
    },
  })
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    // Log the email data for demonstration purposes
    console.log("Sending email with data:", data)

    // In a development environment, just log the email and return success
    if (process.env.NODE_ENV === "development") {
      console.log("Email would be sent in production with data:", data)
      return true
    }

    const transporter = createTransporter()

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER || "noreply@example.com"}>`,
      to: process.env.ADMIN_EMAIL || "admin@example.com",
      subject: `Portfolio Contact: ${data.subject}`,
      text: `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Subject:</strong> ${data.subject}</p>
  <h3>Message:</h3>
  <p>${data.message.replace(/\n/g, "<br>")}</p>
</div>
      `,
    })

    console.log("Message sent: %s", info.messageId)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

export async function sendVisitNotification(visitorData: any): Promise<boolean> {
  try {
    // Log the notification data for demonstration purposes
    console.log("Sending visit notification with data:", visitorData)

    // In a development environment, just log the notification and return success
    if (process.env.NODE_ENV === "development") {
      console.log("Visit notification would be sent in production with data:", visitorData)
      return true
    }

    const transporter = createTransporter()

    // Format the notification content
    const notificationContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Portfolio Visit</h2>
        <p><strong>Time:</strong> ${new Date(visitorData.timestamp).toLocaleString()}</p>
        <p><strong>Path:</strong> ${visitorData.path || "Homepage"}</p>
        <p><strong>Location:</strong> ${visitorData.location || "Unknown"}</p>
        <p><strong>Country:</strong> ${visitorData.country || "Unknown"}</p>
        <p><strong>Browser:</strong> ${visitorData.browser || "Unknown"}</p>
        <p><strong>Device:</strong> ${visitorData.device || "Unknown"}</p>
        <p><strong>Referrer:</strong> ${visitorData.referrer || "Direct"}</p>
      </div>
    `

    // Send notification email
    const info = await transporter.sendMail({
      from: `"Portfolio Analytics" <${process.env.SMTP_USER || "noreply@example.com"}>`,
      to: process.env.ADMIN_EMAIL || "admin@example.com",
      subject: "New Portfolio Visit",
      text: `
New Portfolio Visit:
Time: ${new Date(visitorData.timestamp).toLocaleString()}
Path: ${visitorData.path || "Homepage"}
Location: ${visitorData.location || "Unknown"}
Country: ${visitorData.country || "Unknown"}
Browser: ${visitorData.browser || "Unknown"}
Device: ${visitorData.device || "Unknown"}
Referrer: ${visitorData.referrer || "Direct"}
      `,
      html: notificationContent,
    })

    console.log("Notification sent: %s", info.messageId)
    return true
  } catch (error) {
    console.error("Error sending visit notification:", error)
    return false
  }
}
