"use client"

import { useEffect } from "react"
import { startUserSession, endUserSession } from "@/lib/click-tracker"

export default function SessionTracker() {
  useEffect(() => {
    // Start tracking session when component mounts
    const sessionId = startUserSession()

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
