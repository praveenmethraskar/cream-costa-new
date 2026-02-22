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
  constructor(private envService: EnvService) {}

  generateToken(user: User): string {

    console.log("[v0] Generating token for user", user)
    let expiresIn: string

    switch (user.role) {
      case Role.OWNER:
        expiresIn = this.envService.jwtExpSuperAdmin
        break
      case Role.MANAGER:
        expiresIn = this.envService.jwtExpAdmin
        break
      case Role.USER:
        expiresIn = this.envService.jwtExpUser
        break
      default:
        throw new Error("Invalid role")
    }

    const payload: TokenPayload = {
      id: user._id!.toString(),
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      role: user.role,
    }

    const secretKey: string = this.envService.jwtSecret

    const options: SignOptions = {
      expiresIn: `${Number.parseInt(expiresIn, 10)}h`,
      algorithm: "HS256",
    }

    return jwt.sign(payload, secretKey, options)
  }

  verifyToken(token: string): TokenPayload {
    try {
      const secretKey: string = this.envService.jwtSecret
      const decoded = jwt.verify(token, secretKey) as TokenPayload
      return decoded
    } catch (error) {
      throw new Error("Invalid or expired token")
    }
  }
}
