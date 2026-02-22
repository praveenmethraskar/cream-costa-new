import { type NextRequest, NextResponse } from "next/server"
import { container } from "./container"
import { AppCryptoService } from "../services/crypto"

export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized - No token provided" }, { status: 401 })
    }

    const cryptoService = container.resolve<AppCryptoService>("cryptoService")
    const decoded = cryptoService.verifyToken(token)

    return { user: decoded, error: null }
  } catch (error: any) {
    return NextResponse.json({ message: "Unauthorized - Invalid token" }, { status: 401 })
  }
}
