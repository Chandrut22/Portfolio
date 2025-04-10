import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AnalyticsPanel from "@/components/admin/analytics-panel"
import AnalyticsTracker from "@/components/analytics-tracker"
import SessionTracker from "@/components/session-tracker"
import InitialLoader from "@/components/initial-loader"

export const metadata = {
  title: "Chandru - Portfolio",
  description: "Full Stack Developer Portfolio",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" sizes="32x32" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="32x32" href="/logo.png" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <InitialLoader />
          {children}
          <AnalyticsPanel />
          <AnalyticsTracker />
          <SessionTracker />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'