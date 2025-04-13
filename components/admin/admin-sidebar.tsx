"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Car,
  CreditCard,
  Settings,
  BarChart3,
  MessageSquare,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Rides",
    href: "/admin/rides",
    icon: Car,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Support",
    href: "/admin/support",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="w-64 bg-card border-r min-h-screen flex flex-col">
      <div className="p-6">
        <Link href="/admin" className="flex items-center space-x-2">
          <span className="font-bold text-xl">RideShare</span>
          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <HelpCircle className="h-5 w-5" />
          <span>Help & Documentation</span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
