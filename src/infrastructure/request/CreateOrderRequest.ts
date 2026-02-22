import { OrderItem } from "../schemas/order"

export interface CreateOrderRequest {
    orderId: string
    customerName: string
    customerPhone: string
    items: OrderItem[],
}