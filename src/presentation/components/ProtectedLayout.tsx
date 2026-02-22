"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "../hooks/useAuthStore"
import Sidebar from "../components/Sidebar"

type SearchContextType = {
  searchQuery: string
  setSearchQuery: (q: string) => void
}

const SearchContext = createContext<SearchContextType>({
  searchQuery: "",
  setSearchQuery: () => {},
})

export const useSearch = () => useContext(SearchContext)

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const hydrate = useAuthStore((state) => state.hydrate)

  const [hydrated, setHydrated] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadUser = async () => {
      await hydrate()
      setHydrated(true)
    }
    loadUser()
  }, [hydrate])

  // Redirect if user not authenticated
  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/")
    }
  }, [hydrated, user, router])

  if (!hydrated) return null
  if (!user) return null

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SearchContext.Provider>
  )
}
