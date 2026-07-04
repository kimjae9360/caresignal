"use client"

import { useState, useEffect } from "react"
import { MapPin, Search, ChevronDown, CheckCircle2 } from "lucide-react"
import { mockPatients, type Patient } from "@/lib/mockData"

export function SmartMatching({
  onPatientSelect,
}: {
  onPatientSelect: (patient: Patient | null) => void
}) {
  const [matchedPatient, setMatchedPatient] = useState<Patient | null>(null)
  const [isSearching, setIsSearching] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // GPS 모의 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      // 마포구 성산동 근처 (김순자 어르신 매칭)
      const mockLocation = { lat: 37.5645, lng: 126.9067 }
      const closest = mockPatients.reduce((prev, curr) => {
        const prevDist = Math.pow(prev.lat - mockLocation.lat, 2) + Math.pow(prev.lng - mockLocation.lng, 2)
        const currDist = Math.pow(curr.lat - mockLocation.lat, 2) + Math.pow(curr.lng - mockLocation.lng, 2)
        return currDist < prevDist ? curr : prev
      })

      setMatchedPatient(closest)
      onPatientSelect(closest)
      setIsSearching(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [onPatientSelect])

  return (
    <div className="relative z-10 w-full">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-card-foreground">
            <MapPin className="h-4 w-4 text-primary" aria-hidden />
            현재 위치 기반 스마트 매칭
          </div>
          {!isSearching && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-success-foreground">
              <CheckCircle2 className="h-3 w-3" /> 매칭 완료
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex w-full items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-left transition hover:bg-muted"
        >
          {isSearching ? (
            <div className="flex items-center gap-3">
              <Search className="h-4 w-4 animate-pulse text-muted-foreground" aria-hidden />
              <span className="text-sm font-medium text-muted-foreground">현재 위치 탐색 중...</span>
            </div>
          ) : matchedPatient ? (
            <div>
              <p className="text-base font-bold text-card-foreground">
                {matchedPatient.name} <span className="font-normal text-muted-foreground">({matchedPatient.age}세)</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">{matchedPatient.address}</p>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">어르신을 선택하세요</span>
          )}
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} aria-hidden />
        </button>
      </div>

      {isDropdownOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 max-h-60 overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-lg">
          {mockPatients.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setMatchedPatient(p)
                onPatientSelect(p)
                setIsDropdownOpen(false)
              }}
              className="flex w-full flex-col items-start justify-center rounded-xl px-4 py-3 text-left transition hover:bg-muted"
            >
              <span className="font-bold text-card-foreground">{p.name} ({p.age}세)</span>
              <span className="text-xs text-muted-foreground truncate">{p.address}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
