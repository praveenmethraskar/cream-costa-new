export const runtime = "nodejs"
export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/utils/container"
import type { AppApiService } from "@/infrastructure/services/api"
import { ProductionStatus } from "@/infrastructure/models/enums/productionstatus"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      _id,
      productionStatus,
      plannedProductionQty,
    }: {
      _id: string
      productionStatus?: ProductionStatus
      plannedProductionQty?: number
    } = body

    if (!_id) {
      return NextResponse.json(
        { message: "_id is required" },
        { status: 400 }
      )
    }

    const apiService = container.resolve<AppApiService>("apiService")

    const production = await apiService.updateProduction(
      _id,
      productionStatus,
      plannedProductionQty
    )

    if (!production) {
      return NextResponse.json(
        { message: "Production not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(production, { status: 200 })
  } catch (error: any) {
    console.error("Update Production Error:", error)

    return NextResponse.json(
      { message: error.message || "Failed to update production" },
      { status: 500 }
    )
  }
}