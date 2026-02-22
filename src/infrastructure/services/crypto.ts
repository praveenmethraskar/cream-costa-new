import jwt, { type SignOptions } from "jsonwebtoken"
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
  constructor(private envService: EnvService) {
    if (!this.envService.jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables")
    }
  }

  generateToken(user: User): string {
    if (!user._id) {
      throw new Error("User ID missing while generating token")
    }

    let expiresInHours: number

    switch (user.role) {
      case Role.OWNER:
        expiresInHours = Number(this.envService.jwtExpSuperAdmin)
        break
      case Role.MANAGER:
        expiresInHours = Number(this.envService.jwtExpAdmin)
        break
      case Role.USER:
        expiresInHours = Number(this.envService.jwtExpUser)
        break
      default:
        throw new Error("Invalid role")
    }

    if (isNaN(expiresInHours)) {
      throw new Error("Invalid JWT expiration configuration")
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
      expiresIn: `${expiresInHours}h`,
      algorithm: "HS256",
    }

    return jwt.sign(payload, this.envService.jwtSecret, options)
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.envService.jwtSecret) as TokenPayload
    } catch (error) {
      throw new Error("Invalid or expired token")
    }
  }
}