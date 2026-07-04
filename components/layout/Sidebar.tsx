"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ClipboardList,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Mic,
  Settings,
  Users,
} from "lucide-react"

const navItems = [
  { id: "dashboard", label: "통합 대시보드", icon: LayoutDashboard, href: "/dashboard" },
  { id: "record", label: "현장 방문 기록", icon: Mic, href: "/record" },
  { id: "admin-records", label: "종사자 기록 관리", icon: ClipboardList, href: "/admin-records" },
  { id: "settings", label: "시스템 설정", icon: Settings, href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-72 flex-col border-r border-border bg-card md:flex">
      {/* 로고 영역 */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <HeartPulse className="h-5 w-5" aria-hidden />
        </div>
        <span className="text-lg font-bold tracking-tight text-card-foreground">CareSignal</span>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 space-y-1.5 p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" aria-hidden />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* 하단 사용자 정보 */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Users className="h-5 w-5" aria-hidden />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-bold text-card-foreground">김재원 복지사</p>
            <p className="truncate text-xs text-muted-foreground">마포구 통합돌봄센터</p>
          </div>
          <Link
            href="/login"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-foreground"
            title="로그아웃"
          >
            <LogOut className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </aside>
  )
}
