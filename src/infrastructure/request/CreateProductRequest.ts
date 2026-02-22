import { Calorie } from "../models/enums/calorie"
import { Category } from "../models/enums/category"
import { Measure } from "../models/enums/measure"

export interface CreateProductRequest {
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
}