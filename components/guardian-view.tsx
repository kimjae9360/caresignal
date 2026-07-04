"use client"

import { useState } from "react"
import {
  Activity,
  ArrowLeft,
  Bell,
  CheckCircle2,
  Circle,
  Clock,
  Footprints,
  Heart,
  Hospital,
  MapPin,
  Moon,
  Phone,
  PillBottle,
  Shield,
  TriangleAlert,
  User,
  Watch,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { riskMeta, type Patient } from "@/lib/data"

type GuardianTab = "anomaly" | "prescription" | "iot"

const tabs: { id: GuardianTab; label: string; icon: typeof Activity }[] = [
  { id: "anomaly", label: "이상 징후 분석", icon: TriangleAlert },
  { id: "prescription", label: "처방 기록", icon: PillBottle },
  { id: "iot", label: "IoT 기록지", icon: Watch },
]

/* ──────────────────────────────────────────────
   Bar chart components (pure CSS)
   ────────────────────────────────────────────── */
function MiniBarChart({
  data,
  max,
  label,
  unit,
  dangerThreshold,
}: {
  data: { date: string; value: number }[]
  max: number
  label: string
  unit: string
  dangerThreshold?: number
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-card-foreground">{label}</p>
      <div className="flex h-36 items-end justify-between gap-1.5">
        {data.map((d, i) => {
          const isDanger = dangerThreshold !== undefined && d.value < dangerThreshold
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={`text-[11px] font-semibold ${isDanger ? "text-destructive" : "text-muted-foreground"}`}
              >
                {d.value}
                {unit}
              </span>
              <div className="flex w-full flex-1 items-end">
                <div
                  className={`w-full rounded-t-md transition-all ${isDanger ? "bg-destructive" : "bg-primary/70"}`}
                  style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{d.date}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   이상 징후 분석지 탭
   ────────────────────────────────────────────── */
function AnomalySection({ patient }: { patient: Patient }) {
  if (patient.anomalies.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-success/20 bg-success/5 p-6">
        <CheckCircle2 className="h-6 w-6 text-success-foreground" aria-hidden />
        <div>
          <p className="text-base font-bold text-success-foreground">이상 징후 없음</p>
          <p className="mt-1 text-sm text-muted-foreground">현재 모든 지표가 정상 범위 내에 있습니다.</p>
        </div>
      </div>
    )
  }

  const typeIcons: Record<string, typeof Activity> = {
    sleep: Moon,
    activity: Footprints,
    medication: PillBottle,
    vital: Heart,
  }

  const typeLabels: Record<string, string> = {
    sleep: "수면",
    activity: "활동",
    medication: "복약",
    vital: "생체신호",
  }

  return (
    <div className="space-y-4">
      {patient.anomalies.map((a) => {
        const meta = riskMeta[a.severity]
        const Icon = typeIcons[a.type] || Activity
        return (
          <div
            key={a.id}
            className={`rounded-2xl border p-5 shadow-sm ${
              a.severity === "urgent"
                ? "border-destructive/30 bg-destructive/5"
                : a.severity === "attention"
                  ? "border-warning/30 bg-warning/10"
                  : "border-border bg-card"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  a.severity === "urgent"
                    ? "bg-destructive/15 text-destructive"
                    : "bg-warning/20 text-warning-foreground"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badgeClass}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                    {meta.label}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {typeLabels[a.type]}
                  </span>
                </div>
                <h4 className="mt-2 text-base font-bold text-card-foreground">{a.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{a.description}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" aria-hidden />
                  감지 시각: {a.detectedAt}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ──────────────────────────────────────────────
   처방 기록 & 병원 정보 탭
   ────────────────────────────────────────────── */
function PrescriptionSection({ patient }: { patient: Patient }) {
  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-card-foreground">
          <Hospital className="h-5 w-5 text-primary" aria-hidden />
          처방 기록 타임라인
        </h3>
        <div className="relative ml-4 space-y-0 border-l-2 border-border pl-6">
          {patient.prescriptions.map((rx, i) => (
            <div key={rx.id} className="relative pb-6 last:pb-0">
              {/* Dot */}
              <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-card">
                <span className="h-2 w-2 rounded-full bg-primary" />
              </span>

              <div className="rounded-xl bg-muted/50 p-4 ring-1 ring-border">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">{rx.date}</span>
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                    {rx.hospital}
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-card-foreground">{rx.drug}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  복용법: {rx.dosage} · 담당의: {rx.doctor}
                </p>
                {rx.nextVisit && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Clock className="h-3 w-3" aria-hidden />
                    다음 내원 예정: {rx.nextVisit}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current medication table */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-base font-bold text-card-foreground">현재 복용 중인 약물</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5">약물명</th>
                <th className="px-4 py-2.5">복용법</th>
                <th className="px-4 py-2.5">처방일</th>
                <th className="px-4 py-2.5">병원</th>
              </tr>
            </thead>
            <tbody>
              {patient.prescriptions.map((rx) => (
                <tr key={rx.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition">
                  <td className="px-4 py-3 font-semibold text-card-foreground">{rx.drug}</td>
                  <td className="px-4 py-3 text-muted-foreground">{rx.dosage}</td>
                  <td className="px-4 py-3 text-muted-foreground">{rx.date}</td>
                  <td className="px-4 py-3 text-muted-foreground">{rx.hospital}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   IoT 기록지 탭
   ────────────────────────────────────────────── */
function IoTSection({ patient }: { patient: Patient }) {
  const logs = patient.iotLogs

  return (
    <div className="space-y-6">
      {/* Sleep chart */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <Moon className="h-4 w-4 text-primary" aria-hidden />
          <h3 className="text-sm font-bold text-card-foreground">최근 7일 수면 시간</h3>
        </div>
        <MiniBarChart
          data={logs.map((l) => ({ date: l.date, value: l.sleepHours }))}
          max={10}
          label=""
          unit="h"
          dangerThreshold={5}
        />
      </div>

      {/* Activity + Heart Rate */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <Footprints className="h-4 w-4 text-primary" aria-hidden />
            <h3 className="text-sm font-bold text-card-foreground">일일 걸음 수</h3>
          </div>
          <MiniBarChart
            data={logs.map((l) => ({ date: l.date, value: l.steps }))}
            max={Math.max(...logs.map((l) => l.steps), 6000)}
            label=""
            unit=""
            dangerThreshold={1000}
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" aria-hidden />
            <h3 className="text-sm font-bold text-card-foreground">안정 시 심박수 (bpm)</h3>
          </div>
          <MiniBarChart
            data={logs.map((l) => ({ date: l.date, value: l.heartRate }))}
            max={120}
            label=""
            unit=""
          />
        </div>
      </div>

      {/* Pillbox events */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <PillBottle className="h-4 w-4 text-primary" aria-hidden />
          <h3 className="text-sm font-bold text-card-foreground">스마트 약통 개폐 이력</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {logs.map((l, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${
                l.pillboxOpened
                  ? "border-success/20 bg-success/5"
                  : "border-destructive/20 bg-destructive/5"
              }`}
            >
              {l.pillboxOpened ? (
                <CheckCircle2 className="h-4 w-4 text-success-foreground" aria-hidden />
              ) : (
                <Circle className="h-4 w-4 text-destructive" aria-hidden />
              )}
              <div>
                <span className="font-semibold text-card-foreground">{l.date}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {l.pillboxOpened ? `개봉 ${l.pillboxTime}` : "미개봉"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────── */
export function GuardianView({
  patient,
  onBack,
}: {
  patient: Patient
  onBack: () => void
}) {
  const [activeTab, setActiveTab] = useState<GuardianTab>("anomaly")
  const meta = riskMeta[patient.riskLevel]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            돌아가기
          </button>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              보호자 열람 화면
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.badgeClass}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
              {meta.label}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {/* Profile card */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <User className="h-7 w-7" aria-hidden />
                </span>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
                    {patient.name}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {patient.age}세 · {patient.gender}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {patient.address}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {patient.medications.map((m) => (
                      <span
                        key={m.label}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                          m.isNew
                            ? "bg-destructive/10 text-destructive ring-1 ring-destructive/20"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {m.label}
                        {m.isNew && " (신규)"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 담당 종사자 연락처 카드 */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 lg:min-w-[260px]">
                <div className="flex items-center gap-2 text-sm font-bold text-primary">
                  <Shield className="h-4 w-4" aria-hidden />
                  담당 돌봄종사자
                </div>
                <div className="mt-3 space-y-1.5 text-sm">
                  <p className="font-semibold text-card-foreground">
                    {patient.caregiver.name} {patient.caregiver.role}
                  </p>
                  {patient.caregiver.organization && (
                    <p className="text-xs text-muted-foreground">{patient.caregiver.organization}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-card px-3 py-2 ring-1 ring-border">
                    <Phone className="h-4 w-4 text-primary" aria-hidden />
                    <div>
                      <p className="text-xs text-muted-foreground">일회용 안심번호</p>
                      <p className="text-sm font-bold tracking-wide text-card-foreground">
                        {patient.caregiver.safePhone || patient.caregiver.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tab switcher */}
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-muted/50 p-1.5 ring-1 ring-border">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === id
                    ? "bg-card text-card-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "anomaly" && <AnomalySection patient={patient} />}
          {activeTab === "prescription" && <PrescriptionSection patient={patient} />}
          {activeTab === "iot" && <IoTSection patient={patient} />}
        </div>
      </main>
    </div>
  )
}
