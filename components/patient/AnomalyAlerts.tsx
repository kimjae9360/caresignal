"use client"

import { Activity, Clock, TriangleAlert, Moon, Footprints, PillBottle, Heart, CheckCircle2 } from "lucide-react"
import type { Anomaly } from "@/lib/mockData"

const riskMeta = {
  urgent: { label: "긴급", badge: "bg-destructive/15 text-destructive", border: "border-destructive/30 bg-destructive/5" },
  attention: { label: "주의", badge: "bg-warning/20 text-warning-foreground", border: "border-warning/30 bg-warning/10" },
  stable: { label: "안정", badge: "bg-success/10 text-success-foreground", border: "border-success/20 bg-success/5" },
}

const typeIcons = {
  sleep: Moon,
  activity: Footprints,
  medication: PillBottle,
  vital: Heart,
}

const typeLabels = {
  sleep: "수면",
  activity: "활동",
  medication: "복약",
  vital: "생체신호",
}

export function AnomalyAlerts({ anomalies }: { anomalies: Anomaly[] }) {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-success/20 bg-success/5 p-6 shadow-sm">
        <CheckCircle2 className="h-6 w-6 text-success-foreground" aria-hidden />
        <div>
          <p className="text-base font-bold text-success-foreground">이상 징후 없음</p>
          <p className="mt-1 text-sm text-muted-foreground">현재 모든 지표가 안정적인 정상 범위에 있습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {anomalies.map((a) => {
        const meta = riskMeta[a.severity]
        const Icon = typeIcons[a.type] || Activity

        return (
          <div key={a.id} className={`rounded-2xl border p-5 shadow-sm transition ${meta.border}`}>
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${meta.badge}`}>
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${meta.badge}`}>
                    {meta.label}
                  </span>
                  <span className="rounded-full bg-background px-2.5 py-1 text-[10px] font-bold text-muted-foreground ring-1 ring-border">
                    {typeLabels[a.type]}
                  </span>
                </div>
                <h4 className="text-base font-bold text-card-foreground">{a.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
                <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
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
