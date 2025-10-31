"use client"
import React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { SplitText } from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { OurApproach } from "./Approach"
gsap.registerPlugin(SplitText, ScrollTrigger)

const textAnimation = (trigger: string, end?: string) => {
  const split = SplitText.create(trigger, { type: "chars" })
  // now animate the characters in a staggered fashion
  gsap.from(split.chars, {
    // duration: 1,
    opacity: 0.3, // animate from 100px below
    stagger: 0.02, // 0.05 seconds between each
    y: 7,
    scrollTrigger: {
      trigger: trigger,
      scrub: true,
      // endTrigger: "#approach-info",
      end: end || "10px",
      // start: "top top",
    },
  })
}

export const About = () => {
  useGSAP(() => {
    gsap.to(".about-big-text", {
      scrollTrigger: {
        trigger: ".landing-features",
        scrub: true,
        start: "top 150%",
      },
      y: 500,
      duration: 0.5,
    })
    // textAnimation(".about-text", "300px")
  })
  return (
    <div className="md:min-h-screen scrollbar-hide py-7 md:py-28 landing-about p-4 md:px-10 overflow-x-hidden">
      <OurApproach />

      {/* <div className="scrollbar-hide">
        <h1 className="scrollbar-hide -mt-10 md:-mt-32 2xl:text-[75vmin] 2xl:leading-[88vmin] md:text-[65vmin] md:leading-[75vmin] text-[39vmin] font-perfectly-nineties italic opacity-10 about-big-text">
          Bridge
        </h1>
      </div> */}
    </div>
  )
}
