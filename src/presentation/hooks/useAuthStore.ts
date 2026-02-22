import { create } from "zustand"

interface User {
  id: string
  firstname: string
  lastname: string
  phone: string
  email: string
  role: number
}

interface AuthState {
  hydrate: any
  user: User | null
  setUser: (u: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  hydrate: async () => {
    if (typeof window === "undefined") return

    try {
      const res = await fetch("/api/users/me")
      if (res.ok) {
        const data = await res.json()
        set({ user: data.user })
      }
    } catch (error) {
      // Not authenticated, keep user as null
      set({ user: null })
    }
  },

  setUser: (u) => {
    set({ user: u })
  },

  logout: async () => {
    try {
      await fetch("/api/users/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout error:", error)
    }
    set({ user: null })
  },
}))
