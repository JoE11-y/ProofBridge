import { Header } from "@/components/shared/Header"
import { SideBar } from "@/components/shared/SideBar"
import React from "react"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="relative min-h-screen">
      <Header />
      <div className="md:grid md:[grid-template-columns:250px_1fr]">
        <SideBar />
        <div className="md:pt-[96px] pt-4 px-4 md:px-5">{children}</div>
      </div>
    </main>
  )
}
