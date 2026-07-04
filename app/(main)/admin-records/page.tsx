"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ClipboardCheck, Receipt, Send, CheckCircle2, User, Loader2, Download, Share2, Mail, MessageSquare, Mic, Sparkles, AlertTriangle } from "lucide-react"
import { usePatients } from "@/components/providers/PatientProvider"
import { type Patient } from "@/lib/mockData"

const recordSchema = z.object({
  visitDate: z.string().min(1, "방문일자를 입력하세요"),
  visitType: z.string().min(1, "방문유형을 선택하세요"),
  healthStatus: z.string(),
  sttTranscript: z.string().min(1, "STT 기록이 없습니다."),
  aiSummary: z.string().min(5, "AI 요약 내용을 입력하세요"),
  actionItems: z.string().min(5, "조치/주의사항을 입력하세요"),
})

type RecordFormValues = z.infer<typeof recordSchema>

export default function AdminRecordsPage() {
  const { patients } = usePatients()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      visitDate: new Date().toISOString().slice(0, 10),
      visitType: "정기 방문",
      healthStatus: "주의 필요",
      sttTranscript: "",
      aiSummary: "",
      actionItems: "",
    }
  })

  useEffect(() => {
    const savedTranscript = localStorage.getItem("temp_transcript")
    const savedPatientId = localStorage.getItem("temp_patient_id")
    
    if (savedPatientId) {
      const p = patients.find(x => x.id === savedPatientId)
      if (p) setPatient(p)
    }
    
    if (savedTranscript) {
      // 1. STT 원본
      setValue("sttTranscript", savedTranscript)
      
      // 2. AI 요약 (가상의 AI 응답을 시뮬레이션)
      setValue("aiSummary", "어르신께서 최근 관절염 약 복용 후 어지러움과 속쓰림을 느끼고 계시며, 이로 인해 아침 약 복용을 임의로 중단하신 상태입니다. 통증은 다소 가라앉았으나 약 부작용에 대한 불안감이 높습니다.")
      
      // 3. AI 조치사항 (조심/진행해야 할 것)
      setValue("actionItems", "🚨 [주의] 임의 복약 중단 상태\n👉 [진행] 담당의 혹은 보건소 연계하여 약물 처방 재검토 요청\n👉 [진행] 어지러움으로 인한 낙상 방지를 위해 화장실 미끄럼 방지 매트 상태 점검")
    }
  }, [setValue, patients])

  const onSubmit = async (data: RecordFormValues) => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
    
    // Save generated report to local storage for patient view history
    const aiAnalysis = {
      summary: data.aiSummary,
      actionItems: data.actionItems,
      date: data.visitDate
    }
    localStorage.setItem("temp_ai_analysis", JSON.stringify(aiAnalysis))
  }

  const generatePDF = () => {
    const element = document.getElementById("report-content")
    if (element) {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `CareSignal_방문보고서_${patient?.name || '기록'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      (window as any).html2pdf().set(opt).from(element).save();
    }
  }

  const handlePdfDownload = () => {
    if (typeof window !== "undefined") {
      if (!(window as any).html2pdf) {
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        script.onload = () => { generatePDF() }
        document.body.appendChild(script)
      } else {
        generatePDF()
      }
    }
  }

  const handleKakaoShare = () => {
    alert("카카오톡 공유 API가 호출되었습니다. 담당자에게 보고서 요약본이 전송됩니다.")
  }

  const handleEmailShare = () => {
    window.location.href = `mailto:?subject=CareSignal 현장 방문 보고서 (${patient?.name || '어르신'})&body=AI가 자동으로 분석한 현장 방문 보고서가 생성되었습니다. 첨부된 PDF를 확인해주세요.`
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("보고서 링크가 복사되었습니다.")
  }

  if (isSuccess) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-card-foreground">보고서 작성 완료!</h2>
        <p className="mt-2 text-muted-foreground">
          서비스 제공 기록지가 저장되고 바우처 시스템에 성공적으로 전송되었습니다.
        </p>

        {/* 공유 및 다운로드 액션 */}
        <div className="mt-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
          <button onClick={handlePdfDownload} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition hover:bg-muted">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Download className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-card-foreground">PDF 다운로드</span>
          </button>
          
          <button onClick={handleKakaoShare} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition hover:bg-muted">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-600">
              <MessageSquare className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-card-foreground">카카오톡 공유</span>
          </button>

          <button onClick={handleEmailShare} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition hover:bg-muted">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
              <Mail className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-card-foreground">이메일 전송</span>
          </button>

          <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition hover:bg-muted">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Share2 className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-card-foreground">링크 복사</span>
          </button>
        </div>

        <button
          onClick={() => {
            // temp_transcript는 상세 뷰에서 사용될 수 있으므로 일단 남겨둡니다.
            window.location.href = '/dashboard'
          }}
          className="mt-8 rounded-xl bg-primary px-8 py-3.5 font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          대시보드로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
          AI 현장 방문 보고서 확인 및 전송
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          현장 녹음 내용을 바탕으로 AI가 요약과 조치사항을 분석했습니다. 최종 확인 후 전송해주세요.
        </p>
      </header>

      <main className="flex-1 max-w-4xl" id="report-content">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* 어르신 정보 (선택된 경우) */}
          {patient && (
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-bold text-card-foreground">{patient.name} ({patient.age}세) 어르신</p>
                <p className="text-sm text-muted-foreground">{patient.address}</p>
              </div>
            </div>
          )}

          {/* 서비스 기록 폼 */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border bg-muted/30 p-5">
              <h3 className="flex items-center gap-2 text-base font-bold text-card-foreground">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                현장 서비스 제공 기록지 (AI 자동 작성)
              </h3>
            </div>
            
            <div className="p-6 grid gap-6">
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-card-foreground">방문 일자</label>
                  <input
                    type="date"
                    {...register("visitDate")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-card-foreground">방문 유형</label>
                  <select
                    {...register("visitType")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option>정기 방문</option>
                    <option>긴급 방문</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-card-foreground">건강 상태 종합</label>
                  <select
                    {...register("healthStatus")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option>양호</option>
                    <option>보통</option>
                    <option>주의 필요</option>
                    <option>긴급 위험</option>
                  </select>
                </div>
              </div>

              {/* 1. 원본 STT 기록 */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                  <Mic className="h-4 w-4" />
                  실제 대화 원문 (STT 기록)
                </label>
                <textarea
                  {...register("sttTranscript")}
                  rows={2}
                  readOnly
                  className="w-full rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground outline-none italic"
                />
              </div>

              {/* 2. AI 상태 요약 */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" />
                  AI 분석: 현재 건강 및 심리 상태 요약
                </label>
                <textarea
                  {...register("aiSummary")}
                  rows={3}
                  className="w-full rounded-xl border-2 border-primary/20 bg-background p-4 text-sm font-medium text-card-foreground outline-none focus:border-primary"
                />
                {errors.aiSummary && <p className="text-xs text-destructive">{errors.aiSummary.message}</p>}
              </div>

              {/* 3. AI 조치사항 및 주의사항 */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  AI 권고: 조심 및 진행해야 할 Action Items
                </label>
                <textarea
                  {...register("actionItems")}
                  rows={3}
                  className="w-full rounded-xl border-2 border-destructive/20 bg-destructive/5 p-4 text-sm font-bold text-destructive/90 outline-none focus:border-destructive"
                />
                {errors.actionItems && <p className="text-xs text-destructive">{errors.actionItems.message}</p>}
              </div>

            </div>
          </div>

          {/* 바우처 전송 */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="exclude-from-pdf">
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-primary mb-1">
                <Receipt className="h-5 w-5" />
                바우처 시스템 자동 연동
              </h3>
              <p className="text-sm text-card-foreground">
                위 AI 분석 기록지를 확정하고 바우처 시스템에 서비스 제공 시간을 등록합니다.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-70 whitespace-nowrap"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  서버 전송 중...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  기록 저장 및 바우처 전송
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
