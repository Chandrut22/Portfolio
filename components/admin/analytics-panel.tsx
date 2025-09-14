"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, Globe, Clock, MousePointer, Link2, Briefcase, Trash2, Lock, Unlock, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { clearAnalyticsData } from "@/lib/click-tracker"

export default function AnalyticsPanel() {
  // Core state
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("summary")

  // Data state
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [analytics, setAnalytics] = useState<{
    pageViews: Record<string, number>;
    linkClicks: Record<string, number>;
    navClicks: Record<string, number>;
    projectClicks: Record<string, number>;
    sessions: { id: string; duration: number; date: string }[];
  }>({
    pageViews: {},
    linkClicks: {},
    navClicks: {},
    projectClicks: {},
    sessions: [],
  })

  // Check for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem("analytics_token")
    if (token) {
      setAuthToken(token)
      setIsAuthenticated(true)
    }
  }, [])

  // Load data when panel is opened and authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAnalyticsData()
    }
  }, [isOpen, isAuthenticated])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        setIsOpen((prev) => !prev)
      }
      if (e.key === "Escape" && isOpen) {
        closePanel()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Authentication
  const authenticate = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/analytics/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed")
      }

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
    localStorage.removeItem("analytics_token")
    setAuthToken(null)
    setIsAuthenticated(false)
    setPassword("")
    setSummary(null)
    setVisitors([])
  }

  const closePanel = () => {
    setIsOpen(false)
    logout()
  }

  // Data loading
  const loadAnalyticsData = async () => {
    setIsLoading(true)

    try {
      const token = authToken || localStorage.getItem("analytics_token")
      if (!token) throw new Error("No authentication token available")

      const response = await fetch("/api/analytics/data", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false)
          localStorage.removeItem("analytics_token")
          setAuthToken(null)
          throw new Error("Authentication expired. Please log in again.")
        }
        throw new Error(`Failed to load analytics data: ${response.status}`)
      }

      const data = await response.json()

      // Process server data
      setSummary(data.summary || createEmptySummary())
      setVisitors(
        (data.recentVisitors || []).map((v: any) => ({
          ...v,
          timestamp: new Date(v.timestamp),
        })),
      )

      // Load client-side data
      loadClientData()
    } catch (error) {
      console.error("Error loading analytics data:", error)
      setError(error instanceof Error ? error.message : "Failed to load analytics data")
      setSummary(createEmptySummary())
      setVisitors([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load data from localStorage
  const loadClientData = () => {
    // This would be implemented to load data from localStorage
    // For now, we'll use placeholder data
    setAnalytics({
      pageViews: { "/": 10, "/projects": 5, "/contact": 3 },
      linkClicks: { github: 7, linkedin: 4, twitter: 2 },
      navClicks: { home: 12, projects: 8, contact: 5 },
      projectClicks: { "project-1": 6, "project-2": 4, "project-3": 2 },
      sessions: [
        { id: "1", duration: 120, date: new Date().toISOString() },
        { id: "2", duration: 180, date: new Date().toISOString() },
      ],
    })
  }

  // Clear all analytics data
  const handleClearData = async () => {
    setIsClearing(true)

    try {
      // Clear client-side data
      clearAnalyticsData()

      // Clear server-side data
      const token = authToken || localStorage.getItem("analytics_token")
      if (token) {
        await fetch("/api/analytics/clear", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        })
      }

      // Reset state
      setSummary(createEmptySummary())
      setVisitors([])
      setAnalytics({
        pageViews: {},
        linkClicks: {},
        navClicks: {},
        projectClicks: {},
        sessions: [],
      })
    } catch (error) {
      console.error("Error clearing analytics data:", error)
    } finally {
      setIsClearing(false)
    }
  }

  // Helper functions
  const createEmptySummary = (): AnalyticsSummary => ({
    totalViews: 0,
    uniqueVisitors: 0,
    topCountries: [],
    topReferrers: [],
    viewsByDay: [],
    topPages: [],
  })

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  // Render functions
  const renderAuthScreen = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-4 w-4" /> Authentication Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && authenticate()}
            disabled={isLoading}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={authenticate} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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
        </div>
      </CardContent>
    </Card>
  )

  const renderLoadingScreen = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <svg
        className="animate-spin h-8 w-8 text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="mt-4 text-muted-foreground">Loading analytics data...</p>
    </div>
  )

  const renderSummaryTab = () => (
    <TabsContent value="summary" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Views" value={summary?.totalViews || 0} subtitle="Last 30 days" />
        <StatCard title="Unique Visitors" value={summary?.uniqueVisitors || 0} subtitle="Last 30 days" />
        <StatCard
          title="Avg. Session Time"
          value={formatDuration(
            analytics.sessions.reduce((sum, s) => sum + (typeof s.duration === "number" ? s.duration : 0), 0) /
              Math.max(1, analytics.sessions.length),
          )}
          subtitle={`Based on ${analytics.sessions.length} sessions`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {summary?.topCountries?.length ? (
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
              {summary?.topReferrers?.length ? (
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
            {summary?.viewsByDay?.length ? (
              summary.viewsByDay.map((day, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-primary/80 rounded-t w-full"
                    style={{
                      height: `${(day.count / Math.max(...summary.viewsByDay.map((d) => d.count), 1)) * 180}px`,
                      minHeight: "4px",
                    }}
                  ></div>
                  <span className="text-xs mt-1 text-muted-foreground">
                    {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))
            ) : (
              <div className="w-full flex items-center justify-center text-muted-foreground">No data available</div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )

  const renderVisitorsTab = () => (
    <TabsContent value="visitors" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          {visitors.length > 0 ? (
            <div className="space-y-4">
              {visitors.map((visitor, i) => (
                <div key={i} className="flex items-start justify-between border-b pb-3 last:border-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {visitor.id.substring(0, 10)}...
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {visitor.device || "Unknown"}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1 text-sm">
                      <Globe className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span>{visitor.location || "Unknown"}</span>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {visitor.localDate && visitor.localTime ? (
                        <span>{visitor.localDate} • {visitor.localTime} {visitor.timezone ? `(${visitor.timezone})` : ""}</span>
                      ) : (
                        <span>{formatDate(visitor.timestamp)}</span>
                      )}
                    </div>
                    {visitor.path && <div className="mt-1 text-xs text-muted-foreground">Page: {visitor.path}</div>}
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
  )

  const renderInteractionsTab = () => (
    <TabsContent value="interactions" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Navigation Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(analytics.navClicks).length > 0 ? (
                Object.entries(analytics.navClicks).map(([navId, count], i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MousePointer className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{navId}</span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
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
            <CardTitle className="text-sm font-medium">Link Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(analytics.linkClicks).length > 0 ? (
                Object.entries(analytics.linkClicks).map(([linkId, count], i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Link2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{linkId}</span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
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
          <CardTitle className="text-sm font-medium">Project Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {Object.entries(analytics.projectClicks).length > 0 ? (
              Object.entries(analytics.projectClicks).map(([projectId, count], i) => (
                <li key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{projectId}</span>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground text-sm">No data available</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </TabsContent>
  )

  // Reusable components
  const StatCard = ({ title, value, subtitle }: { title: string; value: string | number; subtitle: string }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )

  return (
    <>
      {/* Toggle button */}
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
              {/* Header */}
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

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
                {!isAuthenticated ? (
                  renderAuthScreen()
                ) : isLoading ? (
                  renderLoadingScreen()
                ) : (
                  <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex justify-between items-center mb-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="visitors">Visitors</TabsTrigger>
                        <TabsTrigger value="interactions">Interactions</TabsTrigger>
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
                              This will permanently delete all analytics data stored in the database and your browser.
                              This action cannot be undone.
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

                    {renderSummaryTab()}
                    {renderVisitorsTab()}
                    {renderInteractionsTab()}
                  </Tabs>
                )}
              </div>

              {/* Footer */}
              {isAuthenticated && (
                <div className="border-t p-4 flex justify-end">
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
