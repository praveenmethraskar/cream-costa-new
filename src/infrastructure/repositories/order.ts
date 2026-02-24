import { OrderStatus } from "../models/enums/orderstatus"
import { CreateOrderRequest } from "../request/CreateOrderRequest"
import OrderSchema, { Order, OrderItem } from "../schemas/order"


export interface OrderRepository {
  getAll(): Promise<Order[]>
  getById(id: string): Promise<Order | null>
  getByOrderId(orderId: string): Promise<Order | null>
  createOrder(order: CreateOrderRequest): Promise<Order>
  updateStatus(orderId: string, status: OrderStatus): Promise<Order | null>
  getByStatus(status: OrderStatus): Promise<Order[]>
  updateOrderAllocation(orderId: string, updates: Partial<Order>): Promise<Order | null>
  updateOrderItems(orderId: string, items: OrderItem[]): Promise<Order | null>
  getPendingOrdersByProductCode(code: string): Promise<Order[]>
}

export class AppOrderRepository implements OrderRepository {
  async getAll() {
    return await OrderSchema.find().sort({ createdAt: -1 })
  }

  async getById(id: string) {
    return await OrderSchema.findById(id)
  }

  async getByOrderId(orderId: string): Promise<Order | null> {
    return await OrderSchema.findOne({ orderId })
  }

  async createOrder(order: CreateOrderRequest): Promise<Order> {

    const newOrder = new OrderSchema({
      orderId: order.orderId,
      items: order.items.map(item => ({
        ...item,
        availableStock: 0,
        needsProduction: 0,
      })),
      status: OrderStatus.PENDING,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
    })

    return await newOrder.save()
  }

  async updateOrderItems(orderId: string, items: OrderItem[]): Promise<Order | null> {
    return await OrderSchema.findOneAndUpdate(
      { orderId },
      {
        $set: {
          items
        }
      },
      { new: true }
    )
  }

  async getPendingOrdersByProductCode(code: string): Promise<Order[]> {
    return OrderSchema.find({
      "items.productId": code,
      "items.needsProduction": { $gt: 0 }
    }).sort({ createdAt: 1 })
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    return await OrderSchema.findOneAndUpdate({ orderId }, { status }, { new: true })
  }

  async getByStatus(status: OrderStatus) {
    return await OrderSchema.find({ status }).sort({ createdAt: -1 })
  }

 async updateOrderAllocation(orderId: string, updates: Partial<Order>) {
  const order = await OrderSchema.findById(orderId)
  if (!order) return null

  if (updates.items) {
    order.items = updates.items.map((item: any) => {
      let createdProduction = item.createdProduction ?? "dont-know"

      // 🔒 ONE-WAY STATE MACHINE
      if (createdProduction === "dont-know") {
        if (item.needsProduction > 0) {
          createdProduction = "created"
        } else {
          createdProduction = "not-needed"
        }
      }

      return {
        ...item,
        availableStock: item.availableStock,
        needsProduction: item.needsProduction,
        individualStockDeducted: item.individualStockDeducted,
        createdProduction,
      }
    })
  }

  order.stockDeducted = order.items.every(
    (item: any) => item.individualStockDeducted === true
  )

  await order.save()
  return order
}


}
