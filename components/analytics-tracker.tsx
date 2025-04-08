"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Skip tracking in development if needed
    // if (process.env.NODE_ENV === 'development') {
    //   return;
    // }

    // Track page view
    const trackPageView = async () => {
      try {
        const response = await fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: pathname,
          }),
        })

        if (!response.ok) {
          console.warn("Failed to track page view:", response.status)
        }
      } catch (error) {
        // Silent fail - don't affect user experience if tracking fails
        console.warn("Error tracking page view:", error)
      }
    }

    // Add a small delay to ensure the page has loaded
    const timeoutId = setTimeout(() => {
      trackPageView()
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [pathname])

  // This component doesn't render anything
  return null
}

