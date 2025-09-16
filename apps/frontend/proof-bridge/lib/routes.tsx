import {
  ArrowRightLeft,
  BringToFront,
  LayoutDashboard,
  ReceiptText,
  Settings,
  User,
} from "lucide-react"
import { ReactNode } from "react"

export interface IRoute {
  icon?: ReactNode
  label: string
  path: `/${string}`
}

export const app_routes: IRoute[] = [
  {
    label: "dashboard",
    path: "/home",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "P2P Bridge",
    path: "/bridge",
    icon: <ArrowRightLeft size={20} />,
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: <ReceiptText size={20} />,
  },
  {
    label: "Your Ads",
    path: "/ads",
    icon: <BringToFront size={20} />,
  },

  {
    label: "Profile",
    path: "/profile",
    icon: <User size={20} />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <Settings size={20} />,
  },
]
