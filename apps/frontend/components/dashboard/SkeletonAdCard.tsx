"use client"
import React from "react"

export const SkeletonAdCard: React.FC = () => {
  return (
    <div
      className="min-h-[100px] space-y-4 md:space-y-5 p-4 border-grey-700 border-1 rounded-lg bg-grey-900 animate-pulse"
      role="status"
      aria-label="loading ad card"
    >
      <div className="flex items-center gap-5 justify-between flex-wrap">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-grey-800 h-12 w-12" />
          <div>
            <div className="h-4 w-40 bg-grey-800 rounded mb-2" />
            <div className="h-3 w-28 bg-grey-800 rounded" />
          </div>
        </div>
        <div className="h-6 w-24 bg-grey-800 rounded" />
      </div>

      <div className="grid 2xl:grid-cols-4 md:grid-cols-3 gap-5">
        <div>
          <div className="h-4 w-32 bg-grey-800 rounded mb-2" />
          <div className="h-7 w-48 bg-grey-800 rounded mb-2" />
          <div className="h-3 w-24 bg-grey-800 rounded" />
        </div>

        <div>
          <div className="h-4 w-20 bg-grey-800 rounded mb-2" />
          <div className="h-7 w-32 bg-grey-800 rounded mb-2" />
          <div className="h-3 w-24 bg-grey-800 rounded" />
        </div>

        <div>
          <div className="h-4 w-20 bg-grey-800 rounded mb-2" />
          <div className="h-7 w-48 bg-grey-800 rounded mb-2" />
          <div className="h-3 w-24 bg-grey-800 rounded" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-grey-800 rounded" />
          <div className="h-3 w-32 bg-grey-800 rounded" />
        </div>

        <div className="flex gap-4">
          <div className="h-10 w-24 bg-grey-800 rounded" />
          <div className="h-10 w-24 bg-grey-800 rounded" />
          <div className="h-10 w-24 bg-grey-800 rounded" />
        </div>
      </div>
    </div>
  )
}
