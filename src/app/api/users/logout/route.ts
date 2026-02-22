export const runtime = "nodejs"
export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("[v0] /api/users/logout route called")
    const isProduction = process.env.NODE_ENV === "production"

    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 })

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })

    console.log("[v0] Logout successful, cookie cleared")
    return response
  } catch (error: any) {
    console.log("[v0] Error in /api/users/logout:", error.message)
    return NextResponse.json({ message: error.message || "Logout failed" }, { status: 500 })
  }
}
