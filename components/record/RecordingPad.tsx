"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, Square } from "lucide-react"

export function RecordingPad({
  onRecordFinish,
}: {
  onRecordFinish: (transcript: string) => void
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [transcript, setTranscript] = useState("")
  // SpeechRecognition 객체를 참조하기 위함
  const recognitionRef = useRef<any>(null)
  
  const mockFullTranscript = "아이고 선생님 오셨네... 내가 어제 새로 받은 관절염 약을 먹었는데, 어지럽고 속이 쓰려서 혼났어. 그래서 오늘 아침에는 무서워서 그냥 안 먹었지 뭐야."

  useEffect(() => {
    // 실제 SpeechRecognition 초기화
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.lang = "ko-KR"
        recognition.continuous = true
        recognition.interimResults = true
        
        recognition.onresult = (event: any) => {
          let currentTranscript = ""
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript
          }
          setTranscript(currentTranscript)
        }
        
        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          // 실제 마이크 에러 시 폴백 텍스트 사용
          if (event.error === 'not-allowed' || event.error === 'no-speech') {
             // fallback will handle it
          }
        }
        recognitionRef.current = recognition
      }
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      // 시간 카운터 시작
      interval = setInterval(() => setSeconds(s => s + 1), 1000)

      // 진짜 마이크가 지원되면 시작, 아니면 모의 타이핑
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
        } catch(e) {
          console.warn("Recognition already started or failed", e)
        }
      } else {
        // Fallback: 모의 타이핑 연출
        const typeInterval = setInterval(() => {
          setTranscript(prev => {
            const nextLength = prev.length + 3
            return mockFullTranscript.slice(0, nextLength)
          })
        }, 1000)
        // clean up fallback interval on stop
        ;(interval as any).typeInterval = typeInterval
      }
    } else {
      setSeconds(0)
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch(e) {}
      }
    }
    return () => {
      clearInterval(interval)
      if ((interval as any)?.typeInterval) clearInterval((interval as any).typeInterval)
    }
  }, [isRecording])

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleToggle = () => {
    if (isRecording) {
      setIsRecording(false)
      // 완료 시 현재까지 인식된 텍스트(진짜 녹음이 없으면 폴백 텍스트)를 전달
      const finalTranscript = transcript.trim().length > 0 ? transcript : mockFullTranscript
      onRecordFinish(finalTranscript)
      setTranscript("")
    } else {
      setTranscript("")
      setIsRecording(true)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card py-10 shadow-sm">
      <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
        {/* 파형 애니메이션 (녹음 중일 때만 표시) */}
        {isRecording && (
          <>
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <div className="absolute inset-2 animate-pulse rounded-full bg-primary/30" style={{ animationDuration: '1.5s' }} />
            <div className="absolute inset-4 animate-pulse rounded-full bg-primary/40" style={{ animationDuration: '1s' }} />
          </>
        )}
        <button
          type="button"
          onClick={handleToggle}
          className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${
            isRecording ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
          }`}
        >
          {isRecording ? (
            <Square className="h-8 w-8 fill-current" aria-hidden />
          ) : (
            <Mic className="h-10 w-10" aria-hidden />
          )}
        </button>
      </div>

      <div className="text-center">
        <p className="text-3xl font-mono font-bold tracking-widest text-card-foreground">
          {formatTime(seconds)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {isRecording ? "녹음 중... (버튼을 다시 눌러 종료)" : "마이크 버튼을 눌러 음성 기록을 시작하세요"}
        </p>
      </div>

      {/* STT 실시간 텍스트 표시 영역 */}
      <div className={`mt-8 w-full max-w-md overflow-hidden rounded-2xl bg-muted/30 transition-all duration-500 ${isRecording || transcript ? "p-4 opacity-100 ring-1 ring-border" : "h-0 opacity-0"}`}>
        <p className="mb-2 text-xs font-bold text-primary">실시간 음성 인식 (STT)</p>
        <p className="text-sm leading-relaxed text-card-foreground min-h-[60px]">
          {transcript}
          {isRecording && <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-primary align-middle" />}
        </p>
      </div>
    </div>
  )
}
