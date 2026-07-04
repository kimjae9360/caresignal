"use client"

import {
  ClipboardList,
  FileText,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Mic,
  Radio,
  Settings,
  Users,
} from "lucide-react"

export type Section = "dashboard" | "safety" | "voice" | "settings" | "records" | "analysis"

const navItems: { id: Section; label: string; icon: typeof Users }[] = [
  { id: "dashboard", label: "종합 대시보드", icon: LayoutDashboard },
  { id: "safety", label: "어르신 안전 관리", icon: Users },
  { id: "voice", label: "현장 음성 기록", icon: Mic },
  { id: "records", label: "종사자 기록 관리", icon: ClipboardList },
  { id: "settings", label: "시스템 설정", icon: Settings },
  { id: "analysis", label: "시스템 구조 분석", icon: FileText },
]

export function AppSidebar({
  active = "dashboard",
  onNavigate,
  onLogout,
}: {
  active?: Section
  onNavigate: (section: Section) => void
  onLogout: () => void
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 px-6 py-6 text-left"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <HeartPulse className="h-5 w-5" aria-hidden />
        </span>
        <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
          CareSignal
        </span>
      </button>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = id === active
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden />
              {label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
            김
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              김재원 사회복지사
            </p>
            <p className="truncate text-xs text-muted-foreground">
              노원구 통합돌봄센터
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            aria-label="로그아웃"
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </aside>
  )
}

export function MobileNav({
  active = "dashboard",
  onNavigate,
}: {
  active?: Section
  onNavigate: (section: Section) => void
}) {
  return (
    <nav className="flex items-center gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 lg:hidden">
      {navItems.map(({ id, label, icon: Icon }) => {
        const isActive = id === active
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            aria-current={isActive ? "page" : undefined}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
