"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronRight, TriangleAlert, Info, Users, Activity, SlidersHorizontal, Plus, Sparkles, X, Phone, Check, Map, List } from "lucide-react"
import { usePatients } from "@/components/providers/PatientProvider"
import { type RiskLevel, type Patient } from "@/lib/mockData"
import { RouteMapView } from "@/components/dashboard/RouteMapView"

const riskMeta: Record<RiskLevel, { label: string; badge: string; dot: string; bg: string }> = {
  urgent: {
    label: "긴급",
    badge: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
    dot: "bg-destructive",
    bg: "bg-destructive/5 hover:bg-destructive/10 border-destructive/20",
  },
  attention: {
    label: "주의",
    badge: "bg-warning/15 text-warning-foreground ring-1 ring-warning/30",
    dot: "bg-warning",
    bg: "bg-warning/10 hover:bg-warning/20 border-warning/20",
  },
  stable: {
    label: "안정",
    badge: "bg-success/10 text-success-foreground ring-1 ring-success/20",
    dot: "bg-success",
    bg: "bg-card hover:bg-muted/50 border-border",
  },
}

export function TriageBoard() {
  const router = useRouter()
  const { patients, addPatient, caregivers } = usePatients()
  
  // UI States
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"risk_desc" | "age_desc" | "age_asc">("risk_desc")
  const [filterLevel, setFilterLevel] = useState<"all" | RiskLevel>("all")
  const [isAiMode, setIsAiMode] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  // New Patient Form State
  const [newPatient, setNewPatient] = useState({
    name: "", age: "", address: "", gender: "여성", caregiverId: ""
  })

  // Calculations
  const urgentCount = patients.filter(p => p.riskLevel === 'urgent').length
  const attentionCount = patients.filter(p => p.riskLevel === 'attention').length
  const stableCount = patients.filter(p => p.riskLevel === 'stable').length
  const totalCount = patients.length

  // Filter & Sort Logic
  let processedPatients = [...patients]
  
  if (searchTerm) {
    processedPatients = processedPatients.filter(p => p.name.includes(searchTerm))
  }
  
  if (filterLevel !== "all") {
    processedPatients = processedPatients.filter(p => p.riskLevel === filterLevel)
  }

  if (isAiMode) {
    // AI Mode: Only show Urgent/Attention, sorted by risk score
    processedPatients = processedPatients.filter(p => p.riskLevel !== 'stable')
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5) // Top 5
  } else {
    // Normal Sorting
    if (sortOrder === "risk_desc") processedPatients.sort((a, b) => b.riskScore - a.riskScore)
    if (sortOrder === "age_desc") processedPatients.sort((a, b) => b.age - a.age)
    if (sortOrder === "age_asc") processedPatients.sort((a, b) => a.age - b.age)
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedCaregiver = caregivers.find(c => c.id === newPatient.caregiverId) || caregivers[0]
    
    const p: Patient = {
      id: `p${Date.now()}`,
      name: newPatient.name,
      age: parseInt(newPatient.age) || 70,
      gender: newPatient.gender,
      address: newPatient.address,
      phone: "010-0000-0000",
      riskLevel: "stable",
      riskScore: 20,
      alertSummary: "수동 등록된 어르신입니다.",
      medications: [],
      prescriptions: [],
      iotLogs: { sleepHours: [], heartRate: [], pillBoxOpened: [] },
      anomalies: [],
      caregiver: selectedCaregiver
    }
    addPatient(p)
    setShowAddModal(false)
    setNewPatient({ name: "", age: "", address: "", gender: "여성", caregiverId: "" })
  }

  return (
    <div className="space-y-8">
      {/* AI 스마트 브리핑 배너 */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-primary mb-1">AI 스마트 브리핑</h3>
            <p className="text-sm font-medium text-card-foreground leading-relaxed">
              오늘 방문해야 할 긴급 대상자는 <span className="text-destructive font-bold">{urgentCount}명</span>입니다.
              어제 대비 전체 위험도가 소폭 증가했습니다. 특히 김순자 어르신의 수면 데이터 이상이 지속되고 있으니 첫 방문을 권장합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 요약 통계 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">총 관리 대상</p>
              <p className="text-2xl font-bold text-card-foreground">{totalCount}<span className="text-sm font-normal text-muted-foreground ml-1">명</span></p>
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/20 text-destructive">
              <TriangleAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-destructive/80">긴급 우선 방문</p>
              <p className="text-2xl font-bold text-destructive">{urgentCount}<span className="text-sm font-normal text-destructive/70 ml-1">명</span></p>
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl border border-warning/20 bg-warning/10 p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/20 text-warning-foreground">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-warning-foreground/80">주의 관찰</p>
              <p className="text-2xl font-bold text-warning-foreground">{attentionCount}<span className="text-sm font-normal text-warning-foreground/70 ml-1">명</span></p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-success/20 bg-success/5 p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20 text-success-foreground">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-success-foreground/80">안정 및 기타</p>
              <p className="text-2xl font-bold text-success-foreground">{stableCount}<span className="text-sm font-normal text-success-foreground/70 ml-1">명</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* 컨트롤 패널 (검색, 필터, 등록) */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl bg-card p-4 border border-border shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
            <input
              type="text"
              placeholder="어르신 이름 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative flex items-center bg-background border border-border rounded-xl px-3 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground mr-2" />
              <select 
                value={filterLevel} 
                onChange={e => setFilterLevel(e.target.value as any)}
                className="bg-transparent text-sm outline-none w-24 text-card-foreground cursor-pointer"
              >
                <option value="all">전체 상태</option>
                <option value="urgent">긴급</option>
                <option value="attention">주의</option>
                <option value="stable">안정</option>
              </select>
            </div>
            <select 
              value={sortOrder} 
              onChange={e => setSortOrder(e.target.value as any)}
              className="bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-card-foreground cursor-pointer"
            >
              <option value="risk_desc">위험도 높은순</option>
              <option value="age_desc">고령순</option>
              <option value="age_asc">저연령순</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 뷰 모드 토글 (태블릿/PC에서만 맵 뷰 우선권장, 모바일도 가능) */}
          <div className="flex items-center rounded-xl bg-muted/50 p-1 border border-border">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-all ${viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-all ${viewMode === "map" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Map className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAiMode(!isAiMode)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              isAiMode 
                ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20" 
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI 추천 정렬</span>
            <span className="sm:hidden">AI</span>
          </button>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-card border border-border hover:bg-muted px-4 py-2.5 text-sm font-bold text-card-foreground transition"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">수동 등록</span>
          </button>
        </div>
      </div>

      {/* 맵 뷰 모드 */}
      {viewMode === "map" ? (
        <RouteMapView patients={processedPatients} />
      ) : (
        <>
          {/* 모바일 뷰 (카드 리스트) */}
          <div className="grid gap-3 sm:hidden">
            {processedPatients.map((p) => {
              const meta = riskMeta[p.riskLevel]
              return <MobilePatientCard key={p.id} p={p} meta={meta} />
            })}
          </div>

          {/* 데스크톱 뷰 (테이블) */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 font-semibold text-muted-foreground">어르신</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">위험도</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">상태 요약 (AI 분석)</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">담당자</th>
              <th className="px-6 py-4 text-right font-semibold text-muted-foreground">상세보기</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {processedPatients.map((p) => {
              const meta = riskMeta[p.riskLevel]
              return (
                <tr
                  key={p.id}
                  onClick={() => router.push(`/patient?id=${p.id}`)}
                  className={`cursor-pointer transition hover:bg-muted/50 ${
                    p.riskLevel === "urgent" ? "bg-destructive/5" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-card-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.age}세 · {p.gender}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                      {meta.label} ({p.riskScore})
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <p className={`truncate ${p.riskLevel === 'urgent' ? 'font-medium text-destructive' : 'text-muted-foreground'}`}>
                      {p.alertSummary}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-card-foreground">{p.caregiver.name}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" aria-hidden />
                  </td>
                </tr>
              )
            })}
            {processedPatients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                  조건에 맞는 어르신이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </>
      )}

      {/* 수동 등록 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-card-foreground">새 어르신 수동 등록</h3>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-card-foreground">이름</label>
                <input required value={newPatient.name} onChange={e=>setNewPatient({...newPatient, name:e.target.value})} type="text" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="예: 홍길동" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-card-foreground">나이</label>
                  <input required value={newPatient.age} onChange={e=>setNewPatient({...newPatient, age:e.target.value})} type="number" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="예: 75" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-card-foreground">성별</label>
                  <select value={newPatient.gender} onChange={e=>setNewPatient({...newPatient, gender:e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
                    <option>여성</option>
                    <option>남성</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-card-foreground">주소</label>
                <input required value={newPatient.address} onChange={e=>setNewPatient({...newPatient, address:e.target.value})} type="text" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="상세 주소 입력" />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-semibold text-card-foreground">담당자 배정</label>
                <select required value={newPatient.caregiverId} onChange={e=>setNewPatient({...newPatient, caregiverId:e.target.value})} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
                  <option value="" disabled>담당자를 선택하세요</option>
                  {caregivers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.center})</option>
                  ))}
                </select>
              </div>
              
              <button type="submit" className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition">
                등록 완료
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function MobilePatientCard({ p, meta }: { p: Patient; meta: any }) {
  const router = useRouter()
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = e.touches[0].clientX - touchStart
    setSwipeOffset(Math.max(-120, Math.min(120, diff)))
  }
  const handleTouchEnd = () => {
    if (swipeOffset > 80) {
      alert(`${p.name} 어르신 보호자에게 전화를 연결합니다. (모의)`)
    } else if (swipeOffset < -80) {
      alert(`${p.name} 어르신 현장 방문 완료 처리 되었습니다. (모의)`)
    }
    setSwipeOffset(0)
    setTouchStart(null)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/30">
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between px-5">
        <div className="flex items-center gap-2 font-bold text-success">
          <Phone className="h-5 w-5" />
          <span>전화걸기</span>
        </div>
        <div className="flex items-center gap-2 font-bold text-primary">
          <span>방문완료</span>
          <Check className="h-5 w-5" />
        </div>
      </div>
      
      {/* Foreground Card */}
      <button
        type="button"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => { if (Math.abs(swipeOffset) < 10) router.push(`/patient?id=${p.id}`) }}
        style={{ transform: `translateX(${swipeOffset}px)`, transition: touchStart !== null ? 'none' : 'transform 0.2s ease-out' }}
        className={`relative flex w-full flex-col gap-2 rounded-2xl border p-4 text-left shadow-sm bg-card ${meta.bg}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-card-foreground">{p.name}</span>
            <span className="text-xs text-muted-foreground">{p.age}세</span>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${meta.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            점수 {p.riskScore}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{p.alertSummary}</p>
      </button>
    </div>
  )
}

