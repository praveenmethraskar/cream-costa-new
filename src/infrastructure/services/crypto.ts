import jwt, { type SignOptions } from "jsonwebtoken"
import type { StringValue } from "ms"
import type { EnvService } from "./env"
import type { User } from "../schemas/user"
import { Role } from "../models/enums/role"

export interface TokenPayload {
  id: string
  firstname: string
  lastname: string
  phone: string
  email: string
  role: Role
}

export interface CryptoService {
  generateToken(user: User): string
  verifyToken(token: string): TokenPayload
}

export class AppCryptoService implements CryptoService {
  private envService: EnvService

  constructor({ envService }: { envService: EnvService }) {
    this.envService = envService

    if (!this.envService.jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables")
    }
  }

  generateToken(user: User): string {
    if (!user._id) {
      throw new Error("User ID missing while generating token")
    }

    // Select expiration based on role
    let expiresIn: StringValue

    switch (user.role) {
      case Role.OWNER:
        expiresIn = (this.envService.jwtExpSuperAdmin || "12h") as StringValue
        break
      case Role.MANAGER:
        expiresIn = (this.envService.jwtExpManager || "6h") as StringValue
        break
      case Role.USER:
        expiresIn = (this.envService.jwtExpUser || "1h") as StringValue
        break
      default:
        throw new Error("Invalid role")
    }

    const payload: TokenPayload = {
      id: user._id.toString(),
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      role: user.role,
    }

    const options: SignOptions = {
      expiresIn,
      algorithm: "HS256",
    }

    return jwt.sign(payload, this.envService.jwtSecret, options)
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(
        token,
        this.envService.jwtSecret
      ) as TokenPayload
    } catch {
      throw new Error("Invalid or expired token")
    }
  }
}