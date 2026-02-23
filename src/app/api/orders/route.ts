export const runtime = "nodejs";
export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/utils/container"
import type { AppApiService } from "@/infrastructure/services/api"



export async function GET() {
  try {
    container.resolve("mongo")
    const apiService = container.resolve<AppApiService>("apiService")
    const orders = await apiService.getOrders()

    return NextResponse.json(orders, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    container.resolve("mongo")
    const body = await req.json()
    const apiService = container.resolve<AppApiService>("apiService")

    const order = await apiService.createOrder({
      ...body
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create order" },
      { status: 500 }
    )
  }
}