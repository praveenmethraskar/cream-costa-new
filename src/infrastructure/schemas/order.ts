import mongoose, { type Document, model, models, ObjectId, Schema } from "mongoose"
import { v4 as uuidv4 } from 'uuid'
import { OrderStatus } from "../models/enums/orderstatus"
import { PaymentMethod } from "../models/enums/paymentmethod"


export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  individualStockDeducted: boolean
  assignedStock?: number
  needsProduction?: number
}

export interface Order extends Document {
  
  id: ObjectId
  orderId: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  paymentMethod?: PaymentMethod
  customerName?: string
  customerPhone?: string
  notes?: string
  stockDeducted?: boolean
  createdAt: Date
  updatedAt: Date
}

const orderSchema: Schema<Order> = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      default: uuidv4()
    },
    items: [
      {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        individualStockDeducted: { type: Boolean, default: false },
        assignedStock: { type: Number },
        needsProduction: { type: Number },
      },
    ],
    totalAmount: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
    },
    customerName: {
      type: String,
    },
    customerPhone: {
      type: String,
    },
    notes: {
      type: String,
    },
    stockDeducted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Middleware to update the `updatedAt` field before saving
orderSchema.pre<Order>('save', function (next) {
    this.updatedAt = new Date()
    next()
})

// Create and export the model
const OrderSchema = models.Order || model("Order", orderSchema)

// Ensure indexes are created when the app starts
OrderSchema.syncIndexes()
    .then(() => {
        console.log("Order Indexes created successfully")
    })
    .catch((err) => {
        console.error("Error creating Order indexes:", err)
    })

export default OrderSchema