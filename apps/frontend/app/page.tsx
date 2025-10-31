import { About } from "@/components/landing/About"
import { Features } from "@/components/landing/Features"
import { Hero } from "@/components/landing/Hero"
import { LandingHeader } from "@/components/landing/Header"
import { HeroAlt } from "@/components/landing/Hero-Alt"
import { HeroCTA } from "@/components/landing/HeroCTA"
import { AnimationContainer } from "@/components/landing/AnimationContainer"
import { LandingHeaderAlt } from "@/components/landing/LandingHeader-Alt"
import { OurApproach } from "@/components/landing/Approach"
import { ReImagine } from "@/components/landing/ReImagining"
import { Footer } from "@/components/landing/Footer"

export default function Home() {
  return (
    <AnimationContainer>
      <div className="relative">
        {/* <LandingHeader /> */}
        <LandingHeaderAlt />
        <HeroAlt />
        <div className="relative z-[30]">
          <div className="header-anime h-4 bg-transparent"></div>
          <div className="bg-background">
            <HeroCTA />
            {/* <OurApproach /> */}
            <About />
            <ReImagine />
            <Features />
            <Footer />
          </div>
        </div>
      </div>
    </AnimationContainer>
  )
}
