"use client"

import ProtectedLayout from "@/presentation/components/ProtectedLayout"

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>
}
