import { Role } from "../enums/role"

export interface RegisterBody {
    firstname: string
    lastname: string
    phone: string
    email: string
    username: string
    password: string
    role: Role
}
