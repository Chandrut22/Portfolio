"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Eye,
  MapPin,
  X,
  Lock,
  Unlock,
  BarChart3,
  Globe,
  Clock,
  Calendar,
  MousePointer,
  Link2,
  Timer,
  User,
  Briefcase,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Visitor, AnalyticsSummary } from "@/lib/analytics/types"
import {
  getAllUsers,
  getAllLinkClicks,
  getAllNavigationClicks,
  getAllProjectClicks,
  getAllSessionDurations,
  getAverageSessionDuration,
  formatDuration,
  getCurrentUserLinkClicks,
  getCurrentUserNavigationClicks,
  getCurrentUserProjectClicks,
  clearAnalyticsData,
} from "@/lib/click-tracker"

export default function AnalyticsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [visitorData, setVisitorData] = useState<Visitor[]>([])
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [navigationClicks, setNavigationClicks] = useState<Record<string, number>>({})
  const [linkClicks, setLinkClicks] = useState<Record<string, { count: number; lastClicked: string; url?: string }>>({})
  const [projectClicks, setProjectClicks] = useState<Record<string, { count: number; lastClicked: string }>>({})
  const [sessionDurations, setSessionDurations] = useState<
    { sessionId: string; duration: number; date: string; userId: string }[]
  >([])
  const [averageSessionDuration, setAverageSessionDuration] = useState<number>(0)
  const [users, setUsers] = useState<Record<string, any>>({})
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [userLinkClicks, setUserLinkClicks] = useState<
    Record<string, { count: number; lastClicked: string; url?: string }>
  >({})
  const [userNavigationClicks, setUserNavigationClicks] = useState<Record<string, number>>({})
  const [userProjectClicks, setUserProjectClicks] = useState<Record<string, { count: number; lastClicked: string }>>({})
  const [activeTab, setActiveTab] = useState("summary")
  const [isClearing, setIsClearing] = useState(false)

  // Check if already authenticated on mount
  useEffect(() => {
    // Try to get token from localStorage
    const storedToken = localStorage.getItem("analytics_token")
    if (storedToken) {
      setAuthToken(storedToken)
      setIsAuthenticated(true)
    }
  }, [])

  // Load analytics data when panel is opened
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadClientAnalyticsData()
    }
  }, [isOpen, isAuthenticated])

  // Function to load client-side analytics data
  const loadClientAnalyticsData = () => {
    const navClicks = getAllNavigationClicks()
    setNavigationClicks(navClicks)

    const clicks = getAllLinkClicks()
    setLinkClicks(clicks)

    const pClicks = getAllProjectClicks()
    setProjectClicks(pClicks)

    const sessions = getAllSessionDurations()
    setSessionDurations(sessions)

    const avgDuration = getAverageSessionDuration()
    setAverageSessionDuration(avgDuration)

    const allUsers = getAllUsers()
    setUsers(allUsers)

    // Set the first user as selected by default if there are users
    if (Object.keys(allUsers).length > 0 && !selectedUserId) {
      setSelectedUserId(Object.keys(allUsers)[0])
    }
  }

  // Load user-specific data when a user is selected
  useEffect(() => {
    if (selectedUserId) {
      // This is a mock implementation since we can't actually get user-specific data from localStorage
      // In a real implementation, you would fetch this data from your backend
      const userLinks = getCurrentUserLinkClicks()
      const userNavs = getCurrentUserNavigationClicks()
      const userProjects = getCurrentUserProjectClicks()

      setUserLinkClicks(userLinks)
      setUserNavigationClicks(userNavs)
      setUserProjectClicks(userProjects)
    }
  }, [selectedUserId])

  const authenticate = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/analytics/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed")
      }

      // Store token in localStorage for persistence
      if (data.token) {
        localStorage.setItem("analytics_token", data.token)
        setAuthToken(data.token)
      }

      setIsAuthenticated(true)
      loadAnalyticsData()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Incorrect password")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear the auth token
    localStorage.removeItem("analytics_token")
    setAuthToken(null)
    setIsAuthenticated(false)
    setPassword("")
    setSummary(null)
    setVisitorData([])
  }

  // Auto-lock when panel is closed
  const closePanel = () => {
    setIsOpen(false)
    logout() // Automatically log out when panel is closed
  }

  // Handle clearing analytics data
  const handleClearData = () => {
    setIsClearing(true)

    try {
      clearAnalyticsData()

      // Reset all state
      setNavigationClicks({})
      setLinkClicks({})
      setProjectClicks({})
      setSessionDurations([])
      setAverageSessionDuration(0)
      setUsers({})
      setSelectedUserId(null)
      setUserLinkClicks({})
      setUserNavigationClicks({})
      setUserProjectClicks({})

      // Reload empty data
      loadClientAnalyticsData()
    } catch (error) {
      console.error("Error clearing analytics data:", error)
    } finally {
      setIsClearing(false)
    }
  }

  // Update the loadAnalyticsData function to use the auth token
  const loadAnalyticsData = async () => {
    setIsLoading(true)

    try {
      // Use the token from state
      const token = authToken || localStorage.getItem("analytics_token")

      if (!token) {
        throw new Error("No authentication token available")
      }

      const response = await fetch("/api/analytics/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Analytics API error:", response.status, errorText)

        // If unauthorized, clear auth state
        if (response.status === 401) {
          setIsAuthenticated(false)
          localStorage.removeItem("analytics_token")
          setAuthToken(null)
          throw new Error("Authentication expired. Please log in again.")
        }

        throw new Error(`Failed to load analytics data: ${response.status}`)
      }

      const data = await response.json()

      // Check if data has the expected structure
      if (!data || typeof data !== "object") {
        console.error("Invalid analytics data format:", data)
        throw new Error("Invalid data format received from analytics API")
      }

      // Set default values if properties are missing
      const summary = data.summary || {
        totalViews: 0,
        uniqueVisitors: 0,
        topCountries: [],
        topReferrers: [],
        viewsByDay: [],
        topPages: [],
      }

      const visitors = Array.isArray(data.recentVisitors) ? data.recentVisitors : []

      setSummary(summary)
      setVisitorData(
        visitors.map((visitor: Visitor) => ({
          ...visitor,
          timestamp: new Date(visitor.timestamp),
        })),
      )

      // Load client-side analytics data
      loadClientAnalyticsData()
    } catch (error) {
      console.error("Error loading analytics data:", error)
      setError(error instanceof Error ? error.message : "Failed to load analytics data")

      // Set default empty data to prevent rendering errors
      setSummary({
        totalViews: 0,
        uniqueVisitors: 0,
        topCountries: [],
        topReferrers: [],
        viewsByDay: [],
        topPages: [],
      })
      setVisitorData([])
    } finally {
      setIsLoading(false)
    }
  }

  // Format date for display
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Handle keyboard shortcut to open panel (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        setIsOpen((prev) => !prev)
      }

      // Close on escape key
      if (e.key === "Escape" && isOpen) {
        closePanel()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Load data when panel is opened and user is authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAnalyticsData()
    }
  }, [isOpen, isAuthenticated])

  // Get section name from navigation ID
  const getSectionName = (navId: string) => {
    if (!navId.startsWith("nav-")) return navId

    const sectionId = navId.replace("nav-", "")
    const sectionMap: Record<string, string> = {
      home: "Home",
      skills: "Skills",
      experience: "Experience",
      projects: "Projects",
      education: "Education",
      certificates: "Certificates",
      gallery: "Gallery",
      contact: "Contact",
    }

    return sectionMap[sectionId] || sectionId
  }

  // Get user-specific sessions
  const getUserSessions = (userId: string) => {
    return sessionDurations.filter((session) => session.userId === userId)
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <>
      {/* Hidden button in footer that only the owner would know about */}
      <div className="fixed bottom-2 right-2 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="opacity-20 hover:opacity-100 transition-opacity"
          onClick={() => setIsOpen(true)}
          title="Analytics (Ctrl+Shift+A)"
        >
          <BarChart3 className="h-4 w-4" />
          <span className="sr-only">View Analytics</span>
        </Button>
      </div>

      {/* Analytics Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={closePanel}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Portfolio Analytics</h2>
                  {isAuthenticated && (
                    <Badge variant="outline" className="ml-2">
                      <Eye className="h-3 w-3 mr-1" /> Owner View
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={closePanel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
                {!isAuthenticated ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Authentication Required
                      </CardTitle>
                      <CardDescription>Please enter your password to view analytics data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && authenticate()}
                            disabled={isLoading}
                          />
                          {error && <p className="text-sm text-destructive">{error}</p>}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={authenticate} className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Authenticating...
                          </span>
                        ) : (
                          <>
                            <Unlock className="h-4 w-4 mr-2" /> Unlock Analytics
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ) : isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="mt-4 text-muted-foreground">Loading analytics data...</p>
                  </div>
                ) : (
                  <Tabs defaultValue="summary" value={activeTab} onValueChange={handleTabChange}>
                    <div className="flex justify-between items-center mb-4">
                      <TabsList className="grid w-full grid-cols-7">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="visitors">Visitors</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="navigation">Navigation</TabsTrigger>
                        <TabsTrigger value="links">Link Clicks</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="sessions">Sessions</TabsTrigger>
                      </TabsList>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="ml-2">
                            <Trash2 className="h-4 w-4 mr-1" /> Clear Data
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Clear Analytics Data</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete all analytics data stored in your browser. This action cannot
                              be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleClearData}
                              disabled={isClearing}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {isClearing ? (
                                <>
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Clearing...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-2" /> Clear All Data
                                </>
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {/* Summary Tab */}
                    <TabsContent value="summary" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{summary?.totalViews || 0}</div>
                            <p className="text-xs text-muted-foreground">Last 30 days</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{Object.keys(users).length}</div>
                            <p className="text-xs text-muted-foreground">Total tracked users</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{formatDuration(averageSessionDuration)}</div>
                            <p className="text-xs text-muted-foreground">Based on {sessionDurations.length} sessions</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-medium">Top Countries</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {summary?.topCountries.length ? (
                                summary.topCountries.map((item, i) => (
                                  <li key={i} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span>{item.country}</span>
                                    </div>
                                    <Badge variant="secondary">{item.count}</Badge>
                                  </li>
                                ))
                              ) : (
                                <li className="text-muted-foreground text-sm">No data available</li>
                              )}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-medium">Top Referrers</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {summary?.topReferrers.length ? (
                                summary.topReferrers.map((item, i) => (
                                  <li key={i} className="flex items-center justify-between">
                                    <span>{item.source}</span>
                                    <Badge variant="secondary">{item.count}</Badge>
                                  </li>
                                ))
                              ) : (
                                <li className="text-muted-foreground text-sm">No data available</li>
                              )}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm font-medium">Views Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] flex items-end gap-2">
                            {summary?.viewsByDay.length ? (
                              summary.viewsByDay.map((day, i) => (
                                <div key={i} className="flex flex-col items-center flex-1">
                                  <div
                                    className="bg-primary/80 rounded-t w-full"
                                    style={{
                                      height: `${(day.count / Math.max(...(summary.viewsByDay.map((d) => d.count) || 1))) * 180}px`,
                                      minHeight: "4px",
                                    }}
                                  ></div>
                                  <span className="text-xs mt-1 text-muted-foreground">
                                    {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="w-full flex items-center justify-center text-muted-foreground">
                                No data available
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Visitors Tab */}
                    <TabsContent value="visitors" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Visitors</CardTitle>
                          <CardDescription>The last {visitorData.length} visitors to your portfolio</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {visitorData.length > 0 ? (
                            <div className="space-y-4">
                              {visitorData.map((visitor, i) => (
                                <div key={i} className="flex items-start justify-between border-b pb-3 last:border-0">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="font-mono text-xs">
                                        {visitor.id.substring(0, 10)}...
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {visitor.device || "Unknown"}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {visitor.browser || "Unknown"}
                                      </span>
                                    </div>
                                    <div className="flex items-center mt-1 text-sm">
                                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                                      <span>{visitor.location || "Unknown"}</span>
                                    </div>
                                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span>{formatDate(visitor.timestamp)}</span>
                                    </div>
                                    {visitor.path && (
                                      <div className="mt-1 text-xs text-muted-foreground">Page: {visitor.path}</div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <Badge variant="outline">{visitor.referrer || "Direct"}</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-8 text-center text-muted-foreground">No visitor data available</div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>User Analytics</CardTitle>
                          <CardDescription>Track individual user behavior on your portfolio</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {Object.keys(users).length > 0 ? (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold">{Object.keys(users).length}</div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold">{sessionDurations.length}</div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Avg. Sessions Per User</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold">
                                      {Object.keys(users).length > 0
                                        ? (sessionDurations.length / Object.keys(users).length).toFixed(1)
                                        : "0"}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              <div>
                                <h3 className="text-sm font-medium mb-3">User List</h3>
                                <div className="overflow-auto">
                                  <table className="w-full min-w-[500px] border-collapse">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="text-left p-2">User ID</th>
                                        <th className="text-center p-2">Sessions</th>
                                        <th className="text-center p-2">Total Time</th>
                                        <th className="text-center p-2">First Visit</th>
                                        <th className="text-right p-2">Last Visit</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.entries(users)
                                        .sort(
                                          (a, b) =>
                                            new Date(b[1].lastVisit).getTime() - new Date(a[1].lastVisit).getTime(),
                                        )
                                        .map(([userId, userData], index) => (
                                          <tr
                                            key={index}
                                            className={`border-b hover:bg-muted/50 cursor-pointer ${selectedUserId === userId ? "bg-muted/70" : ""}`}
                                            onClick={() => setSelectedUserId(userId)}
                                          >
                                            <td className="p-2 font-mono text-xs">
                                              <div className="flex items-center">
                                                <User className="h-3 w-3 mr-2 text-primary" />
                                                {userId.substring(0, 10)}...
                                              </div>
                                            </td>
                                            <td className="p-2 text-center">
                                              <Badge variant="outline">{userData.totalSessions}</Badge>
                                            </td>
                                            <td className="p-2 text-center">
                                              {formatDuration(userData.totalDuration)}
                                            </td>
                                            <td className="p-2 text-center text-sm text-muted-foreground">
                                              {formatDate(userData.firstVisit)}
                                            </td>
                                            <td className="p-2 text-right text-sm text-muted-foreground">
                                              {formatDate(userData.lastVisit)}
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {selectedUserId && (
                                <div className="mt-6 border-t pt-6">
                                  <h3 className="text-lg font-medium mb-4">
                                    User Detail: {selectedUserId.substring(0, 10)}...
                                  </h3>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Session History</CardTitle>
                                      </CardHeader>
                                      <CardContent className="max-h-[300px] overflow-auto">
                                        {getUserSessions(selectedUserId).length > 0 ? (
                                          <ul className="space-y-2">
                                            {getUserSessions(selectedUserId).map((session, i) => (
                                              <li
                                                key={i}
                                                className="flex items-center justify-between border-b pb-2 last:border-0"
                                              >
                                                <div className="flex items-center">
                                                  <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                                                  <span className="text-sm">{formatDuration(session.duration)}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                  {formatDate(session.date)}
                                                </span>
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <p className="text-muted-foreground text-sm">No session data available</p>
                                        )}
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">User Statistics</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <ul className="space-y-3">
                                          <li className="flex items-center justify-between">
                                            <span className="text-sm">First Visit</span>
                                            <span className="text-sm text-muted-foreground">
                                              {formatDate(users[selectedUserId].firstVisit)}
                                            </span>
                                          </li>
                                          <li className="flex items-center justify-between">
                                            <span className="text-sm">Last Visit</span>
                                            <span className="text-sm text-muted-foreground">
                                              {formatDate(users[selectedUserId].lastVisit)}
                                            </span>
                                          </li>
                                          <li className="flex items-center justify-between">
                                            <span className="text-sm">Total Sessions</span>
                                            <Badge>{users[selectedUserId].totalSessions}</Badge>
                                          </li>
                                          <li className="flex items-center justify-between">
                                            <span className="text-sm">Total Time Spent</span>
                                            <Badge variant="outline">
                                              {formatDuration(users[selectedUserId].totalDuration)}
                                            </Badge>
                                          </li>
                                          <li className="flex items-center justify-between">
                                            <span className="text-sm">Avg. Session Duration</span>
                                            <span className="text-sm text-muted-foreground">
                                              {users[selectedUserId].totalSessions > 0
                                                ? formatDuration(
                                                    users[selectedUserId].totalDuration /
                                                      users[selectedUserId].totalSessions,
                                                  )
                                                : "N/A"}
                                            </span>
                                          </li>
                                        </ul>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">User Navigation Clicks</CardTitle>
                                      </CardHeader>
                                      <CardContent className="max-h-[300px] overflow-auto">
                                        {Object.keys(userNavigationClicks).length > 0 ? (
                                          <ul className="space-y-2">
                                            {Object.entries(userNavigationClicks)
                                              .sort((a, b) => b[1] - a[1])
                                              .map(([navId, count], index) => (
                                                <li
                                                  key={index}
                                                  className="flex items-center justify-between border-b pb-2 last:border-0"
                                                >
                                                  <div className="flex items-center">
                                                    <MousePointer className="h-3 w-3 mr-2 text-muted-foreground" />
                                                    <span className="text-sm">{getSectionName(navId)}</span>
                                                  </div>
                                                  <Badge variant="secondary">{count} clicks</Badge>
                                                </li>
                                              ))}
                                          </ul>
                                        ) : (
                                          <p className="text-muted-foreground text-sm">
                                            No navigation click data available
                                          </p>
                                        )}
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">User Link Clicks</CardTitle>
                                      </CardHeader>
                                      <CardContent className="max-h-[300px] overflow-auto">
                                        {Object.keys(userLinkClicks).length > 0 ? (
                                          <ul className="space-y-2">
                                            {Object.entries(userLinkClicks)
                                              .sort((a, b) => b[1].count - a[1].count)
                                              .map(([linkId, data], index) => (
                                                <li
                                                  key={index}
                                                  className="flex items-center justify-between border-b pb-2 last:border-0"
                                                >
                                                  <div className="flex items-center">
                                                    <Link2 className="h-3 w-3 mr-2 text-muted-foreground" />
                                                    <span className="text-sm">{linkId}</span>
                                                  </div>
                                                  <Badge variant="secondary">{data.count} clicks</Badge>
                                                </li>
                                              ))}
                                          </ul>
                                        ) : (
                                          <p className="text-muted-foreground text-sm">No link click data available</p>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <div className="mt-4">
                                    <Card>
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">User Project Clicks</CardTitle>
                                      </CardHeader>
                                      <CardContent className="max-h-[300px] overflow-auto">
                                        {Object.keys(userProjectClicks).length > 0 ? (
                                          <ul className="space-y-2">
                                            {Object.entries(userProjectClicks)
                                              .sort((a, b) => b[1].count - a[1].count)
                                              .map(([projectId, data], index) => (
                                                <li
                                                  key={index}
                                                  className="flex items-center justify-between border-b pb-2 last:border-0"
                                                >
                                                  <div className="flex items-center">
                                                    <Briefcase className="h-3 w-3 mr-2 text-muted-foreground" />
                                                    <span className="text-sm">{projectId}</span>
                                                  </div>
                                                  <Badge variant="secondary">{data.count} clicks</Badge>
                                                </li>
                                              ))}
                                          </ul>
                                        ) : (
                                          <p className="text-muted-foreground text-sm">
                                            No project click data available
                                          </p>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="py-8 text-center text-muted-foreground">
                              No user data available yet. This will track individual users who visit your portfolio.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Navigation Tab */}
                    <TabsContent value="navigation" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Navigation Clicks</CardTitle>
                          <CardDescription>Track how users navigate through your portfolio</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {Object.keys(navigationClicks).length > 0 ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(navigationClicks).map(([navId, count], index) => (
                                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="flex items-center gap-2">
                                      <MousePointer className="h-4 w-4 text-primary" />
                                      <span className="font-medium">{getSectionName(navId)}</span>
                                    </div>
                                    <Badge>{count} clicks</Badge>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-6">
                                <h3 className="text-sm font-medium mb-3">Click Distribution</h3>
                                <div className="h-[200px] flex items-end gap-2">
                                  {Object.entries(navigationClicks).map(([navId, count], index) => {
                                    const maxCount = Math.max(...Object.values(navigationClicks))
                                    const height = maxCount > 0 ? (count / maxCount) * 180 : 0

                                    return (
                                      <div key={index} className="flex flex-col items-center flex-1">
                                        <div
                                          className="bg-primary/80 rounded-t w-full"
                                          style={{
                                            height: `${height}px`,
                                            minHeight: "4px",
                                          }}
                                        ></div>
                                        <span className="text-xs mt-1 text-muted-foreground truncate max-w-full px-1">
                                          {getSectionName(navId)}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="py-8 text-center text-muted-foreground">
                              No navigation data available yet. This will track when users click on navigation links.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Link Clicks Tab */}
                    <TabsContent value="links" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Link Clicks</CardTitle>
                          <CardDescription>Track which links users are clicking on your portfolio</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {Object.keys(linkClicks).length > 0 ? (
                            <div className="space-y-4">
                              <div className="overflow-auto">
                                <table className="w-full min-w-[500px] border-collapse">
                                  <thead>
                                    <tr className="border-b">
                                      <th className="text-left p-2">Link ID</th>
                                      <th className="text-left p-2">URL</th>
                                      <th className="text-center p-2">Clicks</th>
                                      <th className="text-right p-2">Last Clicked</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Object.entries(linkClicks).map(([id, data], index) => (
                                      <tr key={index} className="border-b hover:bg-muted/50">
                                        <td className="p-2 font-medium">{id}</td>
                                        <td className="p-2 text-sm truncate max-w-[200px]">
                                          {data.url ? (
                                            <a
                                              href={data.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-primary hover:underline"
                                            >
                                              {data.url}
                                            </a>
                                          ) : (
                                            <span className="text-muted-foreground">No URL</span>
                                          )}
                                        </td>
                                        <td className="p-2 text-center">
                                          <Badge variant="secondary">{data.count}</Badge>
                                        </td>
                                        <td className="p-2 text-right text-sm text-muted-foreground">
                                          {formatDate(data.lastClicked)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="py-8 text-center text-muted-foreground">
                              No link click data available yet. This will track when users click on links in your
                              portfolio.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Projects Tab */}
                    <TabsContent value="projects" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Project Clicks</CardTitle>
                          <CardDescription>Track which projects users are interacting with</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {Object.keys(projectClicks).length > 0 ? (
                            <div className="space-y-4">
                              <div className="overflow-auto">
                                <table className="w-full min-w-[500px] border-collapse">
                                  <thead>
                                    <tr className="border-b">
                                      <th className="text-left p-2">Project ID</th>
                                      <th className="text-center p-2">Clicks</th>
                                      <th className="text-right p-2">Last Clicked</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Object.entries(projectClicks)
                                      .sort((a, b) => b[1].count - a[1].count)
                                      .map(([id, data], index) => (
                                        <tr key={index} className="border-b hover:bg-muted/50">
                                          <td className="p-2 font-medium">
                                            <div className="flex items-center">
                                              <Briefcase className="h-4 w-4 mr-2 text-primary" />
                                              {id}
                                            </div>
                                          </td>
                                          <td className="p-2 text-center">
                                            <Badge variant="secondary">{data.count}</Badge>
                                          </td>
                                          <td className="p-2 text-right text-sm text-muted-foreground">
                                            {formatDate(data.lastClicked)}
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>

                              <div className="mt-6">
                                <h3 className="text-sm font-medium mb-3">Project Popularity</h3>
                                <div className="h-[200px] flex items-end gap-2">
                                  {Object.entries(projectClicks)
                                    .sort((a, b) => b[1].count - a[1].count)
                                    .slice(0, 10)
                                    .map(([projectId, data], index) => {
                                      const maxCount = Math.max(...Object.values(projectClicks).map((d) => d.count))
                                      const height = maxCount > 0 ? (data.count / maxCount) * 180 : 0

                                      return (
                                        <div key={index} className="flex flex-col items-center flex-1">
                                          <div
                                            className="bg-primary/80 rounded-t w-full"
                                            style={{
                                              height: `${height}px`,
                                              minHeight: "4px",
                                            }}
                                          ></div>
                                          <span className="text-xs mt-1 text-muted-foreground truncate max-w-full px-1">
                                            {projectId.split("-")[0]}
                                          </span>
                                        </div>
                                      )
                                    })}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="py-8 text-center text-muted-foreground">
                              No project click data available yet. This will track when users interact with projects in
                              your portfolio.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Sessions Tab */}
                    <TabsContent value="sessions" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>User Sessions</CardTitle>
                          <CardDescription>Track how long users spend on your portfolio</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="p-4 border rounded-md">
                              <div className="flex items-center gap-2 mb-2">
                                <Timer className="h-5 w-5 text-primary" />
                                <h3 className="font-medium">Average Session Duration</h3>
                              </div>
                              <p className="text-3xl font-bold">{formatDuration(averageSessionDuration)}</p>
                            </div>
                            <div className="p-4 border rounded-md">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-5 w-5 text-primary" />
                                <h3 className="font-medium">Total Sessions</h3>
                              </div>
                              <p className="text-3xl font-bold">{sessionDurations.length}</p>
                            </div>
                          </div>

                          {sessionDurations.length > 0 ? (
                            <div className="space-y-4">
                              <h3 className="text-sm font-medium">Recent Sessions</h3>
                              <div className="overflow-auto">
                                <table className="w-full min-w-[500px] border-collapse">
                                  <thead>
                                    <tr className="border-b">
                                      <th className="text-left p-2">User</th>
                                      <th className="text-left p-2">Session ID</th>
                                      <th className="text-center p-2">Duration</th>
                                      <th className="text-right p-2">Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sessionDurations
                                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                      .slice(0, 10)
                                      .map((session, index) => (
                                        <tr key={index} className="border-b hover:bg-muted/50">
                                          <td className="p-2 font-mono text-xs">
                                            <div className="flex items-center">
                                              <User className="h-3 w-3 mr-2 text-primary" />
                                              {session.userId.substring(0, 8)}...
                                            </div>
                                          </td>
                                          <td className="p-2 font-mono text-xs">
                                            {session.sessionId.substring(0, 12)}...
                                          </td>
                                          <td className="p-2 text-center">
                                            <Badge variant="outline">{formatDuration(session.duration)}</Badge>
                                          </td>
                                          <td className="p-2 text-right text-sm text-muted-foreground">
                                            {formatDate(session.date)}
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>

                              <div className="mt-6">
                                <h3 className="text-sm font-medium mb-3">Session Duration Distribution</h3>
                                <div className="h-[200px] flex items-end gap-1">
                                  {sessionDurations
                                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                    .slice(-20)
                                    .map((session, index) => {
                                      const maxDuration = Math.max(...sessionDurations.map((s) => s.duration))
                                      const height = maxDuration > 0 ? (session.duration / maxDuration) * 180 : 0

                                      return (
                                        <div key={index} className="flex flex-col items-center flex-1">
                                          <div
                                            className="bg-primary/80 rounded-t w-full"
                                            style={{
                                              height: `${height}px`,
                                              minHeight: "4px",
                                            }}
                                          ></div>
                                          <span className="text-xs mt-1 text-muted-foreground rotate-45 origin-top-left">
                                            {new Date(session.date).toLocaleDateString()}
                                          </span>
                                        </div>
                                      )
                                    })}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="py-8 text-center text-muted-foreground">
                              No session data available yet. This will track how long users spend on your portfolio.
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                )}
              </div>

              {isAuthenticated && (
                <div className="border-t p-4 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    Data from{" "}
                    {new Date(new Date().setDate(new Date().getDate() - 30)).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    to {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <Lock className="h-3 w-3 mr-2" /> Lock Analytics
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
