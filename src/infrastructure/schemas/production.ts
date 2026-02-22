import { Document, model, models, Schema } from "mongoose"
import { Category } from "../models/enums/category"
import { ProductionStatus } from "../models/enums/productionstatus"

export interface Production extends Document {
  code: string
  name: string
  productionStatus?: ProductionStatus
  plannedProductionQty?: number
  requiredProductionQty?: number
  createdAt: Date
  updatedAt: Date
}

const productionSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: { 
      type: String, 
      required: true 
    },
    productionStatus: {
      type: String,
      enum: Object.values(ProductionStatus),
      default: ProductionStatus.PLANNED
    },
    plannedProductionQty: {
      type: Number,
    },
    requiredProductionQty: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
)

// Middleware to update the `updatedAt` field before saving
productionSchema.pre<Production>("save", function (next) {
  this.updatedAt = new Date()
  next()
})

// Create and export the model
const ProductionSchema = model<Production>("Production", productionSchema)

// Ensure indexes are created when the app starts
ProductionSchema.syncIndexes()
  .then(() => {
    console.log("Production Indexes created successfully")
  })
  .catch((err) => {
    console.error("Error creating Production indexes:", err)
  })

export { ProductionSchema }