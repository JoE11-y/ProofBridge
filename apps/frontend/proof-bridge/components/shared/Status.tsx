"use client"

import React from "react"

type StatusKind = "ACTIVE" | "PAUSED" | "INACTIVE" | "EXHAUSTED" | "CLOSE"

export const Status = ({
  status,
  className = "",
  size = "sm",
}: {
  status: StatusKind | string
  className?: string
  size?: "sm" | "md"
}) => {
  const base =
    "inline-flex items-center justify-center font-medium uppercase rounded-full"
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"

  const colorMap: Record<string, string> = {
    ACTIVE: "bg-primary text-black",
    PAUSED: "bg-amber-500 text-black",
    INACTIVE: "bg-grey-600 text-grey-200",
    EXHAUSTED: "bg-red-500 text-white",
    CLOSE: "bg-transparent border border-grey-700 text-grey-300",
  }

  const colorClass = colorMap[status] ?? "bg-grey-800 text-grey-200"

  return (
    <span
      className={`${base} ${sizeClass} ${colorClass} ${className}`}
      aria-label={`status ${status}`}
    >
      {status}
    </span>
  )
}
