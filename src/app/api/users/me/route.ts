import { type NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/utils/container"
import type { AppCryptoService } from "@/infrastructure/services/crypto"

container.resolve("mongo")

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] /api/users/me route called")
    const token = request.cookies.get("token")?.value

    if (!token) {
      console.log("[v0] No token found in cookies")
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    console.log("[v0] Token found, verifying...")
    const cryptoService = container.resolve<AppCryptoService>("cryptoService")
    const user = cryptoService.verifyToken(token)

    console.log("[v0] Token verified successfully")
    return NextResponse.json({ user }, { status: 200 })
  } catch (error: any) {
    console.log("[v0] Error in /api/users/me:", error.message)
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }
}
