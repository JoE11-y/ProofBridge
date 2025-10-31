import {
  ArrowRightLeft,
  BringToFront,
  LayoutDashboard,
  ReceiptText,
  Settings,
  User,
} from "lucide-react"
import { ReactNode } from "react"
import { FaFaucet } from "react-icons/fa"

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
    label: "Create Ad",
    path: "/ads-management/create",
    icon: <BringToFront size={20} />,
  },
  {
    label: "Orders",
    path: "/orders",
    icon: <ReceiptText size={20} />,
  },

  {
    label: "Faucet(Get Tokens)",
    path: "/faucet",
    icon: <FaFaucet size={20} />,
  },
  // {
  //   label: "Settings",
  //   path: "/settings",
  //   icon: <Settings size={20} />,
  // },
]
