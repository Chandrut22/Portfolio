"use client"

import { useState, useEffect, useCallback } from "react"
import { trackLinkClick, getLinkClickCount } from "@/lib/click-tracker"

export function useClickTracker(linkId: string) {
  const [clickCount, setClickCount] = useState(0)

  // Load initial count
  useEffect(() => {
    async function fetchClickCount() {
      try {
        const result = await getLinkClickCount(linkId)
        const count = typeof result === "number" ? result : 0
        setClickCount(count)
      } catch (error) {
        console.error("Failed to fetch click count:", error)
        setClickCount(0)
      }
    }

    fetchClickCount()
  }, [linkId])

  // Function to track a click
  const trackClick = useCallback(async () => {
    try {
      const result = await trackLinkClick(linkId)
      const newCount = typeof result === "number" ? result : clickCount
      setClickCount(newCount)
      return newCount
    } catch (error) {
      console.error("Failed to track link click:", error)
      return clickCount // Fallback
    }
  }, [linkId, clickCount])

  return { clickCount, trackClick }
}
