// Geolocation utilities for analytics

interface GeoResponse {
  ip: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
}

// Get geolocation data from IP address
export const getGeoData = async (
  ip: string,
): Promise<{
  location?: string
  country?: string
  timezone?: string
}> => {
  try {
    // Skip localhost IPs
    if (ip === "127.0.0.1" || ip === "::1") {
      return { location: "Local Development", country: "Local" }
    }

    // Use ipinfo.io API - in production you might want to use a paid service
    // with higher rate limits or self-host a geolocation database
    const response = await fetch(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN || ""}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch geolocation data: ${response.statusText}`)
    }

    const data: GeoResponse = await response.json()

    return {
      location: data.city ? `${data.city}, ${data.country}` : data.country,
      country: data.country,
      timezone: data.timezone,
    }
  } catch (error) {
    console.error("Error getting geolocation data:", error)
    return {}
  }
}

// Parse user agent to get browser and device info
export const parseUserAgent = (
  userAgent: string,
): {
  browser: string
  device: string
} => {
  let browser = "Unknown"
  let device = "Desktop"

  // Very simplified detection - in production use a proper user-agent parser library
  if (userAgent.includes("Firefox")) {
    browser = "Firefox"
  } else if (userAgent.includes("Chrome")) {
    browser = "Chrome"
  } else if (userAgent.includes("Safari")) {
    browser = "Safari"
  } else if (userAgent.includes("Edge")) {
    browser = "Edge"
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) {
    browser = "Internet Explorer"
  }

  if (userAgent.includes("Mobile")) {
    device = "Mobile"
  } else if (userAgent.includes("Tablet") || userAgent.includes("iPad")) {
    device = "Tablet"
  }

  return { browser, device }
}

// Parse referrer to get source
export const parseReferrer = (referrer: string | null): string => {
  if (!referrer) return "Direct"

  try {
    const url = new URL(referrer)
    const hostname = url.hostname

    // Extract domain without subdomains
    const domainParts = hostname.split(".")
    let domain = hostname

    if (domainParts.length > 1) {
      // Handle common domains like co.uk, com.au, etc.
      if (
        domainParts.length > 2 &&
        (domainParts[domainParts.length - 2] === "co" || domainParts[domainParts.length - 2] === "com")
      ) {
        domain =
          domainParts[domainParts.length - 3] +
          "." +
          domainParts[domainParts.length - 2] +
          "." +
          domainParts[domainParts.length - 1]
      } else {
        domain = domainParts[domainParts.length - 2] + "." + domainParts[domainParts.length - 1]
      }
    }

    // Map common domains to sources
    if (domain.includes("google")) return "Google"
    if (domain.includes("bing")) return "Bing"
    if (domain.includes("yahoo")) return "Yahoo"
    if (domain.includes("facebook")) return "Facebook"
    if (domain.includes("instagram")) return "Instagram"
    if (domain.includes("twitter") || domain.includes("x.com")) return "Twitter"
    if (domain.includes("linkedin")) return "LinkedIn"
    if (domain.includes("github")) return "GitHub"
    if (domain.includes("reddit")) return "Reddit"
    if (domain.includes("youtube")) return "YouTube"

    // Return the domain for other sources
    return domain
  } catch (error) {
    return "Unknown"
  }
}
