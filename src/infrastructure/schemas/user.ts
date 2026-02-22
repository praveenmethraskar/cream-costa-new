import mongoose, { ObjectId } from "mongoose"
import { Role } from "../models/enums/role"

export interface User {
  _id?: ObjectId
  firstname: string
  lastname: string
  phone: string
  email: string
  username: string
  password: string
  role: Role
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new mongoose.Schema(
  {
    firstname: { 
      type: String, 
      required: true 
    },
    lastname: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String,
      unique: true,
      required: true 
    },
    email: { 
      type: String,
      unique: true,
      required: true 
    },
    username: { 
      type: String, 
      required: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
        type: Number,
        enum: Object.values(Role).filter(v => typeof v === "number"),
        required: true 
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.User || mongoose.model("User", UserSchema)