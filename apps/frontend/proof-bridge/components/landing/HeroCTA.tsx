"use client"

import { ArrowDown, Play } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

export const HeroCTA = () => {
  const [showVideo, setShowVideo] = useState(false)
  const playRef: React.Ref<HTMLDivElement> = useRef(null)
  const videoRef: React.Ref<HTMLVideoElement> = useRef(null)

  const toggleVideo = () => setShowVideo(!showVideo)
  useEffect(() => {
    playRef.current?.addEventListener("mouseenter", () => {
      toggleVideo()
      // videoRef.current?.play()
    })
    playRef.current?.addEventListener("mouseleave", () => {
      toggleVideo()
      // videoRef.current?.pause()
    })

    return () => {
      playRef.current?.removeEventListener("mouseleave", () => {})
      playRef.current?.removeEventListener("mouseenter", () => {})
    }
  }, [showVideo])
  return (
    <>
      <div className="md:h-[14vh] h-auto w-full grid md:[grid-template-columns:50%_9%_41%] [grid-template-columns:1fr_15%_60%] uppercase text-xs relative text-black">
        <div className="flex justify-between items-center w-full md:h-full h-[95px] bg-[#3b4eff] text-white px-5 md:px-10 md:col-span-1 col-span-3">
          <p className="">The next big thing</p>
        </div>
        <div
          className={`${
            !showVideo ? "px-5 md:px-10" : ""
          } flex justify-center items-center w-full md:h-full h-[95px] bg-primary text-white relative cursor-pointer`}
          ref={playRef}
        >
          {showVideo ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted={false}
              autoPlay
            >
              <source src="/hero-vid.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <>
              <Play className="text-black" />
            </>
          )}
          {/* <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            
          </div> */}
        </div>
        <div className="flex justify-between items-center w-full md:h-full h-[95px] bg-[#eee] px-5 md:px-10 md:col-span-1 col-span-2">
          <p className="">Play reel</p>
          <p>scroll down</p>
        </div>
        <div
          className="inline-block absolute right-[3rem] top-[-5rem]"
          id="scroll-down-arrow"
        >
          <ArrowDown className="text-primary" size={44} />
        </div>
      </div>
    </>
  )
}
