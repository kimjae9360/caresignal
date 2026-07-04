"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ClipboardCheck, TriangleAlert, Loader2, Sparkles } from "lucide-react"
import { SmartMatching } from "@/components/record/SmartMatching"
import { RecordingPad } from "@/components/record/RecordingPad"
import type { Patient } from "@/lib/mockData"

export default function RecordPage() {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleRecordFinish = async (transcript: string) => {
    if (!selectedPatient) {
      alert("대상 어르신을 먼저 선택해주세요.")
      return
    }

    // AI 분석 시뮬레이션
    setIsAnalyzing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 로컬 스토리지에 결과 임시 저장
    localStorage.setItem("temp_transcript", transcript)
    localStorage.setItem("temp_patient_id", selectedPatient.id)
    
    // 분석 내용(프롬프트 결과) 모의 저장 - 어르신 상세 뷰 연동을 위함
    const mockAiSummary = {
      date: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }),
      type: "현장 방문 기록",
      summary: "어제 처방받은 관절염 약 복용 후 속쓰림 및 어지러움 호소. 자의적 복약 중단 확인.",
      stt: transcript,
      aiInsights: "관절염 약 부작용(위장장애, 어지러움) 강하게 의심. 담당의에게 즉각적인 처방 조절 및 위장약 추가 문의 필요."
    }
    localStorage.setItem("temp_ai_summary", JSON.stringify(mockAiSummary))

    router.push("/admin-records")
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-background p-6 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="absolute h-12 w-12 animate-spin text-primary" />
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-card-foreground">
          AI가 현장 대화를 분석하고 있습니다...
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          STT 텍스트를 기반으로 이상 징후를 추출하고 행정 양식을 작성 중입니다.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
          현장 방문 기록
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          현장 음성을 녹음하면 AI가 서비스 기록지와 바우처 등록 폼을 자동으로 작성합니다.
        </p>
      </header>

      <main className="flex-1 space-y-6 max-w-lg mx-auto w-full">
        {/* 1. 스마트 매칭 컴포넌트 */}
        <SmartMatching onPatientSelect={setSelectedPatient} />

        {/* 2. 어르신 정보 요약 (선택된 경우) */}
        {selectedPatient && (
          <div className="space-y-4">
            {/* 최근 방문 기록 */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-card-foreground">
                <ClipboardCheck className="h-4 w-4 text-primary" aria-hidden />
                이전 방문 요약
              </h3>
              {selectedPatient.pastVisits.length > 0 ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {selectedPatient.pastVisits[0].summary}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">최근 방문 기록이 없습니다.</p>
              )}
            </div>

            {/* AI 이상징후 요약 (위험군인 경우) */}
            {(selectedPatient.riskLevel === "urgent" || selectedPatient.riskLevel === "attention") && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-destructive">
                  <TriangleAlert className="h-4 w-4" aria-hidden />
                  오늘의 방문 체크포인트
                </h3>
                <ul className="flex flex-col gap-2">
                  {selectedPatient.careGuide.map((guide, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-destructive/90">
                      <span className="mt-0.5 font-bold">•</span>
                      <span>{guide}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 3. 녹음 패드 컴포넌트 */}
        <RecordingPad onRecordFinish={handleRecordFinish} />
      </main>
    </div>
  )
}
