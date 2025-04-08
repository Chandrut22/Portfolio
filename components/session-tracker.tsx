"use client"

import { useEffect } from "react"
import { startUserSession, endUserSession } from "@/lib/click-tracker"

export default function SessionTracker() {
  useEffect(() => {
    // Start tracking session when component mounts
    const sessionId = startUserSession()

    // Notify admin about the new visit
    const notifyAdmin = async () => {
      try {
        await fetch("/api/notify-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitorId: sessionId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            path: window.location.pathname,
            referrer: document.referrer,
          }),
        })
      } catch (error) {
        console.error("Failed to send visit notification:", error)
      }
    }

    // Send notification
    notifyAdmin()

    // End tracking when component unmounts or page is closed
    const handleBeforeUnload = () => {
      endUserSession()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      endUserSession()
    }
  }, [])

  // This component doesn't render anything
  return null
}

