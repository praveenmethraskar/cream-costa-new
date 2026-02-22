// src/app/api/register/route.ts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { container } from "@/infrastructure/utils/container"
import { AppApiService } from "@/infrastructure/services/api"
import { RegisterBody } from "@/infrastructure/models/user/RegisterBody"

container.resolve("mongo")  // Ensure database is connected

export async function POST(req: Request) {
  try {
    const body: RegisterBody = await req.json()

    // Basic validation
    if (!body.firstname || !body.lastname || !body.username || !body.password) {
      return NextResponse.json(
        { message: "firstname, lastname, username and password are required" },
        { status: 400 }
      )
    }

    const apiService = container.resolve<AppApiService>("apiService")

    const user = await apiService.register(body as any)

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Registration failed" },
      { status: 400 }
    )
  }
}
