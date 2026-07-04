"use client"

import { useState } from "react"
import { Play, Pause, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Clock } from "lucide-react"

// 모의 과거 기록 데이터
const mockVisitHistory = [
  {
    id: 1,
    date: "2026-06-25",
    type: "정기 방문",
    summary: "관절염 약 부작용으로 인한 가벼운 어지러움 호소. 식사는 잘 하심.",
    transcript: "어제부터 무릎이 아파서 약을 먹었는데, 그거 먹고 나면 꼭 어질어질하네. 밥은 뭐 대충 물에 말아서 먹었어.",
    aiAnalysis: "어지러움 증상 발견 (주의). 식사량 부족 우려.",
    audioDuration: "01:24"
  },
  {
    id: 2,
    date: "2026-06-18",
    type: "긴급 방문",
    summary: "수면 부족 호소. 밤에 자꾸 깨서 피곤해 하심.",
    transcript: "밤에 자꾸 눈이 떠져서 잠을 못 자겠어. 피곤해 죽겠는데 낮잠도 안 오고 미치겠어.",
    aiAnalysis: "수면 불규칙 및 만성 피로 징후 발견 (긴급). 주간 활동량 늘리기 권장.",
    audioDuration: "02:10"
  }
]

export function VisitHistory() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [playingId, setPlayingId] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const togglePlay = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setPlayingId(playingId === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* 1. AI 비교 체크리스트 (전 방문 vs 오늘 방문) */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-primary">
          <AlertTriangle className="h-5 w-5" />
          AI 현장 방문 가이드 (과거 기록 기반)
        </h3>
        <p className="mb-4 text-sm text-card-foreground">
          이전 방문 기록을 분석하여 <strong>오늘 반드시 확인해야 할 사항</strong>을 추출했습니다.
        </p>
        
        <ul className="space-y-3">
          <li className="flex items-start gap-3 rounded-lg bg-card p-3 ring-1 ring-border">
            <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-bold text-card-foreground">어지러움 증상 완화 여부 확인</p>
              <p className="mt-1 text-xs text-muted-foreground">지난 방문(6.25) 시 관절염 약 복용 후 어지러움을 호소하셨습니다. 현재 약을 계속 드시는지, 증상은 어떤지 여쭤보세요.</p>
            </div>
          </li>
          <li className="flex items-start gap-3 rounded-lg bg-card p-3 ring-1 ring-border">
            <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-bold text-card-foreground">수면 상태 체크</p>
              <p className="mt-1 text-xs text-muted-foreground">최근 IoT 수면 센서 및 과거 기록(6.18)에서 수면 부족 패턴이 보입니다. 지난밤 얼마나 푹 주무셨는지 확인이 필요합니다.</p>
            </div>
          </li>
        </ul>
      </div>

      {/* 2. 과거 방문 및 녹음 히스토리 */}
      <div>
        <h3 className="mb-4 text-base font-bold text-card-foreground">과거 방문 및 녹음 히스토리</h3>
        <div className="space-y-3">
          {mockVisitHistory.map((visit) => (
            <div key={visit.id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              {/* 요약 헤더 (클릭 시 아코디언 확장) */}
              <button 
                onClick={() => toggleExpand(visit.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                      {visit.date}
                    </span>
                    <span className="text-xs text-muted-foreground">{visit.type}</span>
                  </div>
                  <p className="text-sm font-medium text-card-foreground line-clamp-1">
                    {visit.summary}
                  </p>
                </div>
                {expandedId === visit.id ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 ml-4" />
                )}
              </button>

              {/* 상세 내역 (아코디언 바디) */}
              {expandedId === visit.id && (
                <div className="border-t border-border bg-muted/10 p-4 space-y-4">
                  {/* 모의 오디오 플레이어 */}
                  <div className="flex items-center gap-3 rounded-full bg-card p-2 ring-1 ring-border max-w-sm">
                    <button 
                      onClick={(e) => togglePlay(visit.id, e)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {playingId === visit.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                    </button>
                    <div className="flex-1">
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        {playingId === visit.id && (
                          <div className="h-full bg-primary w-1/2 animate-pulse" />
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground mr-2">
                      {visit.audioDuration}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground mb-1">STT 원문 기록</h4>
                    <p className="text-sm text-card-foreground leading-relaxed italic bg-card p-3 rounded-lg ring-1 ring-border">
                      "{visit.transcript}"
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground mb-1">AI 분석 코멘트</h4>
                    <p className="text-sm font-medium text-destructive/90">
                      {visit.aiAnalysis}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
