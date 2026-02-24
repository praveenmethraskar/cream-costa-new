"use client"

import { useEffect, useState } from "react"
import ProtectedLayout from "@/presentation/components/ProtectedLayout"
import {
  Clock,
  CheckCircle,
  Package,
  Factory,
  Truck,
  Plus,
  Trash2,
  X,
} from "lucide-react"
import type { Order } from "@/infrastructure/schemas/order"

type TabType = "Pending" | "In-progress" | "Dispatched" | "Completed"

type Production = {
  _id: string
  code: string
  name: string
  productionStatus: "PLANNED" | "IN_PROGRESS" | "COMPLETED"
  requiredProductionQty: number
}

type OrderItem = {
  productId: string
  productName: string
  quantity: number
}

export default function ProductionManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [productions, setProductions] = useState<Production[]>([])
  const [activeTab, setActiveTab] = useState<TabType>("Pending")
  const [loading, setLoading] = useState(true)
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { productId: "", productName: "", quantity: 0 },
  ])

  useEffect(() => {
    initializeDashboard()
  }, [])

  async function handleRefresh() {
    await initializeDashboard()
  }


  async function initializeDashboard() {
    try {
      setLoading(true)
      await fetchOrders()
      await fetchProductions()
    } finally {
      setLoading(false)
    }
  }

  async function fetchOrders() {
    const res = await fetch("/api/orders", {
      cache: "no-store",
    })
    const data = await res.json()
    setOrders(data)
  }

  async function fetchProductions() {
    const res = await fetch("/api/production", {
      cache: "no-store",
    })
    const data = await res.json()
    setProductions(data)
  }

  async function updateOrderStatus(
    orderId: string,
    status: TabType
  ) {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      cache: "no-store",
    })

    await fetchOrders() // refresh list
  }

  function resetForm() {
    setCustomerName("")
    setCustomerPhone("")
    setOrderItems([{ productId: "", productName: "", quantity: 0 }])
  }

  function handleAddItem() {
    setOrderItems([...orderItems, { productId: "", productName: "", quantity: 0 }])
  }

  function handleRemoveItem(index: number) {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index))
    }
  }

  function handleItemChange(index: number, field: keyof OrderItem, value: string | number) {
    const updatedItems = [...orderItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setOrderItems(updatedItems)
  }

  async function handleCreateOrder() {
    // Generate UUID for orderId
    //const orderId = crypto.randomUUID()
    
    const orderData = {
      //orderId,
      customerName,
      customerPhone,
      items: orderItems,
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
        cache: "no-store",
      })

      if (res.ok) {
        setIsCreateOrderOpen(false)
        setIsSuccessOpen(true)
        resetForm()
        await fetchOrders()

        // Close success dialog after 3 seconds
        setTimeout(() => {
          setIsSuccessOpen(false)
        }, 3000)
      }
    } catch (error) {
      console.error("Error creating order:", error)
    }
  }

  function handleOpenCreateOrder() {
    resetForm()
    setIsCreateOrderOpen(true)
  }

  const filteredOrders = orders.filter(o => o.status === activeTab)

  const statusCounts = {
    Pending: orders.filter(o => o.status === "Pending").length,
    "In-progress": orders.filter(o => o.status === "In-progress").length,
    Dispatched: orders.filter(o => o.status === "Dispatched").length,
    Completed: orders.filter(o => o.status === "Completed").length,
  }

  const plannedProductions = productions.filter(
    p => p.productionStatus === "PLANNED"
  )

  const tabs = [
    { id: "Pending", label: "Pending", icon: Clock, count: statusCounts.Pending },
    {
      id: "In-progress",
      label: "In Progress",
      icon: Package,
      count: statusCounts["In-progress"],
    },
    {
      id: "Dispatched",
      label: "Dispatched",
      icon: Truck,
      count: statusCounts.Dispatched,
    },
    {
      id: "Completed",
      label: "Completed",
      icon: CheckCircle,
      count: statusCounts.Completed,
    },
  ]

  return (
    <ProtectedLayout>
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Production Dashboard</h1>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreateOrder}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create Order
            </button>
            <button
              onClick={handleRefresh}
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-black rounded-xl shadow-md"
            >
              Refresh
            </button>
          </div>
        </div>


        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              <tab.icon className="inline w-4 h-4 mr-2" />
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Production Summary */}
        {activeTab === "Pending" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Factory className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Production Summary</h2>
            </div>

            {plannedProductions.length === 0 ? (
              <p className="text-green-600 font-semibold">
                No production required 🎉
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plannedProductions.map(p => (
                  <div
                    key={p._id}
                    className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-900"
                  >
                    <h3 className="font-bold mb-1">{p.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Code: {p.code}
                    </p>

                    <p className="text-sm mb-1">
                      Required Qty:{" "}
                      <span className="font-semibold">
                        {p.requiredProductionQty}
                      </span>
                    </p>

                    <p className="text-xs font-semibold text-blue-600">
                      Status: {p.productionStatus}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredOrders.length === 0 ? (
          <p>No orders</p>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order._id.toString()}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl mb-4"
            >
              <h3 className="font-bold mb-3">{order.orderId}</h3>

              <div className="flex justify-end gap-3 mt-4">
  {order.status === "Pending" && (
    <button
      onClick={() =>
        updateOrderStatus(order.orderId, "In-progress")
      }
      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
    >
      Move to In-Progress
    </button>
  )}

  {order.status === "In-progress" && (
    <button
      onClick={() =>
        updateOrderStatus(order.orderId, "Dispatched")
      }
      className="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold"
    >
      Move to Dispatched
    </button>
  )}

  {order.status === "Dispatched" && (
    <button
      onClick={() =>
        updateOrderStatus(order.orderId, "Completed")
      }
      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold"
    >
      Mark as Completed
    </button>
  )}
</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {order.items.map(item => (
                  <div
                    key={item.productId}
                    className="border rounded-lg p-3"
                  >
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm">Ordered: {item.quantity}</p>
                    <p className="text-sm">
                      Assigned Stock: {item.assignedStock}
                    </p>

                    {(item.needsProduction ?? 0) > 0 ? (
                      <p className="text-xs text-amber-600">
                        Needs Production: {item.needsProduction ?? 0}
                      </p>
                    ) : (
                      <p className="text-xs text-green-600">
                        Fully in stock
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
            </div>
          ))
        )}
      </div>

      {/* Create Order Modal */}
      {isCreateOrderOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold">Create New Order</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fill in the customer details and add items to create a new order.
                </p>
              </div>
              <button
                onClick={() => setIsCreateOrderOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Customer Phone
                    </label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Order Items</h3>
                  <button
                    onClick={handleAddItem}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          Item {index + 1}
                        </span>
                        {orderItems.length > 1 && (
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Product ID
                          </label>
                          <input
                            type="text"
                            value={item.productId}
                            onChange={(e) =>
                              handleItemChange(index, "productId", e.target.value)
                            }
                            placeholder="Enter product ID"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Product Name
                          </label>
                          <input
                            type="text"
                            value={item.productName}
                            onChange={(e) =>
                              handleItemChange(index, "productName", e.target.value)
                            }
                            placeholder="Enter product name"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "quantity",
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="Enter quantity"
                            min="0"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setIsCreateOrderOpen(false)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={
                  !customerName ||
                  !customerPhone ||
                  orderItems.some(
                    (item) =>
                      !item.productId || !item.productName || item.quantity <= 0
                  )
                }
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Order Created Successfully</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your order has been created and added to the system.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedLayout>
  )
}
