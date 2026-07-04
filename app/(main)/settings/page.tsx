"use client"

import { useState } from "react"
import { Bell, Moon, Type, Volume2, Database, ShieldAlert, Sparkles, UserPlus, Users, Trash2 } from "lucide-react"
import { usePatients } from "@/components/providers/PatientProvider"

export default function SettingsPage() {
  const [largeText, setLargeText] = useState(true)
  const [highContrast, setHighContrast] = useState(false)
  const [autoRecord, setAutoRecord] = useState(true)
  
  const { caregivers, addCaregiver, removeCaregiver } = usePatients()
  const [newCaregiver, setNewCaregiver] = useState({ name: "", phone: "", center: "" })

  const handleAddCaregiver = (e: React.FormEvent) => {
    e.preventDefault()
    addCaregiver({
      id: `c${Date.now()}`,
      name: newCaregiver.name,
      phone: newCaregiver.phone,
      center: newCaregiver.center
    })
    setNewCaregiver({ name: "", phone: "", center: "" })
  }

  return (
    <div className="flex h-full flex-col bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
          시스템 설정
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          앱 환경, 알림, 복지사(담당자) 계정 및 데이터 연동을 관리합니다.
        </p>
      </header>

      <main className="max-w-3xl flex-1 space-y-8">
        {/* 담당자 관리 섹션 */}
        <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="border-b border-border bg-muted/30 p-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-card-foreground">
              <Users className="h-5 w-5 text-primary" />
              담당자 (사회복지사) 관리
            </h2>
          </div>
          <div className="p-5 space-y-6">
            <div className="space-y-3">
              {caregivers.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
                  <div>
                    <p className="font-bold text-sm text-card-foreground">{c.name} <span className="text-muted-foreground font-normal ml-1">({c.center})</span></p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.phone}</p>
                  </div>
                  <button 
                    onClick={() => removeCaregiver(c.id)}
                    className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition"
                    title="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddCaregiver} className="border-t border-border pt-5 mt-5">
              <h3 className="text-sm font-bold text-card-foreground mb-3 flex items-center gap-1.5">
                <UserPlus className="h-4 w-4" /> 새로운 담당자 등록
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <input required value={newCaregiver.name} onChange={e=>setNewCaregiver({...newCaregiver, name:e.target.value})} type="text" placeholder="이름 (예: 홍길동)" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                <input required value={newCaregiver.phone} onChange={e=>setNewCaregiver({...newCaregiver, phone:e.target.value})} type="text" placeholder="연락처 (예: 010-1234-5678)" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                <input required value={newCaregiver.center} onChange={e=>setNewCaregiver({...newCaregiver, center:e.target.value})} type="text" placeholder="소속 센터 (예: 마포센터)" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <button type="submit" className="mt-3 w-full rounded-xl bg-primary/10 text-primary py-2 text-sm font-bold hover:bg-primary/20 transition">
                담당자 추가하기
              </button>
            </form>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="border-b border-border bg-muted/30 p-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-card-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              접근성 및 편의 기능 (시니어 특화)
            </h2>
          </div>
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
                  <Type className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">큰 글씨 모드</p>
                  <p className="text-sm text-muted-foreground">현장 업무 시 화면의 글자를 20% 더 크게 표시합니다.</p>
                </div>
              </div>
              <button 
                onClick={() => setLargeText(!largeText)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${largeText ? 'bg-primary' : 'bg-muted'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${largeText ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
                  <Moon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">야외 고대비 모드</p>
                  <p className="text-sm text-muted-foreground">햇빛이 강한 야외 방문 시 화면을 뚜렷하게 대비시킵니다.</p>
                </div>
              </div>
              <button 
                onClick={() => setHighContrast(!highContrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${highContrast ? 'bg-primary' : 'bg-muted'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
                  <Volume2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">음성 자동 기록 (STT) 활성화</p>
                  <p className="text-sm text-muted-foreground">현장 방문 탭 진입 시 자동으로 녹음을 준비합니다.</p>
                </div>
              </div>
              <button 
                onClick={() => setAutoRecord(!autoRecord)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoRecord ? 'bg-primary' : 'bg-muted'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoRecord ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="border-b border-border bg-muted/30 p-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-card-foreground">
              <Database className="h-5 w-5 text-primary" />
              데이터 및 연동 설정
            </h2>
          </div>
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-success/10 p-2 text-success">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">바우처 시스템 자동 전송</p>
                  <p className="text-sm text-muted-foreground">보고서 작성 완료 시 지자체 바우처 시스템으로 자동 전송됩니다.</p>
                </div>
              </div>
              <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">연동됨</span>
            </div>

            <div className="flex items-center justify-between p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-destructive/10 p-2 text-destructive">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-destructive">데이터 완전 삭제 (위험)</p>
                  <p className="text-sm text-muted-foreground">로컬에 캐시된 모든 어르신 현장 방문 데이터를 삭제합니다.</p>
                </div>
              </div>
              <button className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground transition">
                초기화
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
