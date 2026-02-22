import { ProductionStatus } from "../models/enums/productionstatus"
import { CreateProductionRequest } from "../request/CreateProductionRequest"
import { CreateProductRequest } from "../request/CreateProductRequest"
import { Product, ProductSchema } from "../schemas/inventory"
import { Production, ProductionSchema } from "../schemas/production"


export interface ProductRepository {
  createProduct(product: CreateProductRequest): Promise<Product | null>
  getAllProducts(): Promise<Product[]>
  updateProduction(_id: string, productionStatus?: ProductionStatus, plannedProductionQty?: number): Promise<Production | null>
  addStockFromProduction(productId: string): Promise<Product | null>
  getProduction(): Promise<Production[]>
  createProduction(production: CreateProductionRequest): Promise<Production>
  updateProductStock(code: string, stock: number): Promise<Product | null>
  getProductionByCode(code: string): Promise<Production | null>
  upsertProduction(code: string, name: string, qty: number): Promise<void>
}

export class AppProductRepository implements ProductRepository {

  async createProduct(product: CreateProductRequest): Promise<Product | null> {
    const newProduct = new ProductSchema({
      code: product.code,
      name: product.name,
      image: product.image,
      stock: product.stock,
      ingredients: product.ingredients,
      calories: product.calories,
      measureOptions: product.measureOptions,
      defaultMeasure: product.defaultMeasure,
      price: product.price,
      categories: product.categories,
      tags: product?.tags,
    })
    return await newProduct.save()
  }
  
  async getAllProducts(): Promise<Product[]> {
    return await ProductSchema.find()
  }

  async getProduction(): Promise<Production[]> {
    return await ProductionSchema.find()
  }

  async getProductionByCode(code: string): Promise<Production | null> {
    return await ProductionSchema.findOne({ code })
  }

  async createProduction(production: CreateProductionRequest): Promise<Production> {

    const newProduction = new ProductionSchema({
      code: production.code,
      name: production.name,
      requiredProductionQty: production.requiredProductionQty,
      productionStatus: ProductionStatus.PLANNED,
    })

    await newProduction.save()
    return newProduction
  }

  async updateProductStock(code: string, stock: number): Promise<Product | null> {
    const product = await ProductSchema.findOne({ code })
    if (!product) throw new Error("Product not found")
    
    product.stock = stock
    return await product.save()
  }

  async upsertProduction(code: string, name: string, qty: number): Promise<void> {

    await ProductionSchema.updateOne(
      { code },
      {
        $setOnInsert: {
          code,
          name,
        },
        $inc: {
          requiredProductionQty: qty
        }
      },
      { upsert: true }
    )
  }

  async updateProduction(_id: string, productionStatus?: ProductionStatus, plannedProductionQty?: number): Promise<Production | null> {
    const productProduction = await ProductionSchema.findById({_id})
    if (!productProduction) throw new Error("Product not found")

    if (productionStatus) {
      productProduction.productionStatus = productionStatus
    }
    
    if (plannedProductionQty) {
      productProduction.plannedProductionQty = plannedProductionQty
    }

    if (productProduction.productionStatus === ProductionStatus.COMPLETED) {
      await this.addStockFromProduction(productProduction.code, productProduction?.requiredProductionQty, productProduction?.plannedProductionQty)
      
      productProduction.requiredProductionQty = 0
      productProduction.plannedProductionQty = 0
    }

    return await productProduction.save()
  }

  async addStockFromProduction(productCode: string, requiredProductionQty?: number, plannedProductionQty?: number): Promise<Product | null> {
    console.log("Adding stock from production for product:", productCode)

    const product = await ProductSchema.findOne({code: productCode})
    if (!product) throw new Error("Product not found")

    let quantityToAdd = 0

    if (plannedProductionQty && plannedProductionQty > 0) {
      quantityToAdd = plannedProductionQty
    } else if (requiredProductionQty && requiredProductionQty > 0) {
      quantityToAdd = requiredProductionQty
    }

    product.stock += quantityToAdd
    return await product.save()
  }
}