"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useAuthStore } from "@/presentation/hooks/useAuthStore"
import { COLORS } from "../constants/colors"
import { LogIn, Moon, Sun } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const { setUser } = useAuthStore()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include", // Include cookies in request
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.message || "Invalid credentials")
      return
    }

    toast.success("Login successful!")
    setUser(data.user)
    router.push("/orders")
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat transition-colors relative"
      style={{ backgroundImage: "url('/bg-4.jpg')" }}
    >
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 hover:bg-white/30 dark:hover:bg-black/40 transition-all"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-gray-700" />}
      </button>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-2xl rounded-3xl transition-all"
      >
        <div className="flex flex-col items-center mb-8">
          <h1 className={`text-3xl font-bold text-center ${COLORS.TEXT.PRIMARY_LIGHT} ${COLORS.TEXT.PRIMARY_DARK}`}>
            Welcome Back
          </h1>
          <p className={`text-sm mt-2 ${COLORS.TEXT.SECONDARY_LIGHT} ${COLORS.TEXT.SECONDARY_DARK}`}>
            Sign in to continue to your account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className={`text-center font-medium ${COLORS.TEXT.ERROR_LIGHT} ${COLORS.TEXT.ERROR_DARK}`}>{error}</p>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${COLORS.TEXT.PRIMARY_LIGHT} ${COLORS.TEXT.PRIMARY_DARK}`}
            >
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-3 border rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${COLORS.TEXT.PRIMARY_LIGHT} ${COLORS.TEXT.PRIMARY_DARK}`}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign In
        </button>

        <div className={`mt-6 text-center text-sm ${COLORS.TEXT.SECONDARY_LIGHT} ${COLORS.TEXT.SECONDARY_DARK}`}>
          Don't have an account?{" "}
          <span
            className={`font-semibold ${COLORS.TEXT.LINK_LIGHT} ${COLORS.TEXT.LINK_DARK} cursor-pointer hover:underline`}
            onClick={() => router.push("/register")}
          >
            Create one now
          </span>
        </div>
      </form>
    </div>
  )
}
