"use client"

import { useState, useEffect, useCallback } from "react"
import { trackLinkClick, getLinkClickCount } from "@/lib/click-tracker"

export function useClickTracker(linkId: string) {
  const [clickCount, setClickCount] = useState(0)

  // Load initial count
  useEffect(() => {
    setClickCount(getLinkClickCount(linkId))
  }, [linkId])

  // Function to track a click
  const trackClick = useCallback(() => {
    const newCount = trackLinkClick(linkId)
    setClickCount(newCount)
    return newCount
  }, [linkId])

  return { clickCount, trackClick }
}
