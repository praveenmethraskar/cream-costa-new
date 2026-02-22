"use client"

import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "../hooks/useAuthStore"
import { Box, LayoutDashboard, ShoppingCart, Settings, LogOut, User, Warehouse, Package } from "lucide-react"

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Inventory",
    path: "/products",
    icon: Package,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    router.replace("/")
  }

  return (
    <aside className="w-64 h-screen flex flex-col transition-colors bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500">
            <Warehouse className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Warehouse</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
              <span className="font-medium">{item.name}</span>
              {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>}
            </button>
          )
        })}
      </nav>

      <div className="p-4 space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user.firstname} {user.lastname}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
