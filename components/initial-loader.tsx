"use client"

import { useState, useEffect } from "react"

export default function InitialLoader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle page load event
    const handleLoad = () => {
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    // Check if document is already loaded
    if (document.readyState === "complete") {
      handleLoad()
    } else {
      window.addEventListener("load", handleLoad)
    }

    return () => {
      window.removeEventListener("load", handleLoad)
    }
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mb-8">
        <div className="h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>

      <div className="relative h-1 w-60 overflow-hidden rounded-full bg-secondary">
        <div className="absolute inset-0 h-full w-full bg-primary animate-loading"></div>
      </div>

      <p className="mt-6 text-muted-foreground">Loading portfolio...</p>
    </div>
  )
}
