import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AnalyticsPanel from "@/components/admin/analytics-panel"
import AnalyticsTracker from "@/components/analytics-tracker"
import SessionTracker from "@/components/session-tracker"
import InitialLoader from "@/components/initial-loader"

export const metadata = {
  title: "Chandru Portfolio | AI & ML Developer | Full Stack Developer",
  description:
    "Chandru is a skilled Full Stack Developer specializing in React, Next.js, and modern web technologies. View projects, skills, and experience.",
  keywords: "Chandru,AI, DSA, ML, Artificial Intelligence, Machine Learning,Data Science, Data Analysis, Deep Learning, portfolio, web developer, full stack developer, React developer, Next.js developer",
  authors: [{ name: "Chandru" }],
  creator: "Chandru",
  publisher: "Chandru",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://chandru22.vercel.app/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Chandru Portfolio | AI & ML Developer | Full Stack Developer",
    description:
      "Chandru is a skilled Full Stack Developer specializing in React, Next.js, and modern web technologies.",
    url: "https://chandru22.vercel.app/",
    siteName: "Chandru Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Chandru Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chandru Portfolio | AI & ML Developer | Full Stack Developer",
    description:
      "Chandru is a skilled Full Stack Developer specializing in React, Next.js, and modern web technologies.",
    creator: "@chandru",
    images: ["/twitter-logo.png"],
  },
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
        <meta name="google-site-verification" content="71Luxm_e083x1OsWkAj2WPwZhfFs4-AUKQevWGflij0" />
        <link rel="icon" sizes="128x128" href="/logo.png" />
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