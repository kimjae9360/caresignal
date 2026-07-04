"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { type RiskLevel } from "@/lib/mockData"

export function WeeklyAiChart({ riskLevel }: { riskLevel: RiskLevel }) {
  // 모의 데이터: 요일별 위험도 점수 (0~100)
  const data = [
    { day: "월", score: 20 },
    { day: "화", score: 25 },
    { day: "수", score: 40 },
    { day: "목", score: 35 },
    { day: "금", score: riskLevel === 'urgent' ? 85 : riskLevel === 'attention' ? 60 : 20 },
    { day: "토", score: riskLevel === 'urgent' ? 90 : riskLevel === 'attention' ? 55 : 25 },
    { day: "일", score: riskLevel === 'urgent' ? 95 : riskLevel === 'attention' ? 65 : 15 },
  ]

  const getBarColor = (score: number) => {
    if (score >= 80) return "#ef4444" // red (urgent)
    if (score >= 50) return "#f59e0b" // yellow (attention)
    return "#22c55e" // green (stable)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              domain={[0, 100]}
              ticks={[0, 50, 100]}
            />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const score = payload[0].value as number;
                  let status = "안정"
                  if (score >= 80) status = "긴급"
                  else if (score >= 50) status = "주의"
                  
                  return (
                    <div className="rounded-lg border border-border bg-card p-3 shadow-md">
                      <p className="text-sm font-bold mb-1">{payload[0].payload.day}요일</p>
                      <p className="text-xs text-muted-foreground">위험도 점수: {score}점</p>
                      <p className="text-xs font-semibold mt-1" style={{ color: getBarColor(score) }}>상태: {status}</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        최근 일주일 간의 AI 복합 위험도 트렌드입니다.
      </p>
    </div>
  )
}
