"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, User, MapPin, Clock, TriangleAlert, Share2, Headphones, StopCircle, Download, Loader2 } from "lucide-react"
import { usePatients } from "@/components/providers/PatientProvider"
import { IoTCharts } from "@/components/patient/IoTCharts"
import { AnomalyAlerts } from "@/components/patient/AnomalyAlerts"
import { SafeContact } from "@/components/patient/SafeContact"
import { AiRecordView } from "@/components/patient/AiRecordView"
import { VisitHistory } from "@/components/patient/VisitHistory"
import { WeeklyAiChart } from "@/components/patient/WeeklyAiChart"

export function PatientDetailClient({ id }: { id: string }) {
  const { patients } = usePatients()
  const patient = patients.find((p) => p.id === id)

  if (!patient) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-card-foreground">환자를 찾을 수 없습니다</h2>
        <Link href="/dashboard" className="mt-4 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground">
          대시보드로 돌아가기
        </Link>
      </div>
    )
  }

  const [isExporting, setIsExporting] = useState(false)
  const reportRef = useRef<HTMLElement>(null)

  const handleShareReport = async () => {
    if (!reportRef.current) return
    
    setIsExporting(true)
    try {
      const { toPng } = await import("html-to-image")
      const jsPDF = (await import("jspdf")).default

      const element = reportRef.current
      
      // html-to-image를 사용하여 렌더링 에러(lab color 등) 방지
      const imgData = await toPng(element, {
        quality: 1.0,
        backgroundColor: "#ffffff",
        pixelRatio: 2
      })
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      })

      const elementWidth = element.offsetWidth
      const elementHeight = element.offsetHeight
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (elementHeight * pdfWidth) / elementWidth

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`케어시그널_${patient.name}_리포트.pdf`)
      
    } catch (error) {
      console.error("PDF 생성 실패:", error)
      alert("PDF 생성 중 오류가 발생했습니다.")
    } finally {
      setIsExporting(false)
    }
  }

  // TTS (AI 음성 브리핑) 로직
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 음성 멈춤
      window.speechSynthesis.cancel()
    }
  }, [])

  const toggleTTS = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    const textToSpeak = `
      현재 ${patient.name} 어르신의 브리핑입니다.
      위험도는 ${patient.riskLevel === 'urgent' ? '긴급' : patient.riskLevel === 'attention' ? '주의' : '안정'} 단계이며, 점수는 ${patient.riskScore}점입니다.
      최근 분석 요약: ${patient.alertSummary}.
      ${patient.medications.filter(m => m.isNew).length > 0 ? "최근 신규 추가된 약물이 있습니다. 복약 지도를 확인해주세요." : ""}
      안전한 현장 방문 되시길 바랍니다.
    `
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = "ko-KR"
    utterance.rate = 1.1 // 조금 빠른 속도
    utterance.onend = () => setIsPlaying(false)
    
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  return (
    <div className="flex flex-col min-h-full bg-background pb-8">
      {/* 헤더 */}
      <header className="sticky top-0 z-20 border-b border-border bg-card/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            대시보드로 돌아가기
          </Link>
          <div className="flex gap-2">
            <button 
              onClick={handleShareReport} 
              disabled={isExporting}
              className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/20 transition disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  PDF 생성중...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  보고서 PDF 다운로드
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main ref={reportRef} className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full bg-background">
        
        {/* 강력한 위험 경고 알림 UI */}
        {patient.riskLevel === "urgent" && (
          <div className="animate-in slide-in-from-top-4 fade-in duration-500 rounded-2xl bg-destructive border-l-8 border-destructive/80 p-5 shadow-lg flex items-start gap-4">
            <TriangleAlert className="h-8 w-8 text-destructive-foreground mt-1" />
            <div>
              <h2 className="text-lg font-bold text-destructive-foreground">긴급: 즉각적인 현장 방문 및 조치 요망</h2>
              <p className="mt-1 text-sm font-medium text-destructive-foreground/90">
                AI 분석 및 IoT 센서 데이터 기반 긴급 경보가 발령되었습니다. {patient.alertSummary}
              </p>
            </div>
          </div>
        )}

        {/* 상단 프로필 및 연락처 */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="col-span-1 rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <User className="h-8 w-8" aria-hidden />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
                    {patient.name}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    patient.riskLevel === 'urgent' ? 'bg-destructive/10 text-destructive' :
                    patient.riskLevel === 'attention' ? 'bg-warning/10 text-warning-foreground' : 'bg-success/10 text-success'
                  }`}>
                    점수 {patient.riskScore}점
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {patient.age}세 · {patient.gender}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="truncate">{patient.address}</span>
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {patient.medications.map((m) => (
                    <span
                      key={m.label}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                        m.isNew
                          ? "bg-destructive/10 text-destructive ring-1 ring-destructive/20"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {m.label} {m.isNew && "(신규)"}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <SafeContact contact={patient.caregiver} />
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* 중단: 이상 징후 분석 */}
          <section>
            <h2 className="mb-4 text-lg font-bold tracking-tight text-card-foreground">
              최근 감지된 이상 징후
            </h2>
            <AnomalyAlerts anomalies={patient.anomalies} />
          </section>

          {/* 신규 기능: 요일별 AI 분석 차트 */}
          <section>
            <h2 className="mb-4 text-lg font-bold tracking-tight text-card-foreground">
              요일별 AI 위험도 트렌드
            </h2>
            <WeeklyAiChart riskLevel={patient.riskLevel} />
          </section>
        </div>

        {/* 하단: IoT 기록지 (수면, 심박수, 스마트약통) */}
        <section>
          <h2 className="mb-4 text-lg font-bold tracking-tight text-card-foreground">
            실시간 IoT 건강 모니터링 (웨어러블 & 약통)
          </h2>
          <IoTCharts logs={patient.iotLogs} />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold tracking-tight text-card-foreground">
            히스토리 및 방문 대조 (AI 체크리스트)
          </h2>
          <VisitHistory />
        </section>

        {/* 처방 기록 타임라인 */}
        <section>
          <h2 className="mb-4 text-lg font-bold tracking-tight text-card-foreground">
            최근 방문 및 처방 타임라인
          </h2>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="relative ml-4 space-y-0 border-l-2 border-border pl-6">
              {/* 모의 연동된 AI 기록지 뷰 */}
              <AiRecordView patientId={patient.id} />

              {patient.prescriptions.length === 0 ? (
                <p className="text-sm text-muted-foreground pb-6">최근 처방 기록이 없습니다.</p>
              ) : (
                patient.prescriptions.map((rx, i) => (
                  <div key={rx.id} className="relative pb-6 last:pb-0">
                    <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-card">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <div className="rounded-xl bg-muted/50 p-4 ring-1 ring-border">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">{rx.date}</span>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                          {rx.hospital}
                        </span>
                      </div>
                      <p className="text-base font-bold text-card-foreground">{rx.drug}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        복용법: {rx.dosage} · 담당의: {rx.doctor}
                      </p>
                      {rx.nextVisit && (
                        <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <Clock className="h-3.5 w-3.5" aria-hidden />
                          다음 내원 예정: {rx.nextVisit}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* AI 음성 브리핑 플로팅 버튼 (모바일/태블릿 친화적) */}
      <button
        onClick={toggleTTS}
        className={`fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl ring-4 transition-transform hover:scale-105 sm:bottom-8 sm:right-8 ${
          isPlaying 
            ? "bg-destructive text-destructive-foreground ring-destructive/30 animate-pulse" 
            : "bg-primary text-primary-foreground ring-primary/30"
        }`}
      >
        {isPlaying ? <StopCircle className="h-6 w-6" /> : <Headphones className="h-6 w-6" />}
      </button>
    </div>
  )
}
