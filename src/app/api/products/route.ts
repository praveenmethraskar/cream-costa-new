// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/utils/container"
import { AppApiService } from "@/infrastructure/services/api"

container.resolve("mongo")  // Ensure DB connection

export async function GET() {
  try {
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