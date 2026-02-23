// src/app/api/products/route.ts
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/utils/container"
import { AppApiService } from "@/infrastructure/services/api"



export async function GET() {
  try {
    container.resolve("mongo")  // Ensure DB connection
    const apiService = container.resolve<AppApiService>("apiService")

    const products = await apiService.getProducts()

    return NextResponse.json(products, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch products" },
      { status: 400 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    container.resolve("mongo")  // Ensure DB connection

    const body = await req.json()
    const apiService = container.resolve<AppApiService>("apiService")

    const products = await apiService.createProduct(body)

    return NextResponse.json(products, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch products" },
      { status: 400 }
    )
  }

  
}