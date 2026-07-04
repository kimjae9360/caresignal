"use client"

import { useState } from "react"
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Receipt,
  Save,
  Send,
  TriangleAlert,
  Users,
} from "lucide-react"
import { AppSidebar, MobileNav, type Section } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { patients, riskMeta } from "@/lib/data"

type RecordTab = "service" | "voucher" | "report"

const tabs: { id: RecordTab; label: string; icon: typeof FileText }[] = [
  { id: "service", label: "서비스 제공 기록지", icon: ClipboardList },
  { id: "voucher", label: "바우처 시스템 등록", icon: Receipt },
  { id: "report", label: "관리자 보고서", icon: FileText },
]

/* ──────────────────────────────────────────────
   Tab 1: 서비스 제공 기록지
   ────────────────────────────────────────────── */
function ServiceRecordForm() {
  const [saved, setSaved] = useState(false)
  const today = new Date().toISOString().slice(0, 10)

  return (
    <section className="max-w-3xl space-y-6">
      {/* 방문 정보 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-card-foreground">
          <Clock className="h-5 w-5 text-primary" aria-hidden />
          방문 기본 정보
        </h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">방문 일시</span>
            <input
              type="date"
              defaultValue={today}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">방문 유형</span>
            <select className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary">
              <option>정기 방문</option>
              <option>긴급 방문</option>
              <option>전화 안부</option>
              <option>화상 상담</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">대상 어르신</span>
            <select className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary">
              {patients.slice(0, 3).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.age}세)
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">방문 시간</span>
            <div className="flex gap-2">
              <input
                type="time"
                defaultValue="10:00"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary"
              />
              <span className="flex items-center text-sm text-muted-foreground">~</span>
              <input
                type="time"
                defaultValue="11:00"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary"
              />
            </div>
          </label>
        </div>
      </div>

      {/* 대상자 상태 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-5 text-base font-bold text-card-foreground">대상자 상태 관찰</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">건강 상태</span>
            <select className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary">
              <option>양호</option>
              <option>보통</option>
              <option>주의 필요</option>
              <option>위험</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">식사 상태</span>
            <select className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary">
              <option>정상 섭취</option>
              <option>소량 섭취</option>
              <option>거의 못 드심</option>
              <option>확인 불가</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">위생 상태</span>
            <select className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary">
              <option>양호</option>
              <option>보통</option>
              <option>개선 필요</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">정서 상태</span>
            <select className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary">
              <option>안정적</option>
              <option>다소 우울</option>
              <option>불안/초조</option>
              <option>무기력</option>
            </select>
          </label>
        </div>
      </div>

      {/* 서비스 내용 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-5 text-base font-bold text-card-foreground">서비스 제공 내용</h3>
        <div className="space-y-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">수행한 서비스 (복수 선택)</span>
            <div className="flex flex-wrap gap-2">
              {[
                "복약 확인 및 관리",
                "신체 기능 유지 지원",
                "건강 상태 관찰",
                "정서 지원 및 말벗",
                "생활 환경 점검",
                "이동 보조 지원",
                "가사 활동 지원",
                "의료기관 연계",
              ].map((s) => (
                <label
                  key={s}
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-muted/50 px-3.5 py-2.5 text-sm font-medium text-card-foreground transition hover:bg-accent"
                >
                  <input type="checkbox" className="h-4 w-4 rounded accent-primary" />
                  {s}
                </label>
              ))}
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">상세 서비스 기록 (음성 변환 또는 직접 입력)</span>
            <textarea
              rows={4}
              placeholder="방문 시 관찰한 내용과 수행한 서비스를 상세히 기록해주세요…"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">특이사항 / 추가 요청사항</span>
            <textarea
              rows={2}
              placeholder="향후 주의가 필요한 사항이나 센터에 요청할 내용을 기록해주세요…"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary"
            />
          </label>
        </div>
      </div>

      {/* 저장 */}
      <div className="flex items-center gap-3">
        <Button size="lg" onClick={() => setSaved(true)} className="rounded-xl px-8">
          <Save className="h-4 w-4" aria-hidden />
          기록 저장하기
        </Button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success-foreground">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            저장되었습니다
          </span>
        )}
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   Tab 2: 바우처 시스템 등록
   ────────────────────────────────────────────── */
function VoucherForm() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="max-w-3xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-card-foreground">
          <Receipt className="h-5 w-5 text-primary" aria-hidden />
          사회서비스 전자바우처 등록
        </h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">대상 어르신</span>
            <select className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary">
              {patients.slice(0, 3).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.age}세)
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">바우처 유형</span>
            <select className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary">
              <option>노인돌봄 종합서비스</option>
              <option>노인맞춤돌봄서비스</option>
              <option>장기요양 방문요양</option>
              <option>장기요양 방문간호</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">서비스 코드</span>
            <input
              type="text"
              defaultValue="SC-2026-0703"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">서비스 시간 (분)</span>
            <input
              type="number"
              defaultValue={60}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">서비스 일자</span>
            <input
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground ring-1 ring-transparent focus:ring-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-card-foreground">제공 기관</span>
            <input
              type="text"
              defaultValue="노원구 통합돌봄센터"
              readOnly
              className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
            />
          </label>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button size="lg" onClick={() => setSubmitted(true)} disabled={submitted} className="rounded-xl px-8 disabled:opacity-100">
            {submitted ? (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                전송 완료
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden />
                바우처 시스템에 전송
              </>
            )}
          </Button>
          {submitted && (
            <span className="text-sm text-muted-foreground">
              사회서비스 전자바우처 시스템에 정상 등록되었습니다.
            </span>
          )}
        </div>
      </div>

      {/* 최근 전송 이력 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-base font-bold text-card-foreground">최근 전송 이력</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5">일자</th>
                <th className="px-4 py-2.5">대상자</th>
                <th className="px-4 py-2.5">바우처 유형</th>
                <th className="px-4 py-2.5">시간</th>
                <th className="px-4 py-2.5">상태</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: "2026-07-02", name: "김순자 어르신", type: "노인돌봄 종합", hours: "60분", status: "완료" },
                { date: "2026-07-02", name: "이영수 어르신", type: "노인돌봄 종합", hours: "45분", status: "완료" },
                { date: "2026-07-01", name: "박말순 어르신", type: "노인맞춤돌봄", hours: "30분", status: "완료" },
              ].map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0 transition hover:bg-muted/50">
                  <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                  <td className="px-4 py-3 font-semibold text-card-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-card-foreground">{r.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.hours}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success-foreground ring-1 ring-success/20">
                      <CheckCircle2 className="h-3 w-3" aria-hidden />
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   Tab 3: 관리자 보고서
   ────────────────────────────────────────────── */
function ManagerReport() {
  const urgentCount = patients.filter((p) => p.riskLevel === "urgent").length
  const attentionCount = patients.filter((p) => p.riskLevel === "attention").length
  const stableCount = patients.filter((p) => p.riskLevel === "stable").length

  return (
    <section className="max-w-3xl space-y-6">
      {/* 요약 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "총 관리 어르신", value: 30, unit: "명", accent: "text-foreground", bg: "bg-secondary text-secondary-foreground" },
          { label: "이번 주 방문", value: 18, unit: "건", accent: "text-primary", bg: "bg-primary/10 text-primary" },
          { label: "긴급 케이스", value: urgentCount, unit: "건", accent: "text-destructive", bg: "bg-destructive/10 text-destructive" },
          { label: "바우처 전송", value: 42, unit: "건", accent: "text-success-foreground", bg: "bg-success/10 text-success-foreground" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${c.bg}`}>
              <Users className="h-5 w-5" aria-hidden />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{c.label}</p>
            <p className={`mt-1 text-2xl font-bold tracking-tight ${c.accent}`}>
              {c.value}
              <span className="ml-1 text-base font-medium text-muted-foreground">{c.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* 주간 활동 요약 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-5 text-base font-bold text-card-foreground">주간 활동 요약 보고서</h3>
        <div className="space-y-4 text-sm text-card-foreground leading-relaxed">
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="font-semibold text-card-foreground">📋 보고 기간: 2026년 6월 30일 ~ 7월 3일</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-xl bg-destructive/5 p-4 ring-1 ring-destructive/15">
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden />
              <div>
                <p className="font-bold text-destructive">긴급 사례 보고</p>
                <p className="mt-1 text-muted-foreground">
                  김순자 어르신(82세) — 신규 관절염약(셀레콕시브) 복용 후 기립성 어지러움 및 3일 연속 수면 3시간대 급감.
                  다제약물 상호작용 의심으로 담당의 재진 연계 예정 (7/10).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-warning/10 p-4 ring-1 ring-warning/20">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-warning-foreground" aria-hidden />
              <div>
                <p className="font-bold text-warning-foreground">주의 관찰 사례</p>
                <p className="mt-1 text-muted-foreground">
                  이영수 어르신(75세) — 복약 앱 인증 지속 지연(평균 2.1시간), 활동량 47% 감소.
                  우울감 선별 문진 예정.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-success/5 p-4 ring-1 ring-success/15">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success-foreground" aria-hidden />
              <div>
                <p className="font-bold text-success-foreground">안정 관리 현황</p>
                <p className="mt-1 text-muted-foreground">
                  {stableCount}명의 어르신이 복약·수면·활동량 모두 정상 범위를 유지하고 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="rounded-xl">
            <Send className="h-4 w-4" aria-hidden />
            센터장에게 보고서 전송
          </Button>
          <Button variant="outline" className="rounded-xl">
            <FileText className="h-4 w-4" aria-hidden />
            PDF 내보내기
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────── */
export function CaregiverRecord({
  onNavigate,
  onLogout,
}: {
  onNavigate: (section: Section) => void
  onLogout: () => void
}) {
  const [activeTab, setActiveTab] = useState<RecordTab>("service")

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar active="records" onNavigate={onNavigate} onLogout={onLogout} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-4 border-b border-border bg-card px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="text-sm text-muted-foreground">{today}</p>
            <h1 className="text-pretty text-xl font-bold tracking-tight text-card-foreground">
              종사자 기록 관리
            </h1>
          </div>
        </header>

        <MobileNav active="records" onNavigate={onNavigate} />

        {/* Tab switcher */}
        <div className="border-b border-border bg-card px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  activeTab === id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 px-6 py-6 lg:px-8">
          {activeTab === "service" && <ServiceRecordForm />}
          {activeTab === "voucher" && <VoucherForm />}
          {activeTab === "report" && <ManagerReport />}
        </main>
      </div>
    </div>
  )
}
