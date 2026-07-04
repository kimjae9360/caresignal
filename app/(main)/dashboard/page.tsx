import { TriageBoard } from "@/components/dashboard/TriageBoard"

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  return (
    <div className="flex flex-col h-full bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <p className="text-sm font-medium text-muted-foreground">{today}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-card-foreground">
          김재원 복지사님, 오늘 가장 먼저 확인해야 할 대상자입니다.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          AI 분석 및 센서 기반 위험도 점수에 따라 우선 관리 대상자가 자동 정렬되었습니다.
        </p>
      </header>

      <main className="flex-1">
        <TriageBoard />
      </main>
    </div>
  )
}
