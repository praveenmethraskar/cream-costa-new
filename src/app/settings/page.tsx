"use client"

import ProtectedLayout from "@/presentation/components/ProtectedLayout"
import { Bell, Lock, User, Palette } from "lucide-react"

export default function SettingsPage() {
  return (
    <ProtectedLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

        {/* Settings Sections */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Settings</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Profile management features will be implemented here.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Notification preferences will be configured here.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Theme is set to system default (light/dark mode follows your system preferences).
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Security and privacy settings will be available here.</p>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
