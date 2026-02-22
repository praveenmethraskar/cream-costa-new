
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/utils/container"
import type { AppApiService } from "@/infrastructure/services/api"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const apiService = container.resolve<AppApiService>("apiService")

    const production = await apiService.createProduction({
      ...body
    })

    return NextResponse.json(production, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create production" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const apiService = container.resolve<AppApiService>("apiService")
    const productions = await apiService.getProduction()

    return NextResponse.json(productions, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch productions" },
      { status: 500 }
    )
  }
}