import React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Unauthenticated from "@/components/shared/Unauthenticated"

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const auth_token = (await cookies()).get("auth_token")?.value
  const refresh_token = (await cookies()).get("refresh_token")?.value
  if (!auth_token || !refresh_token) {
    // redirect("/bridge")
    return (
      <div>
        <Unauthenticated />
      </div>
    )
  }

  return <div>{children}</div>
}

export default ProtectedLayout
