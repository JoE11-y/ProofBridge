"use client"
import React from "react"

export const SkeletonTradeAd: React.FC = () => {
  return (
    <div role="status" aria-label="loading trade ad" className="animate-pulse">
      {/* Modal / expanded layout skeleton */}
      <div className="hidden">
        <div className="grid md:[grid-template-columns:370px_1fr]">
          <div className="bg-grey-800 w-full h-full md:rounded-l-[12px] p-4 md:p-6 md:py-7 space-y-7">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-grey-800 h-12 w-12" />
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-grey-800 rounded" />
                  <div className="h-3 w-24 bg-grey-800 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-3 w-20 bg-grey-800 rounded" />
                <div className="h-3 w-20 bg-grey-800 rounded" />
                <div className="h-3 w-20 bg-grey-800 rounded" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-4 w-32 bg-grey-800 rounded" />
              <div className="h-4 w-48 bg-grey-800 rounded" />
              <div className="h-4 w-40 bg-grey-800 rounded" />
            </div>

            <div className="text-[13px] tracking-wide text-grey-300">
              <div className="h-4 w-36 bg-grey-800 rounded mb-2" />
              <div className="h-24 w-full bg-grey-800 rounded" />
            </div>
          </div>

          <div className="bg-grey-800/60 w-full h-full md:rounded-r-[12px] p-4 md:p-6 md:py-7 space-y-3">
            <div className="h-6 w-40 bg-grey-800 rounded" />

            <div className="mb-16 space-y-4">
              <div className="h-[80px] w-full bg-grey-900/40 rounded-md p-4" />
              <div className="h-[80px] w-full bg-grey-900/40 rounded-md p-4" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="h-[45px] w-full bg-grey-800 rounded" />
              <div className="h-[45px] w-full bg-grey-800 rounded" />
            </div>
            <div className="h-3 w-full bg-grey-800 rounded mt-3" />
          </div>
        </div>
      </div>

      {/* Compact list skeleton (visible) */}
      <div className="md:grid md:[grid-template-columns:2fr_1fr_2fr_1fr_1fr] gap-7 items-center text-sm md:py-0 py-2">
        <div className="space-y-[6px] flex items-center gap-2">
          <div className="rounded-full bg-grey-800 h-12 w-12" />
          <div className="space-y-2 w-full">
            <div className="h-4 w-36 bg-grey-800 rounded" />
            <div className="h-3 w-24 bg-grey-800 rounded" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <div className="h-4 w-28 bg-grey-800 rounded" />
        </div>

        <div className="uppercase space-y-1">
          <div className="h-4 w-48 bg-grey-800 rounded" />
          <div className="h-3 w-40 bg-grey-800 rounded" />
        </div>

        <div className="flex md:block items-center gap-1">
          <div className="h-4 w-24 bg-grey-800 rounded" />
          <div className="h-3 w-16 bg-grey-800 rounded" />
        </div>

        <div className="w-full flex justify-end md:mt-0 -mt-8">
          <div className="h-[40px] w-[120px] bg-grey-800 rounded" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonTradeAd
