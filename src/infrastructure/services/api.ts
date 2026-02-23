// src/services/api.ts
import bcrypt from "bcryptjs"
import { Logger } from "./logger"
import { UserRepository } from "@/infrastructure/repositories/user"
import { ProductRepository } from "@/infrastructure/repositories/inventory"
import { Product, ProductSchema } from "../schemas/inventory"
import { OrderRepository } from "../repositories/order"
import OrderSchema, { Order, OrderItem } from "../schemas/order"
import { OrderStatus } from "../models/enums/orderstatus"
import { User } from "../schemas/user"
import { ProductionStatus } from "../models/enums/productionstatus"
import { Production } from "../schemas/production"
import { CreateOrderRequest } from "../request/CreateOrderRequest"
import { CreateProductionRequest } from "../request/CreateProductionRequest"
import { CreateProductRequest } from "../request/CreateProductRequest"
import { Error } from "mongoose"

export interface ApiService {
  login(username: string, password: string): Promise<Object>
  register(data: User): Promise<Object>
  getProducts(): Promise<Object[]>
  createProduct(product: Product): Promise<Product | null>
  createOrder(order: CreateOrderRequest): Promise<object>
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null>
  getOrders(): Promise<Order[]>
  getProduction(): Promise<Production[]>
  createProduction(productionData: CreateProductionRequest): Promise<Production>
  updateProduction(_id: string, productionStatus?: ProductionStatus, plannedProductionQty?: number): Promise<Production | null>
}

export class AppApiService implements ApiService {
  private logger: Logger
  private userRepository: UserRepository
  private productRepository: ProductRepository
  private orderRepository: OrderRepository

  constructor({
    logger,
    userRepository,
    productRepository,
    orderRepository,
  }: {
    logger: Logger
    userRepository: UserRepository
    productRepository: ProductRepository
    orderRepository: OrderRepository
  }) {
    this.logger = logger
    this.userRepository = userRepository
    this.productRepository = productRepository
    this.orderRepository = orderRepository
  }

  async login(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findUserByUsername(username)
    if (!user) throw new Error("User not found")

    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new Error("Invalid password")

    return user
  }

  async register(data: User): Promise<User> {
    data.password = await bcrypt.hash(data.password, 10)
    return await this.userRepository.createUser(data)
  }

  async createOrder(order: CreateOrderRequest): Promise<object> {

    // const session = await mongoose.startSession()
    // session.startTransaction()

    if (!order.customerName) {
      throw new Error("Customer name is missing.")
    }

    if (!order.customerPhone) {
      throw new Error("Customer phone is missing.")
    }

    if (!order.orderId) {
      throw new Error("Order ID is missing.")
    }

    try {

      const createdOrder = await this.orderRepository.createOrder(order)

      const products = await this.productRepository.getAllProducts()

      // call allocation logic and deduct stock for each product in the inventory.
      const updatedItems = await this.allocationAndDeduction(createdOrder, products)

      const updatedOrder = await this.orderRepository.updateOrderItems(createdOrder.orderId, updatedItems)

      // await session.commitTransaction()
      // session.endSession()

      return {
        "message": "Order created successfully",
        "order": updatedOrder
      }
    } catch (error) {
      // await session.abortTransaction()
      // session.endSession()
      throw error
    }
  }

  async getProducts(): Promise<Product[]> {
    return await this.productRepository.getAllProducts()
  }

  async createProduct(product: CreateProductRequest): Promise<Product | null> {

    // Validate required fields
    const missingFields = []
    if (!product.code) missingFields.push("code")
    if (!product.name) missingFields.push("name")
    if (!product.stock === undefined) missingFields.push("stock")
    if (!product.image) missingFields.push("image")
    if (!product.ingredients) missingFields.push("ingredients")
    if (!product.calories) missingFields.push("calories")
    if (!product.measureOptions === undefined) missingFields.push("measureOptions")
    if (!product.defaultMeasure) missingFields.push("defaultMeasure")
    if (!product.price) missingFields.push("price")
    if (!product.categories === undefined) missingFields.push("categories")

    if (missingFields.length > 0) {
      throw new Error(
        `Missing fields: ${missingFields.join(", ")}`
      )
    }

    const newProduct = await this.productRepository.createProduct(product)
    return newProduct
  }

  async getProduction(): Promise<Production[]> {
    return await this.productRepository.getProduction()
  }

  async createProduction(productionData: CreateProductionRequest): Promise<Production> {

    if (!productionData.code) {
      throw new Error("Product code is required")
    }

    if (!productionData.name) {
      throw new Error("Product name is required")
    }

    if (!productionData.requiredProductionQty) {
      throw new Error("Required production quantity is required")
    }

    return await this.productRepository.createProduction(productionData)
  }

  async updateProduction(_id: string, productionStatus?: ProductionStatus, plannedProductionQty?: number): Promise<Production | null> {

    if (!_id) {
      throw new Error("Production ID is required")
    }

    if (!plannedProductionQty && !productionStatus) {
      throw new Error("At least one of plannedProductionQty or productionStatus must be provided")
    }

    const production = await this.productRepository.updateProduction(_id, productionStatus, plannedProductionQty)

    if (production?.productionStatus === ProductionStatus.COMPLETED) {
      await this.reallocatePendingOrders(production.code)
    }

    return production
  }

  async getOrders(): Promise<Order[]> {
    try {
      const orders = await OrderSchema.find({}).sort({ createdAt: -1 })
      return orders
    } catch (error) {
      console.error("[Service] Error getting orders:", error)
      return []
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const order = await this.orderRepository.getByOrderId(orderId)
    if (!order) return null

    return await this.orderRepository.updateStatus(orderId, status)
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const product = await ProductSchema.findById(id)
      return product
    } catch (error) {
      console.error("Error getting product by ID:", error)
      return null
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const product = await ProductSchema.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      )
      return product
    } catch (error) {
      console.error("Error updating product:", error)
      return null
    }
  }

  private async allocationAndDeduction(order: Order, products: Product[]): Promise<OrderItem[]> {

    const updatedItems: OrderItem[] = []

    for (const item of order.items) {

      const product = products.find(p => p.code === item.productId)

      if (!product) {
        throw new Error(`Product not found for productId: ${item.productId}`)
      }

      const availableStock = product.stock ?? 0
      const requiredQty = item.quantity

      const updatedItem: OrderItem = {
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        individualStockDeducted: item.individualStockDeducted,
        assignedStock: item.assignedStock,
        needsProduction: item.needsProduction,
      }

      // Case 1: Full stock available
      if (availableStock >= requiredQty) {

        updatedItem.assignedStock = requiredQty
        updatedItem.needsProduction = 0
        updatedItem.individualStockDeducted = true

        product.stock = availableStock - requiredQty

        if (product.stock === 0) {
          await this.productRepository.upsertProduction(
            product.code,
            product.name,
            requiredQty
          )
        }

      }
      // Case 2: Partial stock available
      else if (availableStock < requiredQty) {

        updatedItem.assignedStock = availableStock
        updatedItem.needsProduction = requiredQty - availableStock
        updatedItem.individualStockDeducted = false

        product.stock = 0

        // await this.createProduction(productionRequest)
        await this.productRepository.upsertProduction(
          product.code,
          product.name,
          updatedItem.needsProduction
        )

      }
      // Case 3: No stock available
      else {

        updatedItem.assignedStock = 0
        updatedItem.needsProduction = requiredQty
        updatedItem.individualStockDeducted = false

        // await this.createProduction(productionRequest)
        await this.productRepository.upsertProduction(
          product.code,
          product.name,
          requiredQty
        )
      }

      await this.orderRepository.updateOrderItems(order.orderId, order.items)

      // Persist updated product stock
      await this.productRepository.updateProductStock(
        product.code,
        product.stock
      )

      updatedItems.push(updatedItem)
    }

    return updatedItems
  }

  private async reallocatePendingOrders(productCode: string): Promise<void> {

    const product = await ProductSchema.findOne({ code: productCode })
    if (!product || product.stock <= 0) return

    const orders = await this.orderRepository.getPendingOrdersByProductCode(productCode)

    for (const order of orders) {

      for (const item of order.items) {

        const needsProduction = item.needsProduction ?? 0

        if (item.productId !== productCode || needsProduction <= 0) continue
        if (product.stock <= 0) break

        const allocatableQty = Math.min(product.stock, needsProduction)

        const currentAssignedStock = item.assignedStock ?? 0

        item.assignedStock = currentAssignedStock + allocatableQty
        item.needsProduction = needsProduction - allocatableQty
        item.individualStockDeducted = true

        product.stock -= allocatableQty
      }

      await order.save()
      if (product.stock <= 0) break
    }

    await product.save()
  }
}