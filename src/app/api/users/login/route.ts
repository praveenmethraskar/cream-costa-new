// // src/app/api/login/route.ts
// import { NextResponse } from "next/server"
// import { container } from "@/infrastructure/utils/container"
// import { AppApiService } from "@/infrastructure/services/api"

// container.resolve("mongo") 

// export async function POST(req: Request) {
//   try {
//     const { username, password } = await req.json()

//     if (!username || !password) {
//       return NextResponse.json(
//         { message: "Username and password are required" },
//         { status: 400 }
//       )
//     }

//     // Resolve the ApiService from Awilix container
//     const apiService = container.resolve<AppApiService>("apiService")

//     const user = await apiService.login(username, password)

//     return NextResponse.json(
//       { message: "Login successful", user },
//       { status: 200 }
//     )
//   } catch (error: any) {
//     return NextResponse.json(
//       { message: error.message || "Login failed" },
//       { status: 400 }
//     )
//   }
// }
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { container } from "@/infrastructure/utils/container"
import type { AppApiService } from "@/infrastructure/services/api"
import type { AppCryptoService } from "@/infrastructure/services/crypto"



export async function POST(req: Request) {
  try {
    container.resolve("mongo")
    console.log("[v0] Login route called")
    const { username, password } = await req.json()
    console.log("[v0] Login attempt for username:", username)

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 })
    }

    const apiService = container.resolve<AppApiService>("apiService")
    console.log("[v0] API service resolved")

    const cryptoService = container.resolve<AppCryptoService>("cryptoService")
    console.log("[v0] Crypto service resolved")

    const user = await apiService.login(username, password)
    console.log("[v0] User authenticated:", user.email)

    const token = cryptoService.generateToken(user)
    console.log("[v0] JWT token generated")

    const isProduction = process.env.NODE_ENV === "production"

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          _id: user._id?.toString(),
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    )

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour in seconds
      path: "/",
    })

    console.log("[v0] Cookie set successfully")
    return response
  } catch (error: any) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ message: error.message || "Login failed" }, { status: 400 })
  }
}
