"use client"

import { useState, useRef } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Bell,
  ClipboardList,
  Circle,
  Eye,
  MapPin,
  Mic,
  Moon,
  PillBottle,
  Send,
  Stethoscope,
  User,
  Watch,
} from "lucide-react"
import { AppSidebar, type Section } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { riskMeta, type Patient } from "@/lib/data"
import { analyzeVoiceRecord } from "@/lib/ai"

function DeviceStatusBadge({
  icon: Icon,
  name,
  label,
}: {
  icon: typeof Watch
  name: string
  label: string
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-success/20 bg-success/5 px-3.5 py-2.5">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
      </span>
      <Icon className="h-4 w-4 text-success-foreground" aria-hidden />
      <span className="text-sm font-medium text-card-foreground">
        {name}: <span className="text-success-foreground">{label}</span>
      </span>
    </div>
  )
}

function SleepChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 8)
  const labels = ["6일전", "5일전", "4일전", "3일전", "2일전", "어제", "오늘"]
  return (
    <div className="flex h-40 items-end justify-between gap-2">
      {data.map((h, i) => {
        const low = h < 5
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <span
              className={`text-xs font-semibold ${low ? "text-destructive" : "text-muted-foreground"}`}
            >
              {h.toFixed(1)}
            </span>
            <div className="flex w-full flex-1 items-end">
              <div
                className={`w-full rounded-t-md ${low ? "bg-destructive" : "bg-primary/70"}`}
                style={{ height: `${(h / max) * 100}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground">{labels[i]}</span>
          </div>
        )
      })}
    </div>
  )
}

export function PatientDetail({
  patient,
  onBack,
  onNavigate,
  onLogout,
  onGuardianView,
}: {
  patient: Patient
  onBack: () => void
  onNavigate: (section: Section) => void
  onLogout: () => void
  onGuardianView?: () => void
}) {
  const meta = riskMeta[patient.riskLevel]
  const doneCount = patient.medication.filter((m) => m.done).length
  const [sent, setSent] = useState(false)
  const [voiceInput, setVoiceInput] = useState(patient.voiceLog)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [diagnosis, setDiagnosis] = useState(patient.diagnosis)
  const [careGuide, setCareGuide] = useState(patient.careGuide)
  const [clinicalReport, setClinicalReport] = useState(patient.clinicalReport)
  const recognitionRef = useRef<any>(null)

  function toggleRecording() {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRecognition) {
        alert("이 브라우저는 음성 인식을 지원하지 않습니다. 구글 크롬 브라우저를 사용해주세요.")
        return
      }
      const recognition = new SpeechRecognition()
      recognition.lang = 'ko-KR'
      recognition.interimResults = true
      recognition.onresult = (event: any) => {
        let text = ''
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript
        }
        setVoiceInput(text)
      }
      recognition.onerror = () => setIsRecording(false)
      recognition.onend = () => setIsRecording(false)
      recognition.start()
      recognitionRef.current = recognition
      setIsRecording(true)
    }
  }

  async function handleAnalyze() {
    setIsAnalyzing(true)
    const result = await analyzeVoiceRecord(voiceInput)
    if (result) {
      setDiagnosis({
        symptom: result.symptom || "분석 실패",
        conclusion: result.conclusion || "분석 실패",
        confidence: result.confidence || 0,
      })
      setCareGuide(result.careGuide || [])
      setClinicalReport(result.clinicalReport || "")
    } else {
      alert("AI 분석에 실패했습니다. API 키를 확인해주세요.")
    }
    setIsAnalyzing(false)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar active="safety" onNavigate={onNavigate} onLogout={onLogout} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-6 py-4 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            대시보드로 돌아가기
          </button>
          <div className="flex items-center gap-2">
            {onGuardianView && (
              <button
                type="button"
                onClick={onGuardianView}
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition hover:bg-accent/80"
              >
                <Eye className="h-3.5 w-3.5" aria-hidden />
                보호자 화면 보기
              </button>
            )}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.badgeClass}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
              {meta.label} · AI 위험점수 {patient.riskScore}
            </span>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            {/* Section A: Profile & devices */}
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

                <div className="flex flex-col gap-2.5">
                  <DeviceStatusBadge
                    icon={Bell}
                    name="스마트폰 복약앱"
                    label="인증연동 완료"
                  />
                  <DeviceStatusBadge
                    icon={Watch}
                    name="웨어러블 밴드"
                    label="실시간 연결 중"
                  />
                </div>
              </div>
            </section>

            {/* Section B: Sensor widgets */}
            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Moon className="h-4 w-4 text-primary" aria-hidden />
                  <h2 className="text-sm font-bold tracking-tight text-card-foreground">
                    최근 7일 수면 시간 추이
                  </h2>
                </div>
                <SleepChart data={patient.sleep} />
                {patient.riskLevel === "urgent" && (
                  <p className="mt-4 rounded-lg bg-destructive/5 px-3 py-2 text-xs text-destructive ring-1 ring-destructive/15">
                    최근 3일간 수면 시간이 평균 3.8시간으로 급감했습니다.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" aria-hidden />
                    <h2 className="text-sm font-bold tracking-tight text-card-foreground">
                      오늘의 모바일 앱 복약 인증
                    </h2>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {doneCount}/{patient.medication.length} 완료
                  </span>
                </div>
                <ul className="flex flex-col gap-3">
                  {patient.medication.map((m) => (
                    <li
                      key={m.label}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                        m.done
                          ? "border-success/20 bg-success/5"
                          : "border-warning/30 bg-warning/10"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        {m.done ? (
                          <CheckCircle2
                            className="h-5 w-5 text-success-foreground"
                            aria-hidden
                          />
                        ) : (
                          <Circle
                            className="h-5 w-5 text-warning-foreground"
                            aria-hidden
                          />
                        )}
                        <span className="text-sm font-medium text-card-foreground">
                          {m.label}
                        </span>
                      </span>
                      <span
                        className={`text-xs font-medium ${m.done ? "text-success-foreground" : "text-warning-foreground"}`}
                      >
                        {m.time} · {m.done ? "앱 터치 완료" : "미응답(푸시 발송됨)"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section C: Voice log & AI mapping */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-tight text-card-foreground">
                <Mic className="h-4 w-4 text-primary" aria-hidden />
                현장 음성 기록 &amp; 실시간 AI 인과 매핑
              </h2>
              <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
                <div className="flex flex-col gap-3 rounded-xl bg-muted/60 p-4 ring-1 ring-border">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      돌봄종사자 현장 기록 (음성/텍스트 변환)
                    </p>
                    <Button 
                      variant={isRecording ? "destructive" : "secondary"} 
                      size="sm" 
                      onClick={toggleRecording}
                      className="h-8 gap-1.5 text-xs font-bold"
                    >
                      {isRecording ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                          </span>
                          녹음 중지
                        </>
                      ) : (
                        <>
                          <Mic className="h-3 w-3" aria-hidden />
                          녹음 시작
                        </>
                      )}
                    </Button>
                  </div>
                  <textarea
                    value={voiceInput}
                    onChange={(e) => setVoiceInput(e.target.value)}
                    className="flex-1 resize-none rounded-lg border-0 bg-background p-3 text-sm text-foreground shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary"
                    placeholder="[녹음 시작] 버튼을 누르고 어르신의 상태를 말씀해주시거나, 여기에 직접 타이핑하세요..."
                  />
                  <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
                    {isAnalyzing ? "AI 분석 중..." : "Gemini AI 분석하기"}
                  </Button>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex flex-col items-center gap-1 rounded-xl bg-primary px-4 py-3 text-primary-foreground">
                    <BrainCircuit className="h-5 w-5" aria-hidden />
                    <span className="text-xs font-semibold">Gemini 1.5</span>
                    <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" aria-hidden />
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-xl bg-accent p-4 ring-1 ring-primary/15">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground/70">
                      감지된 증상
                    </p>
                    <p className="mt-1 text-sm font-semibold text-accent-foreground">
                      {diagnosis.symptom}
                    </p>
                  </div>
                  <div className="border-t border-primary/15 pt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground/70">
                      AI 분석 결과
                    </p>
                    <p className="mt-1 text-pretty text-sm font-semibold text-accent-foreground">
                      {diagnosis.conclusion}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary/15">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-1000"
                          style={{ width: `${diagnosis.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-primary">
                        {diagnosis.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section D: AI dual report */}
            <section className="grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <ClipboardList className="h-4 w-4" aria-hidden />
                  </span>
                  <h2 className="text-sm font-bold tracking-tight text-card-foreground">
                    돌봄종사자 내일 방문 행동 지침
                  </h2>
                </div>
                <ul className="flex flex-1 flex-col gap-2.5">
                  {careGuide.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-xl bg-muted/50 px-3.5 py-3"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      <span className="text-pretty text-sm text-card-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Stethoscope className="h-4 w-4" aria-hidden />
                  </span>
                  <h2 className="text-sm font-bold tracking-tight text-card-foreground">
                    보호자 및 의료진 공유용 전문 리포트
                  </h2>
                </div>
                <p className="flex-1 text-pretty text-sm leading-relaxed text-card-foreground">
                  {clinicalReport}
                </p>
                <Button
                  size="lg"
                  onClick={() => setSent(true)}
                  disabled={sent}
                  className="mt-5 w-full rounded-xl disabled:opacity-100"
                >
                  {sent ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" aria-hidden />
                      보호자에게 전송 완료
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden />
                      카카오톡 알림장 전송하기
                    </>
                  )}
                </Button>
                {sent && (
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    보호자 및 담당 의료진에게 리포트가 발송되었습니다.
                  </p>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
