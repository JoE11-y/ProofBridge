"use client"
import React from "react"

export const About = () => {
  return (
    <div className="min-h-screen py-7 md:py-28 landing-about p-4 md:px-10 overflow-x-hidden">
      <div className="">
        <div className="grid md:grid-cols-4 md:gap-10">
          <h3 className="text-[64px] md:leading-[44px] font-perfectly-nineties ">
            Mission
          </h3>
          <div className="text-xs md:leading-5 text-primary">
            <p>What is</p>
            <p>ProofPlay?</p>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <div className="md:w-[80%]">
              <p className="md:text-[28px] md:leading-[35px] indent-[7rem]">
                <span className="font-perfectly-nineties italic">
                  ProofBridge
                </span>{" "}
                is a decentralized protocol that unlocks cross-chain liquidity
                without requiring users to bridge or move their original assets
                across chains. Instead of bridging assets, users lock ETH or
                other supported tokens on Ethereum (L1) and instantly receive
                HBAR tokens on Hedera. These tokens are native, and backed 1:1
                by the user's collateral locked on Ethereum.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 className="-mt-10 text-[75vmin] leading-[88vmin] font-perfectly-nineties italic opacity-10">
          Bridge
        </h1>
      </div>
    </div>
  )
}
