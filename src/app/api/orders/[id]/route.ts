export const runtime = "nodejs"
export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/utils/container"
import type { AppApiService } from "@/infrastructure/services/api"

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // unwrap params
    const { id } = await context.params

    const { status, plannedProductionQty } = await req.json()

    const apiService = container.resolve<AppApiService>("apiService")
    const order = await apiService.updateOrderStatus(id, status)

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update order" },
      { status: 500 }
    )
  }
}