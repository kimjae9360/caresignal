"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Moon, Footprints, Heart, PillBottle, CheckCircle2, Circle } from "lucide-react"
import type { IoTLog } from "@/lib/mockData"

export function IoTCharts({ logs }: { logs: IoTLog[] }) {
  if (!logs || logs.length === 0) return null

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 수면 시간 차트 */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" aria-hidden />
            <h3 className="text-base font-bold text-card-foreground">수면 시간 추이</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted)/0.5)" }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                />
                <Bar dataKey="sleepHours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="수면시간(시간)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 심박수 차트 */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" aria-hidden />
            <h3 className="text-base font-bold text-card-foreground">안정 시 심박수 추이</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                />
                <Line type="monotone" dataKey="heartRate" stroke="hsl(var(--destructive))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--destructive))" }} name="심박수(bpm)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 스마트 약통 개폐 이력 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <PillBottle className="h-5 w-5 text-primary" aria-hidden />
          <h3 className="text-base font-bold text-card-foreground">스마트 약통 개폐 이력 (최근 7일)</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm transition ${
                log.pillboxOpened ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"
              }`}
            >
              {log.pillboxOpened ? (
                <CheckCircle2 className="h-5 w-5 text-success-foreground" aria-hidden />
              ) : (
                <Circle className="h-5 w-5 text-destructive" aria-hidden />
              )}
              <div>
                <p className="font-bold text-card-foreground">{log.date}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {log.pillboxOpened ? `${log.pillboxTime} 개봉` : "미개봉"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
