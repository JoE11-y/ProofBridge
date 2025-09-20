import { About } from "@/components/landing/About"
import { Features } from "@/components/landing/Features"
import { Hero } from "@/components/landing/Hero"
import { LandingHeader } from "@/components/landing/Header"

export default function Home() {
  return (
    <div className="relative">
      <LandingHeader />
      <Hero />
      <div className="header-anime h-4"></div>
      <About />
      <Features />
    </div>
  )
}
