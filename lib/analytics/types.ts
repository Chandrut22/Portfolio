// Types for analytics data

export interface Visitor {
  id: string // Unique identifier for the visitor (hashed IP)
  timestamp: Date // When the visit occurred
  location?: string // City, Country
  country?: string // Country code
  browser?: string // Browser name
  device?: string // Device type (mobile, desktop, tablet)
  referrer?: string // Where the visitor came from
  path?: string // Page they visited
  sessionId?: string // To track unique sessions
}

export interface AnalyticsSummary {
  totalViews: number
  uniqueVisitors: number
  topCountries: { country: string; count: number }[]
  topReferrers: { source: string; count: number }[]
  viewsByDay: { date: string; count: number }[]
  topPages: { path: string; count: number }[]
}

export interface AnalyticsResponse {
  summary: AnalyticsSummary
  recentVisitors: Visitor[]
  error?: string
}

// Add a new interface for authentication response
export interface AuthResponse {
  success: boolean
  token?: string
  error?: string
}

