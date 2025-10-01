"use client"
import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export const AnimationContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const scope: React.Ref<HTMLDivElement | null> = useRef(null)
  const timeline = useRef(gsap.timeline({ paused: true }))
  const [count, setCount] = useState(0) // Start at 1%
  useEffect(() => {
    // const progress = Number(tl.current.progress() * 100).toFixed(0)
    // setCount(Number(progress))

    const duration = 5000 // Total duration in ms (5 seconds)
    const interval = 50 // Update every 50ms
    const increment = 300 / (duration / interval) // Amount to increment per interval

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev + increment >= 100) {
          timeline.current.play()
          clearInterval(timer) // Stop the timer once we reach 100
          return 100
        }
        return prev + increment
      })
    }, interval)

    return () => clearInterval(timer) // Cleanup on unmount
  }, [])

  useGSAP(
    () => {
      gsap.fromTo(
        ".loading-dot",
        { opacity: 0 },
        {
          opacity: 1,
          stagger: 0.3,
          duration: 0.3,
          ease: "power1.out",
          repeat: -1,
        }
      )
      timeline.current

        .to(".screen-loader-details", {
          y: "-120%",
          opacity: 0,
          // delay: 0.2,
          stagger: 0.2,
          duration: 0.7,
        })

        .to(".screen-loader", {
          clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
          stagger: 0.6,
          duration: 1.5,
          ease: "power4.out",
        })

        .fromTo(
          "#selected-works-left",
          { x: "-50%" },
          {
            ease: "linear",
            x: 0,
            duration: 2,
            scrollTrigger: { trigger: "#about-keep-scrolling", scrub: true },
          }
        )
        .fromTo(
          "#selected-works-right",
          { x: "50%" },
          {
            ease: "linear",
            x: 0,
            duration: 2,
            scrollTrigger: { trigger: "#about-keep-scrolling", scrub: true },
          }
        )
        .fromTo(
          scope.current?.querySelectorAll(".selected-work-link") as never,
          { x: "30%", opacity: 0.7 },
          {
            ease: "power4.out",
            x: 0,
            duration: 0.8,
            stagger: 0.2,
            opacity: 1,
            scrollTrigger: {
              trigger: scope.current?.querySelectorAll("#selected-work-links"),
              scrub: true,
              end: window?.matchMedia("(max-width: 760px)")?.matches
                ? "+=1500px"
                : "+=2200px",
            },
          }
        )

      gsap.fromTo(
        "#scroll-down-arrow",
        { y: -15 },
        { y: 15, repeat: -1, yoyo: true, duration: 0.9 }
      )
    },
    { scope }
  )
  // useEffect(() => {
  //   timeline.current.play()
  //   // return () => {
  //   //   timeline.current.kill()
  //   // }
  // }, [timeline])
  return (
    <div ref={scope}>
      <div className="fixed top-0 left-0 w-full h-screen z-[300] bg-[#101012] text-white screen-loader">
        <div className="flex h-full flex-col justify-between md:p-10 p-5 md:pb-0">
          <div className="md:text-[40px] text-[20px] overflow-hidden">
            <h2 className="screen-loader-details">
              ProofBridge is loading
              <span className="loading-dot">.</span>
              <span className="loading-dot">.</span>
              <span className="loading-dot">.</span>
            </h2>
          </div>
          <div className="overflow-hidden text-end">
            <h2 className="md:text-[200px] screen-loader-details md:leading-[105%] text-[3rem] md:pb-0 pb-5">
              {count}%
            </h2>
          </div>
        </div>
      </div>
      <div className="fixed top-0 left-0 w-full h-screen z-[290] bg-primary screen-loader"></div>
      <div>{children}</div>
    </div>
  )
}
