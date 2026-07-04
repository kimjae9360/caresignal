"use client"

import { useEffect, useState } from "react"
import { Sparkles, FileText, Activity } from "lucide-react"

export function AiRecordView({ patientId }: { patientId: string }) {
  const [record, setRecord] = useState<any>(null)

  useEffect(() => {
    const savedId = localStorage.getItem("temp_patient_id")
    if (savedId === patientId) {
      const savedSummary = localStorage.getItem("temp_ai_summary")
      if (savedSummary) {
        setRecord(JSON.parse(savedSummary))
      }
    }
  }, [patientId])

  if (!record) return null

  return (
    <div className="relative pb-6 mb-6">
      <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-primary/20">
        <Sparkles className="h-2 w-2 text-primary" />
      </span>
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
            {record.type} (AI 자동 분석 완료)
          </span>
          <span className="text-xs font-semibold text-muted-foreground">{record.date}</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="flex items-center gap-1.5 text-sm font-bold text-card-foreground">
              <FileText className="h-4 w-4 text-primary" />
              요약 결과
            </h4>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              {record.summary}
            </p>
          </div>
          
          <div className="rounded-lg bg-card p-4 ring-1 ring-border">
            <h4 className="flex items-center gap-1.5 text-sm font-bold text-destructive">
              <Activity className="h-4 w-4" />
              AI 위험도 분석 인사이트
            </h4>
            <p className="mt-1.5 text-sm text-destructive/90 leading-relaxed font-medium">
              {record.aiInsights}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-muted-foreground mb-1">원본 STT 텍스트</h4>
            <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg italic">
              "{record.stt}"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
