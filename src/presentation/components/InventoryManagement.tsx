"use client"

import { useEffect, useState } from "react"
import {
  Package2,
  Edit2,
  X,
  Check,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Ban,
  Package,
  Factory,
  RefreshCw,
} from "lucide-react"

interface Product {
  _id: string
  name: string
  stock: number
  requiredProductionQty?: number
  productionStatus?: string
  plannedProductionQty?: number
}

enum Category {
  Regular = "Regular",
  Premium = "Premium",
  SugarFree = "SugarFree",
  Vegan = "Vegan",
  Gelato = "Gelato",
  FrozenYogurt = "FrozenYogurt",
  Sorbet = "Sorbet",
  Kulfi = "Kulfi",
  Other = "Other",
}

enum Calorie {
  KCal = "KCal",
}

enum Measure {
  GRAMS = "Grams",
  KGS = "Kgs",
  QTY = "Qty",
  LTRS = "Ltr(s)",
  MISC = "Miscellaneous",
}

type TabType = "Items" | "Production Board"

export default function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState<string>("")
  const [editPlannedQty, setEditPlannedQty] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<TabType>("Items")
  const [productions, setProductions] = useState<any[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCreateProductionModal, setShowCreateProductionModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [productsList, setProductsList] = useState<any[]>([])

  const [form, setForm] = useState({
    code: "",
    name: "",
    image: "",
    ingredients: "",
    calories: [] as Calorie[],
    measureOptions: [] as Measure[],
    defaultMeasure: "" as Measure | "",
    price: "",
    categories: "" as Category | "",
    tags: "",
  })

  const [productionForm, setProductionForm] = useState({
    productCode: "",
    productName: "",
    requiredProductionQty: "",
    plannedProductionQty: "",
    productionStatus: "",
  })

  const resetProductForm = () => {
    setForm({
      code: "",
      name: "",
      image: "",
      ingredients: "",
      calories: [] as Calorie[],
      measureOptions: [] as Measure[],
      defaultMeasure: "" as Measure | "",
      price: "",
      categories: "" as Category | "",
      tags: "",
    })
  }

  const resetProductionForm = () => {
    setProductionForm({
      productCode: "",
      productName: "",
      requiredProductionQty: "",
      plannedProductionQty: "",
      productionStatus: "",
    })
  }

  useEffect(() => {
    if (activeTab === "Items") {
      fetchProducts()
    }

    if (activeTab === "Production Board") {
      fetchProductions()
    }
  }, [activeTab])

  async function fetchProducts() {
    try {
      setLoading(true)
      const res = await fetch("/api/products")
      const data: Product[] = await res.json()
      setProducts(data)
    } catch (e) {
      console.error("Failed to fetch products:", e)
    } finally {
      setLoading(false)
    }
  }

  async function refreshProducts() {
    try {
      setRefreshing(true)
      const res = await fetch("/api/products")
      const data: Product[] = await res.json()
      setProducts(data)
    } catch (e) {
      console.error("Failed to refresh products:", e)
    } finally {
      setRefreshing(false)
    }
  }

  async function fetchProductions() {
    try {
      console.log("[InventoryManagement] GET /api/production")
      setLoading(true)

      const res = await fetch("/api/production")
      const data = await res.json()

      setProductions(data)
    } catch (e) {
      console.error("Failed to fetch productions:", e)
    } finally {
      setLoading(false)
    }
  }

  async function fetchProductsList() {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProductsList(data)
    } catch (e) {
      console.error("Failed to fetch products list:", e)
    }
  }

  async function createProduct() {
    if (
      !form.code ||
      !form.name ||
      !form.price ||
      !form.categories ||
      !form.defaultMeasure ||
      form.measureOptions.length === 0
    ) {
      alert("Please fill all required fields")
      return
    }

    const payload = {
      code: form.code,
      name: form.name,
      image: form.image,
      ingredients: form.ingredients
        ? form.ingredients.split(",").map((i) => i.trim())
        : [],
      calories: form.calories,
      measureOptions: form.measureOptions,
      defaultMeasure: form.defaultMeasure,
      price: Number(form.price),
      categories: form.categories,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      stock: 0, //user cannot edit
    }

    try {
      setCreating(true)
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.message || "Failed to create product")
        return
      }

      setShowCreateModal(false)
      resetProductForm()
      fetchProducts()
    } finally {
      setCreating(false)
    }
  }

  function handleProductCodeChange(code: string) {
    const selectedProduct = productsList.find((p: any) => p.code === code)
    setProductionForm({
      ...productionForm,
      productCode: code,
      productName: selectedProduct?.name || "",
    })
  }

  async function createProduction() {
    if (
      !productionForm.productCode ||
      !productionForm.productName ||
      !productionForm.requiredProductionQty
    ) {
      alert("Please fill all required fields")
      return
    }

    const payload = {
      code: productionForm.productCode,
      name: productionForm.productName,
      requiredProductionQty: Number(productionForm.requiredProductionQty),
      plannedProductionQty: productionForm.plannedProductionQty
        ? Number(productionForm.plannedProductionQty)
        : undefined,
      productionStatus: productionForm.productionStatus || undefined,
    }

    try {
      setCreating(true)
      const res = await fetch("/api/production", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.message || "Failed to create production")
        return
      }

      setShowCreateProductionModal(false)
      resetProductionForm()
      fetchProductions()
    } finally {
      setCreating(false)
    }
  }

  function startEditing(product: Product) {
    setEditingProductId(product._id)
    setEditStatus(product.productionStatus || "")
    setEditPlannedQty(product.plannedProductionQty || 0)
  }

  function cancelEditing() {
    setEditingProductId(null)
    setEditStatus("")
    setEditPlannedQty(0)
  }

  async function saveProduction(productionId: string) {
    try {
      if (!productionId) {
        console.error("Production ID missing")
        return
      }

      const payload = {
        _id: productionId,
        productionStatus: editStatus || undefined,
        plannedProductionQty: editPlannedQty,
      }

      const res = await fetch("/api/production/update-production", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        console.error("Failed to update production:", err)
        return
      }

      const updatedProduction = await res.json()

      // Update local production list
      setProductions((prev) =>
        prev.map((p) =>
          p._id === updatedProduction._id ? updatedProduction : p,
        ),
      )

      cancelEditing()
    } catch (error) {
      console.error("Failed to update production:", error)
    }
  }

  function getStatusBadge(status?: string) {
    if (!status) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-500">Not Set</span>
        </div>
      )
    }

    const statusConfig: Record<
      string,
      { icon: any; bgColor: string; textColor: string; label: string }
    > = {
      PLANNED: {
        icon: Clock,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-700 dark:text-blue-300",
        label: "Planned",
      },
      IN_PRODUCTION: {
        icon: Package2,
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
        textColor: "text-amber-700 dark:text-amber-300",
        label: "In Production",
      },
      COMPLETED: {
        icon: CheckCircle2,
        bgColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-700 dark:text-green-300",
        label: "Completed",
      },
      CANCELLED: {
        icon: Ban,
        bgColor: "bg-red-100 dark:bg-red-900/30",
        textColor: "text-red-700 dark:text-red-300",
        label: "Cancelled",
      },
    }

    const config = statusConfig[status] || statusConfig.PLANNED
    const Icon = config.icon

    return (
      <div
        className={`flex items-center gap-2 px-3 py-1.5 ${config.bgColor} rounded-lg`}
      >
        <Icon className={`w-4 h-4 ${config.textColor}`} />
        <span className={`text-sm font-medium ${config.textColor}`}>
          {config.label}
        </span>
      </div>
    )
  }

  function getStockColor(stock: number) {
    if (stock === 0) return "text-red-600 dark:text-red-400"
    if (stock < 10) return "text-amber-600 dark:text-amber-400"
    return "text-green-600 dark:text-green-400"
  }

  const tabs = [
    {
      id: "Items" as TabType,
      label: "Items",
      icon: Package,
      description: "View all available products and stock levels",
    },
    {
      id: "Production Board" as TabType,
      label: "Production Board",
      icon: Factory,
      description: "Manage production status and planned quantities",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400 mb-2">
          Inventory Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage product stock and production workflow
        </p>
      </div>

      <div className="flex gap-3 mb-8">
        {tabs.map(({ id, label, icon: Icon, description }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <div className="text-left">
                <div>{label}</div>
                <div className="text-xs opacity-80">{description}</div>
              </div>
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading inventory...
          </p>
        </div>
      ) : (
        <div>
          {activeTab === "Items" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  All Items
                </h2>

                {/* RIGHT SIDE ACTIONS */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md"
                  >
                    Create Product
                  </button>

                  <button
                    onClick={refreshProducts}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl shadow-md disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                    />
                    {refreshing ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-xl transition-shadow"
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg">
                          <Package2 className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                          {product.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Current Stock
                        </p>
                        <p
                          className={`text-3xl font-bold ${getStockColor(product.stock)}`}
                        >
                          {product.stock}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Status
                        </p>
                        <div className="flex justify-end">
                          {product.stock === 0 ? (
                            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-bold">
                              Out of Stock
                            </span>
                          ) : product.stock < 10 ? (
                            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold">
                              In Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Production Board" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Production Board
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2.5 inline-block">
                    <span className="font-medium text-blue-700 dark:text-blue-300">Note:</span> Products must be created first in the Items tab before scheduling production.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateProductionModal(true)
                    fetchProductsList()
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-md font-medium"
                >
                  Create Production
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {productions.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      <Factory className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      No Production Items
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      No items currently require production.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                            Item Name
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                            Required Production Qty
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                            Production Status
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                            Planned Batch Qty
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {productions
                          .filter((p) => p.productionStatus !== "COMPLETED")
                          .map((production) => {
                            const isEditing = editingProductId === production._id

                            return (
                              <tr
                                key={production._id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                              >
                                {/* Item Name */}
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg">
                                      <Factory className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                      {production.name}
                                    </span>
                                  </div>
                                </td>

                                {/* Required Production Qty */}
                                <td className="px-6 py-4">
                                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                    {production.requiredProductionQty || 0}
                                  </span>
                                </td>

                                {/* Production Status */}
                                <td className="px-6 py-4">
                                  {isEditing ? (
                                    <select
                                      value={editStatus}
                                      onChange={(e) =>
                                        setEditStatus(e.target.value)
                                      }
                                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                      <option value="">Not Set</option>
                                      <option value="PLANNED">Planned</option>
                                      <option value="IN_PRODUCTION">
                                        In Production
                                      </option>
                                      <option value="COMPLETED">
                                        Completed
                                      </option>
                                      <option value="CANCELLED">
                                        Cancelled
                                      </option>
                                    </select>
                                  ) : (
                                    getStatusBadge(production.productionStatus)
                                  )}
                                </td>

                                {/* Planned Batch Qty */}
                                <td className="px-6 py-4">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      min="0"
                                      value={editPlannedQty}
                                      onChange={(e) =>
                                        setEditPlannedQty(
                                          Number(e.target.value),
                                        )
                                      }
                                      className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                  ) : (
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {production.plannedProductionQty || 0}
                                    </span>
                                  )}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                  {isEditing ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        onClick={() =>
                                          saveProduction(production._id)
                                        }
                                        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                        title="Save"
                                      >
                                        <Check className="w-5 h-5" />
                                      </button>
                                      <button
                                        onClick={cancelEditing}
                                        className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                        title="Cancel"
                                      >
                                        <X className="w-5 h-5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center">
                                      <button
                                        onClick={() => startEditing(production)}
                                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                        title="Edit"
                                      >
                                        <Edit2 className="w-5 h-5" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {showCreateProductionModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-5 rounded-t-2xl">
                  <h3 className="text-2xl font-bold text-white">Create Production</h3>
                  <p className="text-purple-50 text-sm mt-1">Schedule a new production batch</p>
                </div>

                <div className="p-6 space-y-5">
                  {/* Important Notice */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 px-4 py-3 rounded-r-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                          Important: Ensure the product exists first
                        </p>
                        <p className="text-amber-800 dark:text-amber-300 text-sm mt-1">
                          The Product Code and Name must match an existing product in your inventory before creating a production schedule.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Row 1: Product Code and Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Product Code <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={productionForm.productCode}
                        onChange={(e) => handleProductCodeChange(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select a product code</option>
                        {productsList.map((product: any) => (
                          <option key={product._id} value={product.code}>
                            {product.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Auto-populated from product code"
                        value={productionForm.productName}
                        readOnly
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Row 2: Required and Planned Production Qty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Required Production Qty <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        value={productionForm.requiredProductionQty}
                        onChange={(e) => setProductionForm({ ...productionForm, requiredProductionQty: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Planned Production Qty <span className="text-gray-400 text-xs">(optional)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        value={productionForm.plannedProductionQty}
                        onChange={(e) => setProductionForm({ ...productionForm, plannedProductionQty: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 3: Production Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Production Status <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <select
                      value={productionForm.productionStatus}
                      onChange={(e) => setProductionForm({ ...productionForm, productionStatus: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select status (optional)</option>
                      <option value="PLANNED">Planned</option>
                      <option value="IN_PRODUCTION">In Production</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 px-6 py-4 rounded-b-2xl border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowCreateProductionModal(false)
                      resetProductionForm()
                    }}
                    disabled={creating}
                    className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createProduction}
                    disabled={creating}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {creating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      "Create Production"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-5 rounded-t-2xl">
                  <h3 className="text-2xl font-bold text-white">Create New Product</h3>
                  <p className="text-blue-50 text-sm mt-1">Fill in the product details below</p>
                </div>

                <div className="p-6 space-y-5">
                  {/* Row 1: Code and Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Product Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., ICE-001"
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Vanilla Ice Cream"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2: Category and Default Measure */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.categories}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            categories: e.target.value as Category,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select a category</option>
                        {Object.values(Category).map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Default Measure <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.defaultMeasure}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            defaultMeasure: e.target.value as Measure,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select a measure</option>
                        {Object.values(Measure).map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Price and Image URL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={(e) =>
                          setForm({ ...form, price: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Image URL <span className="text-gray-400 text-xs">(optional)</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={form.image}
                        onChange={(e) =>
                          setForm({ ...form, image: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 4: Measure Options */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Measure Options <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.values(Measure).map((m) => (
                        <label
                          key={m}
                          className="flex items-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                        >
                          <input
                            type="checkbox"
                            checked={form.measureOptions.includes(m)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setForm({
                                  ...form,
                                  measureOptions: [...form.measureOptions, m],
                                })
                              } else {
                                setForm({
                                  ...form,
                                  measureOptions: form.measureOptions.filter(
                                    (opt) => opt !== m,
                                  ),
                                })
                              }
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {m}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Row 5: Ingredients */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Ingredients <span className="text-gray-400 text-xs">(comma separated)</span>
                    </label>
                    <textarea
                      placeholder="e.g., Milk, Sugar, Vanilla Extract"
                      rows={3}
                      value={form.ingredients}
                      onChange={(e) =>
                        setForm({ ...form, ingredients: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Row 6: Tags */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tags <span className="text-gray-400 text-xs">(optional, comma separated)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., bestseller, organic, seasonal"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Helpful Tip */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <span className="font-medium">Tip:</span> After creating this product, you can schedule production from the Production Board tab.
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 px-6 py-4 rounded-b-2xl border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      resetProductForm()
                    }}
                    disabled={creating}
                    className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createProduct}
                    disabled={creating}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {creating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      "Create Product"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
