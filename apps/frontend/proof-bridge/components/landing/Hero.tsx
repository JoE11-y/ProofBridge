"use client"
import { Button } from "antd"
import { ArrowRight } from "lucide-react"
import React from "react"

export const Hero = () => {
  return (
    <div className="relative overflow-x-hidden md:h-screen">
      <div className="absolute top-0 left-0 w-screen h-screen ">
        <video
          src="/bridge-2.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            maxHeight: "100%",
          }}
        />
      </div>
      <div className="absolute top-0 left-0 w-screen h-screen bg-black/45 z-[2]"></div>

      <div className="flex flex-col justify-between h-full relative z-[10] p-4 md:px-10 py-3 md:pb-10">
        <div></div>
        <div className="max-w-[1200px] font-perfectly-nineties">
          <h2 className="text-5xl">Game changing </h2>
          <h2 className="text-8xl">
            P2P{" "}
            <span className="text- bg-clip-text bg-gradient-to-r from-[#AEF78E] to-[#C0D461] inline-block">
              Cross-chain
            </span>{" "}
            Bridge
          </h2>
          <p className="text-xl">
            Unlocking the next generation of cross-chain bridging on Hedera
          </p>
          <div className="flex items-center gap-5 mt-4">
            <Button
              className="!bg-white !text-black !h-[45px] md:w-[170px] !rounded-full !border-0 !text-[16px] !items-center !leading-0"
              iconPosition="end"
              icon={<ArrowRight size={18} />}
            >
              Launch app
            </Button>
            <Button
              className="!bg-[#AEF78E] !text-black !h-[45px] md:w-[150px] !rounded-xl !border-0 !text-[16px] !items-center !leading-0"
              iconPosition="end"
            >
              Read docs
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
