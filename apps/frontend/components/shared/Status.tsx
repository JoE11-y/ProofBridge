"use client"

import React from "react"

type StatusKind =
  | "ACTIVE"
  | "PAUSED"
  | "INACTIVE"
  | "EXHAUSTED"
  | "CLOSED"
  | "LOCKED"
  | "COMPLETED"

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
    COMPLETED: "bg-primary text-black",
    PAUSED: "bg-amber-500 text-black",
    LOCKED: "bg-amber-300/10 text-amber-300",
    INACTIVE: "bg-grey-600 text-grey-200",
    CLOSED: "bg-red-500 text-white",
    EXHAUSTED: "bg-transparent border border-red-600 text-red-300",
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
