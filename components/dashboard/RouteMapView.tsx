"use client"

import React, { useMemo } from "react"
import { useRouter } from "next/navigation"
import { type Patient } from "@/lib/mockData"
import { MapPin, Navigation } from "lucide-react"

interface RouteMapViewProps {
  patients: Patient[]
}

// 간단한 의사 난수 생성기 (이름 기반으로 고정된 좌표 생성)
function getSeededRandom(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  }
  return () => {
    h = Math.imul(1597334677, h) + 1 | 0
    return ((h >>> 0) / 4294967296)
  }
}

export function RouteMapView({ patients }: RouteMapViewProps) {
  const router = useRouter()

  // 환자마다 고유하고 고정된 지도 좌표 생성 (10% ~ 90% 사이)
  const mapMarkers = useMemo(() => {
    return patients.map(p => {
      const rand = getSeededRandom(p.name + p.id)
      return {
        ...p,
        x: 10 + rand() * 80,
        y: 10 + rand() * 80,
      }
    })
  }, [patients])

  // 긴급(Urgent) 환자들만 선으로 연결하여 최적 동선처럼 보이게 함
  const urgentMarkers = mapMarkers.filter(p => p.riskLevel === "urgent")

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl border border-border bg-accent/20 sm:h-[600px]">
      {/* 추상적인 맵 배경 (SVG) */}
      <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* 임의의 도로선들 */}
        <path d="M 0 100 Q 200 150 400 100 T 800 200" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M 200 0 Q 300 300 200 600" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M 0 400 Q 400 350 800 400" fill="none" stroke="currentColor" strokeWidth="6" />
      </svg>

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-background/80 to-transparent p-4">
        <h3 className="flex items-center gap-2 font-bold text-card-foreground">
          <Navigation className="h-5 w-5 text-primary" />
          AI 기반 최적 방문 동선
        </h3>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            긴급 {urgentMarkers.length}
          </span>
        </div>
      </div>

      {/* 동선 연결선 (Urgent만) */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none">
        {urgentMarkers.length > 1 && (
          <path
            d={`M ${urgentMarkers.map(m => `${m.x}% ${m.y}%`).join(" L ")}`}
            fill="none"
            stroke="hsl(var(--destructive))"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="opacity-60"
          />
        )}
      </svg>

      {/* 환자 마커들 */}
      {mapMarkers.map((m) => (
        <button
          key={m.id}
          onClick={() => router.push(`/patient?id=${m.id}`)}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group outline-none"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
        >
          {m.riskLevel === 'urgent' && (
            <span className="absolute -inset-2 rounded-full bg-destructive/30 animate-ping" />
          )}
          <div className={`relative flex h-8 w-8 items-center justify-center rounded-full shadow-lg border-2 transition-transform group-hover:scale-125 ${
            m.riskLevel === 'urgent' ? 'bg-destructive text-destructive-foreground border-white' :
            m.riskLevel === 'attention' ? 'bg-warning text-warning-foreground border-white' :
            'bg-card text-card-foreground border-border'
          }`}>
            <MapPin className="h-4 w-4" />
          </div>
          
          {/* 툴팁 */}
          <div className="absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 scale-0 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 group-focus:scale-100 group-focus:opacity-100">
            <div className="rounded-lg bg-foreground px-3 py-2 text-xs font-medium text-background shadow-xl">
              <p className="font-bold">{m.name} ({m.age}세)</p>
              <p className="opacity-80">점수: {m.riskScore}</p>
            </div>
            <div className="mx-auto h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-foreground" />
          </div>
        </button>
      ))}

      {/* 내 위치 (가상의 복지센터) */}
      <div className="absolute bottom-10 left-10 flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg border-2 border-white">
          <Navigation className="h-5 w-5" />
        </div>
        <span className="mt-1 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-md text-card-foreground">현재 위치</span>
      </div>
    </div>
  )
}
