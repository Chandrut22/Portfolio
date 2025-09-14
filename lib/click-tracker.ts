// Comprehensive utility to track link clicks and user time using localStorage

// Generate a unique user ID if one doesn't exist
const getUserId = (): string => {
  if (typeof window === "undefined") return ""

  let userId = localStorage.getItem("portfolio-user-id")
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    localStorage.setItem("portfolio-user-id", userId)
  }
  return userId
}

// Initialize analytics data from localStorage or with default values
const initializeAnalyticsData = (): {
  users: Record<
    string,
    {
      firstVisit: string
      lastVisit: string
      totalSessions: number
      totalDuration: number
      linkClicks: Record<string, { count: number; lastClicked: string; url?: string }>
      navigationClicks: Record<string, number>
      projectClicks: Record<string, { count: number; lastClicked: string }>
      sessionDurations: { sessionId: string; duration: number; date: string }[]
    }
  >
  currentSession?: {
    startTime: number
    sessionId: string
    userId: string
  }
} => {
  if (typeof window === "undefined") return { users: {} }

  const storedData = localStorage.getItem("portfolio-analytics")
  let data: any = { users: {} }
  if (storedData && storedData.trim()) {
    try {
      data = JSON.parse(storedData)
    } catch (err) {
      console.warn("Invalid analytics data in localStorage, resetting", err)
      localStorage.removeItem("portfolio-analytics")
      data = { users: {} }
    }
  }

  // Ensure the current user exists in the data
  const userId = getUserId()
  if (!data.users[userId]) {
    data.users[userId] = {
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      totalSessions: 0,
      totalDuration: 0,
      linkClicks: {},
      navigationClicks: {},
      projectClicks: {},
      sessionDurations: [],
    }
  }

  // Ensure projectClicks exists for backward compatibility
  if (!data.users[userId].projectClicks) {
    data.users[userId].projectClicks = {}
  }

  return data
}

// Save analytics data to localStorage
const saveAnalyticsData = (data: any) => {
  if (typeof window === "undefined") return
  localStorage.setItem("portfolio-analytics", JSON.stringify(data))
}

// Clear all analytics data
export const clearAnalyticsData = (): void => {
  if (typeof window === "undefined") return

  // Remove analytics data
  localStorage.removeItem("portfolio-analytics")

  // Keep the user ID but reset all other data
  const userId = getUserId()
  const newData = {
    users: {
      [userId]: {
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        totalSessions: 0,
        totalDuration: 0,
        linkClicks: {},
        navigationClicks: {},
        projectClicks: {},
        sessionDurations: [],
      },
    },
  }

  saveAnalyticsData(newData)

  console.log("Analytics data has been cleared")
}

// Start tracking a user session
export const startUserSession = (): string => {
  if (typeof window === "undefined") return ""

  const analytics = initializeAnalyticsData()
  const userId = getUserId()
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  // Update user data
  analytics.users[userId].lastVisit = new Date().toISOString()
  analytics.users[userId].totalSessions += 1

  // Set current session
  analytics.currentSession = {
    startTime: Date.now(),
    sessionId,
    userId,
  }

  saveAnalyticsData(analytics)

  return sessionId
}

// End tracking a user session
export const endUserSession = () => {
  if (typeof window === "undefined") return

  const analytics = initializeAnalyticsData()
  if (!analytics.currentSession) return

  const { userId, sessionId, startTime } = analytics.currentSession
  const duration = (Date.now() - startTime) / 1000 // in seconds

  // Update user session data
  if (!analytics.users[userId].sessionDurations) {
    analytics.users[userId].sessionDurations = []
  }

  analytics.users[userId].sessionDurations.push({
    sessionId,
    duration,
    date: new Date().toISOString(),
  })

  // Update total duration
  analytics.users[userId].totalDuration += duration

  // Keep only the last 100 sessions
  if (analytics.users[userId].sessionDurations.length > 100) {
    analytics.users[userId].sessionDurations = analytics.users[userId].sessionDurations.slice(-100)
  }

  delete analytics.currentSession
  saveAnalyticsData(analytics)

  return duration
}

// Track a click for a specific link
export const trackLinkClick = (linkId: string, linkUrl = ""): void => {
  if (typeof window === "undefined") return

  const analytics = initializeAnalyticsData()
  const userId = getUserId()

  // Initialize linkClicks if it doesn't exist
  if (!analytics.users[userId].linkClicks) {
    analytics.users[userId].linkClicks = {}
  }

  // Update or create the link click data
  if (!analytics.users[userId].linkClicks[linkId]) {
    analytics.users[userId].linkClicks[linkId] = {
      count: 0,
      lastClicked: new Date().toISOString(),
      url: linkUrl,
    }
  }

  analytics.users[userId].linkClicks[linkId].count += 1
  analytics.users[userId].linkClicks[linkId].lastClicked = new Date().toISOString()
  if (linkUrl) analytics.users[userId].linkClicks[linkId].url = linkUrl

  saveAnalyticsData(analytics)
}

// Track a navigation click
export const trackNavigationClick = (navId: string): void => {
  if (typeof window === "undefined") return

  const analytics = initializeAnalyticsData()
  const userId = getUserId()

  // Initialize navigationClicks if it doesn't exist
  if (!analytics.users[userId].navigationClicks) {
    analytics.users[userId].navigationClicks = {}
  }

  analytics.users[userId].navigationClicks[navId] = (analytics.users[userId].navigationClicks[navId] || 0) + 1

  saveAnalyticsData(analytics)
}

// Track a project click
export const trackProjectClick = (projectId: string): void => {
  if (typeof window === "undefined") return

  const analytics = initializeAnalyticsData()
  const userId = getUserId()

  // Initialize projectClicks if it doesn't exist
  if (!analytics.users[userId].projectClicks) {
    analytics.users[userId].projectClicks = {}
  }

  // Update or create the project click data
  if (!analytics.users[userId].projectClicks[projectId]) {
    analytics.users[userId].projectClicks[projectId] = {
      count: 0,
      lastClicked: new Date().toISOString(),
    }
  }

  analytics.users[userId].projectClicks[projectId].count += 1
  analytics.users[userId].projectClicks[projectId].lastClicked = new Date().toISOString()

  saveAnalyticsData(analytics)
}

// Get all users
export const getAllUsers = (): Record<
  string,
  {
    firstVisit: string
    lastVisit: string
    totalSessions: number
    totalDuration: number
  }
> => {
  if (typeof window === "undefined") return {}

  const analytics = initializeAnalyticsData()

  // Create a simplified version with just the user metadata
  const users: Record<string, any> = {}
  Object.entries(analytics.users).forEach(([userId, userData]) => {
    users[userId] = {
      firstVisit: userData.firstVisit,
      lastVisit: userData.lastVisit,
      totalSessions: userData.totalSessions,
      totalDuration: userData.totalDuration,
    }
  })

  return users
}

// Get all link clicks for all users
export const getAllLinkClicks = (): Record<string, { count: number; lastClicked: string; url?: string }> => {
  if (typeof window === "undefined") return {}

  const analytics = initializeAnalyticsData()
  const allClicks: Record<string, { count: number; lastClicked: string; url?: string }> = {}

  // Aggregate link clicks from all users
  Object.values(analytics.users).forEach((userData) => {
    Object.entries(userData.linkClicks || {}).forEach(([linkId, clickData]) => {
      if (!allClicks[linkId]) {
        allClicks[linkId] = { count: 0, lastClicked: clickData.lastClicked, url: clickData.url }
      }
      allClicks[linkId].count += clickData.count

      // Update last clicked if this one is more recent
      const currentLastClicked = new Date(allClicks[linkId].lastClicked).getTime()
      const thisLastClicked = new Date(clickData.lastClicked).getTime()
      if (thisLastClicked > currentLastClicked) {
        allClicks[linkId].lastClicked = clickData.lastClicked
      }
    })
  })

  return allClicks
}

// Get all navigation clicks for all users
export const getAllNavigationClicks = (): Record<string, number> => {
  if (typeof window === "undefined") return {}

  const analytics = initializeAnalyticsData()
  const allClicks: Record<string, number> = {}

  // Aggregate navigation clicks from all users
  Object.values(analytics.users).forEach((userData) => {
    Object.entries(userData.navigationClicks || {}).forEach(([navId, count]) => {
      allClicks[navId] = (allClicks[navId] || 0) + count
    })
  })

  return allClicks
}

// Get all project clicks for all users
export const getAllProjectClicks = (): Record<string, { count: number; lastClicked: string }> => {
  if (typeof window === "undefined") return {}

  const analytics = initializeAnalyticsData()
  const allClicks: Record<string, { count: number; lastClicked: string }> = {}

  // Aggregate project clicks from all users
  Object.values(analytics.users).forEach((userData) => {
    Object.entries(userData.projectClicks || {}).forEach(([projectId, clickData]) => {
      if (!allClicks[projectId]) {
        allClicks[projectId] = { count: 0, lastClicked: clickData.lastClicked }
      }
      allClicks[projectId].count += clickData.count

      // Update last clicked if this one is more recent
      const currentLastClicked = new Date(allClicks[projectId].lastClicked).getTime()
      const thisLastClicked = new Date(clickData.lastClicked).getTime()
      if (thisLastClicked > currentLastClicked) {
        allClicks[projectId].lastClicked = clickData.lastClicked
      }
    })
  })

  return allClicks
}

// Get all session durations for all users
export const getAllSessionDurations = (): { sessionId: string; duration: number; date: string; userId: string }[] => {
  if (typeof window === "undefined") return []

  const analytics = initializeAnalyticsData()
  const allSessions: { sessionId: string; duration: number; date: string; userId: string }[] = []

  // Aggregate sessions from all users
  Object.entries(analytics.users).forEach(([userId, userData]) => {
    ;(userData.sessionDurations || []).forEach((session) => {
      allSessions.push({
        ...session,
        userId,
      })
    })
  })

  // Sort by date (newest first)
  return allSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Get average session duration in seconds across all users
export const getAverageSessionDuration = (): number => {
  const sessions = getAllSessionDurations()
  if (sessions.length === 0) return 0

  const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0)
  return totalDuration / sessions.length
}

// Get link clicks for current user
export const getCurrentUserLinkClicks = (): Record<string, { count: number; lastClicked: string; url?: string }> => {
  if (typeof window === "undefined") return {}

  const analytics = initializeAnalyticsData()
  const userId = getUserId()

  return analytics.users[userId]?.linkClicks || {}
}

// Get navigation clicks for current user
export const getCurrentUserNavigationClicks = (): Record<string, number> => {
  if (typeof window === "undefined") return {}

  const analytics = initializeAnalyticsData()
  const userId = getUserId()

  return analytics.users[userId]?.navigationClicks || {}
}

// Get project clicks for current user
export const getCurrentUserProjectClicks = (): Record<string, { count: number; lastClicked: string }> => {
  if (typeof window === "undefined") return {}

  const analytics = initializeAnalyticsData()
  const userId = getUserId()

  return analytics.users[userId]?.projectClicks || {}
}

// Get session durations for current user
export const getCurrentUserSessionDurations = (): { sessionId: string; duration: number; date: string }[] => {
  if (typeof window === "undefined") return []

  const analytics = initializeAnalyticsData()
  const userId = getUserId()

  return (analytics.users[userId]?.sessionDurations || []).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

// Get current user data
export const getCurrentUserData = () => {
  if (typeof window === "undefined") return null

  const analytics = initializeAnalyticsData()
  const userId = getUserId()

  return analytics.users[userId] || null
}

// Format duration in seconds to a readable format
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)} seconds`

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)

  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? "s" : ""} ${remainingSeconds} sec${remainingSeconds !== 1 ? "s" : ""}`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return `${hours} hr${hours !== 1 ? "s" : ""} ${remainingMinutes} min${remainingMinutes !== 1 ? "s" : ""}`
}

export const getLinkClickCount = (linkId: string): number => {
  if (typeof window === "undefined") return 0

  const analytics = initializeAnalyticsData()
  const userId = getUserId()

  return analytics.users[userId]?.linkClicks?.[linkId]?.count || 0
}
