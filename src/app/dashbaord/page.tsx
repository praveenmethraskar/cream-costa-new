"use client"

import ProtectedLayout from "@/presentation/components/ProtectedLayout"
import { BarChart3, TrendingUp, DollarSign, ShoppingBag } from "lucide-react"

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

        {/* Stats Grid - Placeholder for future analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Coming Soon</p>
              </div>
              <DollarSign className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Coming Soon</p>
              </div>
              <ShoppingBag className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Coming Soon</p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Analytics</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Coming Soon</p>
              </div>
              <BarChart3 className="w-10 h-10 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Placeholder Message */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analytics Coming Soon</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Dashboard analytics and insights will be implemented here in the future.
          </p>
        </div>
      </div>
    </ProtectedLayout>
  )
}
