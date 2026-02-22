"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { COLORS } from "../constants/colors"
import { UserPlus, Moon, Sun } from "lucide-react"
import toast from "react-hot-toast"

export default function RegisterPage() {
  const router = useRouter()

  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("2")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [isDark, setIsDark] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname,
        lastname,
        username,
        phone,
        email,
        password,
        role: Number.parseInt(role),
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.message || "Registration failed")
      setError(data.message)
      return
    }

    toast.success("Registration successful! Please login.")
    router.push("/")
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat transition-colors relative py-8"
      style={{ backgroundImage: "url('/bg-4.jpg')" }}
    >
      <button
        onClick={() => {
          setIsDark(!isDark)
          document.documentElement.classList.toggle("dark")
        }}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 hover:bg-white/30 dark:hover:bg-black/40 transition-all"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-gray-700" />}
      </button>

      <form
        onSubmit={handleRegister}
        className="w-full max-w-md p-6 bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-2xl rounded-3xl transition-all"
      >
        <div className="flex flex-col items-center mb-8">
          <h1 className={`text-3xl font-bold text-center ${COLORS.TEXT.PRIMARY_LIGHT} ${COLORS.TEXT.PRIMARY_DARK}`}>
            Create Account
          </h1>
          {/* <p className={`text-sm mt-2 ${COLORS.TEXT.SECONDARY_LIGHT} ${COLORS.TEXT.SECONDARY_DARK}`}>
            Join us to manage your ice cream shop
          </p> */}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className={`text-center font-medium ${COLORS.TEXT.ERROR_LIGHT} ${COLORS.TEXT.ERROR_DARK}`}>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${COLORS.TEXT.PRIMARY_LIGHT} ${COLORS.TEXT.PRIMARY_DARK}`}
              >
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                className="w-full px-4 py-3 border rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${COLORS.TEXT.PRIMARY_LIGHT} ${COLORS.TEXT.PRIMARY_DARK}`}
              >
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full px-4 py-3 border rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${COLORS.TEXT.PRIMARY_LIGHT} ${COLORS.TEXT.PRIMARY_DARK}`}
            >
              Username
            </label>
            <input
              type="text"
              placeholder="johndoe"
              className="w-full px-4 py-3 border rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${COLORS.TEXT.PRIMARY_LIGHT} ${COLORS.TEXT.PRIMARY_DARK}`}
              >
                Phone
              </label>
              <input
                type="text"
                placeholder="+1234567890"
                className="w-full px-4 py-3 border rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${COLORS.TEXT.PRIMARY_LIGHT} ${COLORS.TEXT.PRIMARY_DARK}`}
              >
                Role
              </label>
              <select
                className="w-full px-4 py-3 border rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="2">User</option>
                <option value="1">Admin</option>
                <option value="0">Owner</option>
              </select>
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${COLORS.TEXT.PRIMARY_LIGHT} ${COLORS.TEXT.PRIMARY_DARK}`}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full px-4 py-3 border rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              placeholder="••••••••"
              className="w-full px-4 py-3 border rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${COLORS.TEXT.PRIMARY_LIGHT} ${COLORS.TEXT.PRIMARY_DARK}`}
            >
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border rounded-xl bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Create Account
        </button>

        <div className={`mt-6 text-center text-sm ${COLORS.TEXT.SECONDARY_LIGHT} ${COLORS.TEXT.SECONDARY_DARK}`}>
          Already have an account?{" "}
          <span
            className={`font-semibold ${COLORS.TEXT.LINK_LIGHT} ${COLORS.TEXT.LINK_DARK} cursor-pointer hover:underline`}
            onClick={() => router.push("/")}
          >
            Sign in instead
          </span>
        </div>
      </form>
    </div>
  )
}
