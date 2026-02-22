import { Document, model, models, Schema } from "mongoose"
import { Measure } from "../models/enums/measure"
import { Calorie } from "../models/enums/calorie"
import { Category } from "../models/enums/category"
import { ProductionStatus } from "../models/enums/productionstatus"

export interface Product extends Document {
  code: string
  name: string
  image: string
  ingredients: string[]
  calories: Calorie[]
  measureOptions: Measure[]
  defaultMeasure: Measure
  price: number
  categories: Category
  tags?: string[]
  stock: number
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    ingredients: [{
      type: String,
      required: true,
    }],
    calories: [{
      type: String,
      required: true,
    }],
    measureOptions: {
      type: [String],
      enum: Object.values(Measure),
      required: true,
    },
    defaultMeasure: {
      type: String,
      enum: Object.values(Measure),
      required: true,
    },
    price: { 
      type: Number, 
      required: true 
    },
    categories: {
      type: String,
      enum: Object.values(Category),
      required: true,
    },
    tags: {
      type: [String],
    },
    stock: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Middleware to update the `updatedAt` field before saving
productSchema.pre<Product>("save", function (next) {
  this.updatedAt = new Date()
  next()
})

// Create and export the model
const ProductSchema = model<Product>("Product", productSchema)

// Ensure indexes are created when the app starts
ProductSchema.syncIndexes()
  .then(() => {
    console.log("Product Indexes created successfully")
  })
  .catch((err) => {
    console.error("Error creating Product indexes:", err)
  })

export { ProductSchema }