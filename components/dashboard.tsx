"use client"

import { useState } from "react"
import {
  Activity,
  Bell,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  Heart,
  Mic,
  Moon,
  PillBottle,
  Radio,
  Save,
  TriangleAlert,
  Users,
  Watch,
  X,
} from "lucide-react"
import {
  AppSidebar,
  MobileNav,
  type Section,
} from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { AnalysisSection } from "@/components/analysis-section"
import {
  notifications,
  patients,
  riskMeta,
  summary,
  type DeviceState,
} from "@/lib/data"

const today = new Date().toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
})

const sectionTitles: Record<Section, string> = {
  dashboard:
    "김재원 사회복지사님, 오늘 가장 먼저 확인해야 할 우선 관리 대상 어르신입니다.",
  safety: "어르신 안전 관리 — 전체 담당 어르신 현황",
  voice: "현장 음성 기록 — AI 분석 로그",
  records: "종사자 기록 관리",
  settings: "시스템 설정",
  analysis: "시스템 구조 분석 (A to Z)",
}

const summaryCards = [
  {
    label: "전체 관리 이용자",
    value: summary.total,
    icon: Users,
    accent: "text-foreground",
    iconWrap: "bg-secondary text-secondary-foreground",
  },
  {
    label: "긴급 조치 필요",
    value: summary.urgent,
    icon: TriangleAlert,
    accent: "text-destructive",
    iconWrap: "bg-destructive/10 text-destructive",
  },
  {
    label: "주의 관찰",
    value: summary.attention,
    icon: Activity,
    accent: "text-warning-foreground",
    iconWrap: "bg-warning/15 text-warning-foreground",
  },
  {
    label: "안정 상태",
    value: summary.stable,
    icon: CheckCircle2,
    accent: "text-success-foreground",
    iconWrap: "bg-success/10 text-success-foreground",
  },
]

function DeviceChip({
  state,
  label,
  kind,
}: {
  state: DeviceState
  label: string
  kind: "appCheck" | "wearable"
}) {
  const Icon = kind === "appCheck" ? Bell : Watch
  const name = kind === "appCheck" ? "앱 인증" : "웨어러블"
  const tone =
    state === "ok"
      ? "bg-success/10 text-success-foreground ring-success/20"
      : state === "warning"
        ? "bg-warning/15 text-warning-foreground ring-warning/30"
        : "bg-muted text-muted-foreground ring-border"
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium ring-1 ${tone}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {name}: {label}
    </span>
  )
}

function NotificationsPanel({
  onClose,
  onSelectPatient,
}: {
  onClose: () => void
  onSelectPatient: (id: string) => void
}) {
  return (
    <div className="absolute right-0 top-12 z-20 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-bold text-card-foreground">알림 {notifications.length}건</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="알림 닫기"
          className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <ul className="max-h-80 overflow-y-auto">
        {notifications.map((n) => {
          const meta = riskMeta[n.level]
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => onSelectPatient(n.patientId)}
                className="flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition last:border-0 hover:bg-muted/50"
              >
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dotClass}`} />
                <span className="min-w-0 flex-1">
                  <span className="block text-pretty text-sm font-medium text-card-foreground">
                    {n.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {n.time}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function TriagePatientList({
  onSelectPatient,
}: {
  onSelectPatient: (id: string) => void
}) {
  const sorted = [...patients].sort((a, b) => b.riskScore - a.riskScore)
  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
        <div>
          <h2 className="text-base font-bold tracking-tight text-card-foreground">
            우선순위 트리아지
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            AI 위험 점수 기준 자동 정렬
          </p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground sm:inline-flex">
          <Activity className="h-3.5 w-3.5" aria-hidden />
          실시간 분석 중
        </span>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-6 py-3">상태</th>
              <th className="px-6 py-3">이름</th>
              <th className="px-6 py-3">나이</th>
              <th className="px-6 py-3">AI 발생 알림 요약</th>
              <th className="px-6 py-3">생체 데이터 연동</th>
              <th className="px-6 py-3 text-right">조치</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const meta = riskMeta[p.riskLevel]
              return (
                <tr
                  key={p.id}
                  className="border-b border-border last:border-0 transition hover:bg-muted/50"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badgeClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-card-foreground">
                    {p.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{p.age}세</td>
                  <td className="max-w-md px-6 py-4 text-pretty text-card-foreground">
                    {p.alertSummary}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      <DeviceChip
                        state={p.devices.appCheck.state}
                        label={p.devices.appCheck.label}
                        kind="appCheck"
                      />
                      <DeviceChip
                        state={p.devices.wearable.state}
                        label={p.devices.wearable.label}
                        kind="wearable"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      size="sm"
                      variant={p.riskLevel === "urgent" ? "default" : "outline"}
                      onClick={() => onSelectPatient(p.id)}
                      className="rounded-lg"
                    >
                      상세 분석 보기
                      <ChevronRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 p-4 lg:hidden">
        {sorted.map((p) => {
          const meta = riskMeta[p.riskLevel]
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPatient(p.id)}
              className="rounded-xl border border-border bg-background p-4 text-left transition hover:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badgeClass}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                  {meta.label}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
              </div>
              <p className="mt-3 font-semibold text-card-foreground">
                {p.name}{" "}
                <span className="font-normal text-muted-foreground">· {p.age}세</span>
              </p>
              <p className="mt-1 text-pretty text-sm text-muted-foreground">
                {p.alertSummary}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <DeviceChip
                  state={p.devices.appCheck.state}
                  label={p.devices.appCheck.label}
                  kind="appCheck"
                />
                <DeviceChip
                  state={p.devices.wearable.state}
                  label={p.devices.wearable.label}
                  kind="wearable"
                />
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}


function VoiceSection({
  onSelectPatient,
}: {
  onSelectPatient: (id: string) => void
}) {
  return (
    <section className="flex flex-col gap-4">
      {patients.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelectPatient(p.id)}
          className="rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:bg-muted/40"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-bold text-card-foreground">
              <Mic className="h-4 w-4 text-primary" aria-hidden />
              {p.name}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
          </div>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
            &ldquo;{p.voiceLog}&rdquo;
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
            AI 분석: {p.diagnosis.symptom} ({p.diagnosis.confidence}%)
          </p>
        </button>
      ))}
    </section>
  )
}

function SettingsSection() {
  const [toggles, setToggles] = useState({
    urgentAlert: true,
    sms: true,
    weeklyReport: false,
    nightMode: false,
  })
  const [saved, setSaved] = useState(false)

  const items: { key: keyof typeof toggles; label: string; desc: string }[] = [
    {
      key: "urgentAlert",
      label: "긴급 알림 즉시 수신",
      desc: "위험점수 80 이상 발생 시 즉시 푸시 알림",
    },
    {
      key: "sms",
      label: "보호자 SMS 자동 발송",
      desc: "긴급 상황 발생 시 보호자에게 문자 발송",
    },
    {
      key: "weeklyReport",
      label: "주간 리포트 이메일",
      desc: "매주 월요일 담당 어르신 종합 리포트 발송",
    },
    {
      key: "nightMode",
      label: "야간 모니터링 강화",
      desc: "22시~06시 수면·움직임 데이터 집중 분석",
    },
  ]

  return (
    <section className="max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-base font-bold tracking-tight text-card-foreground">
        알림 및 모니터링 설정
      </h2>
      <ul className="mt-5 flex flex-col gap-3">
        {items.map(({ key, label, desc }) => {
          const on = toggles[key]
          return (
            <li
              key={key}
              className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 px-4 py-3.5"
            >
              <div>
                <p className="text-sm font-semibold text-card-foreground">{label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={label}
                onClick={() => {
                  setToggles((t) => ({ ...t, [key]: !t[key] }))
                  setSaved(false)
                }}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  on ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition ${
                    on ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </li>
          )
        })}
      </ul>
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={() => setSaved(true)} className="rounded-xl">
          <Save className="h-4 w-4" aria-hidden />
          설정 저장
        </Button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-foreground">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            저장되었습니다
          </span>
        )}
      </div>
    </section>
  )
}

export function Dashboard({
  section,
  onNavigate,
  onSelectPatient,
  onLogout,
}: {
  section: Section
  onNavigate: (section: Section) => void
  onSelectPatient: (id: string) => void
  onLogout: () => void
}) {
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar active={section} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-4 border-b border-border bg-card px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground lg:hidden">
              <Heart className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">{today}</p>
              <h1 className="text-pretty text-xl font-bold tracking-tight text-card-foreground">
                {sectionTitles[section]}
              </h1>
            </div>
          </div>
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              aria-label="알림 3건"
              aria-expanded={notifOpen}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:text-foreground"
            >
              <Bell className="h-5 w-5" aria-hidden />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-bold text-primary-foreground">
                {notifications.length}
              </span>
            </button>
            {notifOpen && (
              <NotificationsPanel
                onClose={() => setNotifOpen(false)}
                onSelectPatient={(id) => {
                  setNotifOpen(false)
                  onSelectPatient(id)
                }}
              />
            )}
          </div>
        </header>

        <MobileNav active={section} onNavigate={onNavigate} />

        <main className="flex-1 px-6 py-6 lg:px-8">
          {section === "dashboard" && (
            <>
              <section
                aria-label="관리 현황 요약"
                className="grid grid-cols-2 gap-4 xl:grid-cols-4"
              >
                {summaryCards.map(({ label, value, icon: Icon, accent, iconWrap }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconWrap}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">{label}</p>
                    <p className={`mt-1 text-3xl font-bold tracking-tight ${accent}`}>
                      {value}
                      <span className="ml-1 text-base font-medium text-muted-foreground">
                        명
                      </span>
                    </p>
                  </div>
                ))}
              </section>
              <div className="mt-8">
                <TriagePatientList onSelectPatient={onSelectPatient} />
              </div>

              {/* AI 행동 지침 카드 */}
              <section className="mt-8">
                <h2 className="mb-4 text-base font-bold tracking-tight text-card-foreground">
                  📋 오늘의 AI 방문 행동 가이드
                </h2>
                <div className="grid gap-4 lg:grid-cols-3">
                  {patients.slice(0, 3).map((p) => {
                    const pmeta = riskMeta[p.riskLevel]
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onSelectPatient(p.id)}
                        className={`rounded-2xl border p-5 text-left shadow-sm transition hover:shadow-md ${
                          p.riskLevel === "urgent"
                            ? "border-destructive/30 bg-destructive/5 hover:bg-destructive/10"
                            : p.riskLevel === "attention"
                              ? "border-warning/30 bg-warning/10 hover:bg-warning/15"
                              : "border-border bg-card hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${pmeta.badgeClass}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${pmeta.dotClass}`} />
                            {pmeta.label}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                        </div>
                        <p className="text-sm font-bold text-card-foreground">
                          {p.name}
                          <span className="ml-1 font-normal text-muted-foreground">· {p.age}세</span>
                        </p>
                        <ul className="mt-3 flex flex-col gap-1.5">
                          {p.careGuide.slice(0, 2).map((g) => (
                            <li key={g} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" aria-hidden />
                              <span className="line-clamp-2">{g}</span>
                            </li>
                          ))}
                        </ul>
                      </button>
                    )
                  })}
                </div>
              </section>
            </>
          )}

          {section === "safety" && (
            <TriagePatientList onSelectPatient={onSelectPatient} />
          )}



          {section === "voice" && (
            <VoiceSection onSelectPatient={onSelectPatient} />
          )}

          {section === "settings" && <SettingsSection />}

          {section === "analysis" && <AnalysisSection />}
        </main>
      </div>
    </div>
  )
}
