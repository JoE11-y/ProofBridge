import { Hero } from "@/components/landing/Hero"
import { Header } from "@/components/shared/Header"
import Image from "next/image"

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <Hero />
    </div>
  )
}
