// Authentication utilities for analytics

import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import type { NextRequest } from "next/server"

// In production, use a proper secret management system
const JWT_SECRET = new TextEncoder().encode(
  process.env.ANALYTICS_JWT_SECRET || "your-secret-key-change-this-in-production",
)

// Authenticate with password
export async function authenticate(password: string): Promise<{ success: boolean; token?: string }> {
  // In production, use a secure password storage and comparison method
  const correctPassword = process.env.ANALYTICS_PASSWORD || "portfolio123"

  if (password !== correctPassword) {
    return { success: false }
  }

  // Create a JWT token
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Token expires in 24 hours
    .sign(JWT_SECRET)

  return { success: true, token }
}

// Improve the authentication verification to handle more edge cases
export async function verifyAuth(request?: NextRequest): Promise<boolean> {
  try {
    // Get token from cookies or authorization header
    let token: string | undefined

    if (request) {
      // For API routes
      token = request.headers.get("Authorization")?.replace("Bearer ", "")

      // If no Authorization header, try to get from cookies
      if (!token) {
        token = request.cookies.get("analytics_token")?.value
      }
    } else {
      // For server actions
      const cookieStore = cookies()
      token = cookieStore.get("analytics_token")?.value
    }

    if (!token) {
      return false
    }

    // Verify the token
    const { payload } = await jwtVerify(token, JWT_SECRET)

    return payload.role === "admin"
  } catch (error) {
    console.error("Auth verification error:", error)
    return false
  }
}
