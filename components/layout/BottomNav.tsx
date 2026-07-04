"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClipboardList, LayoutDashboard, Mic, Settings } from "lucide-react"

const navItems = [
  { id: "dashboard", label: "대시보드", icon: LayoutDashboard, href: "/dashboard" },
  { id: "record", label: "현장 방문", icon: Mic, href: "/record" },
  { id: "admin-records", label: "기록 관리", icon: ClipboardList, href: "/admin-records" },
  { id: "settings", label: "설정", icon: Settings, href: "/settings" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card pb-safe pt-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href)
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 p-2 transition ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                isActive ? "bg-primary/10" : ""
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "fill-primary/20" : ""}`} aria-hidden />
            </div>
            <span className={`text-[10px] font-semibold ${isActive ? "text-primary" : ""}`}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
