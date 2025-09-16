"use client"
import { app_routes } from "@/lib/routes"
import Link from "next/link"
import React from "react"
import { usePathname } from "next/navigation"

export const SideBar = () => {
  const pathname = usePathname()
  return (
    <aside className="sticky top-0 left-0 h-screen w-full pt-[126px] to-grey-1000 from-grey-900/50 bg-gradient-to-b border-r border-r-grey-900">
      <div className="">
        {app_routes.map((route) => {
          const isActive = route.path === pathname
          return (
            <Link href={route.path} key={route.path}>
              <div
                className={`${
                  isActive
                    ? "bg-night text-grey-0 font-medium"
                    : "text-grey-300"
                } flex items-center gap-4 capitalize md:px-8 p-4 text-sm relative mb-2 hover:bg-night`}
              >
                {route.icon}
                <p>{route.label}</p>

                {isActive && (
                  <div className="w-[4px] h-[16px] bg-primary rounded-2xl absolute right-6 top-[50%] -translate-y-[50%] shadow-primary shadow-sm drop-shadow-primary drop-shadow-md" />
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
