// API route for authentication

import { type NextRequest, NextResponse } from "next/server"
import { authenticate } from "@/lib/analytics/auth"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    const result = await authenticate(password)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Return the token in the response body instead of setting a cookie
    // This allows the client to store it in localStorage
    return NextResponse.json({
      success: true,
      token: result.token,
    })
  } catch (error) {
    console.error("Error authenticating:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

