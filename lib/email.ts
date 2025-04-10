import nodemailer from "nodemailer"

type EmailData = {
  name: string
  email: string
  subject: string
  message: string
}

// Create a reusable transporter object using SMTP transport
const createTransporter = () => {
  // For development/testing, create a test account
  if (process.env.NODE_ENV === "development" && (!process.env.SMTP_HOST || !process.env.SMTP_USER)) {
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "ethereal.user@ethereal.email", // generated ethereal user
        pass: "ethereal_pass", // generated ethereal password
      },
    })
  }

  // For production, use configured SMTP settings
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
    },
  })
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    // Log the email data for debugging
    console.log("Attempting to send email with data:", {
      name: data.name,
      email: data.email,
      subject: data.subject,
      messageLength: data.message.length,
    })

    // Create test account for development if needed
    let testAccount
    let transporter

    if (process.env.NODE_ENV === "development" && (!process.env.SMTP_HOST || !process.env.SMTP_USER)) {
      testAccount = await nodemailer.createTestAccount()

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })

      console.log("Created test account:", testAccount.user)
    } else {
      transporter = createTransporter()
    }

    // Verify SMTP connection configuration
    await transporter.verify()
    console.log("SMTP connection verified successfully")

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

    // Preview URL for development (Ethereal)
    if (testAccount) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    }

    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

export async function sendVisitNotification(visitorData: any): Promise<boolean> {
  try {
    // Log the notification data for debugging
    console.log("Attempting to send visit notification with data:", {
      path: visitorData.path,
      timestamp: visitorData.timestamp,
    })

    // Create test account for development if needed
    let testAccount
    let transporter

    if (process.env.NODE_ENV === "development" && (!process.env.SMTP_HOST || !process.env.SMTP_USER)) {
      testAccount = await nodemailer.createTestAccount()

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })

      console.log("Created test account for notification:", testAccount.user)
    } else {
      transporter = createTransporter()
    }

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

    // Preview URL for development (Ethereal)
    if (testAccount) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    }

    return true
  } catch (error) {
    console.error("Error sending visit notification:", error)
    return false
  }
}
