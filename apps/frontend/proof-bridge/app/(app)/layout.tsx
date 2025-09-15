import { Header } from "@/components/shared/Header"
import React from "react"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main>
      <Header />
      <div>{children}</div>
    </main>
  )
}
