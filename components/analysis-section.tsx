"use client"

import { FileText, Printer, FolderOpen, Code, Settings, Server, Shield, BrainCircuit, Activity, Cpu } from "lucide-react"

export function AnalysisSection() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 print-container">
      {/* Header and Print Button */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-5 no-print">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-card-foreground">
            CareSignal 아키텍처 및 시스템 분석
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            웹서비스 디렉토리 구조, 핵심 컴포넌트, 데이터 흐름 및 기술 확장성 분석
          </p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/95 pointer-events-auto cursor-pointer"
        >
          <Printer className="h-4 w-4" aria-hidden />
          PDF 다운로드 / 인쇄
        </button>
      </div>

      {/* Printable Heading (Only visible in Print or top of report) */}
      <div className="hidden print:block border-b-2 border-black pb-4 mb-6">
        <h1 className="text-3xl font-bold text-black font-sans">케어시그널 (CareSignal) 시스템 구조 분석 보고서</h1>
        <p className="text-sm text-gray-500 mt-2">출처: CareSignal AI 돌봄 트리아지 플랫폼 개발팀</p>
      </div>

      {/* 1. 프로젝트 개요 */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Activity className="h-5 w-5" />
          <h3 className="text-lg font-bold text-card-foreground">1. 프로젝트 개요 (Overview)</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>케어시그널 (CareSignal)</strong>은 어르신의 스마트 기기(웨어러블 밴드, 스마트 약통) 센서 데이터와 사회복지사의 현장 방문 음성 기록을 AI가 통합 분석하는 플랫폼입니다. 복지사에게 위험도가 높은 어르신을 순서대로 추천하고(우선순위 트리아지), 대응 행동 지침 및 보호자/의료진 공유용 전문 소견서를 자동으로 생성하여 돌봄 공백을 예방합니다.
        </p>
        <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
          <div className="rounded-xl bg-muted/50 p-3">
            <span className="text-xs text-muted-foreground block">프레임워크</span>
            <span className="text-sm font-bold text-card-foreground">Next.js 16.2 (App Router)</span>
          </div>
          <div className="rounded-xl bg-muted/50 p-3">
            <span className="text-xs text-muted-foreground block font-medium">개발 언어</span>
            <span className="text-sm font-bold text-card-foreground">TypeScript 5.7</span>
          </div>
          <div className="rounded-xl bg-muted/50 p-3">
            <span className="text-xs text-muted-foreground block">스타일링</span>
            <span className="text-sm font-bold text-card-foreground">Tailwind CSS 4.0</span>
          </div>
          <div className="rounded-xl bg-muted/50 p-3">
            <span className="text-xs text-muted-foreground block">핵심 라이브러리</span>
            <span className="text-sm font-bold text-card-foreground">shadcn/ui & Lucide</span>
          </div>
        </div>
      </section>

      {/* 2. 전체 디렉토리 및 파일 구조 */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <FolderOpen className="h-5 w-5" />
          <h3 className="text-lg font-bold text-card-foreground">2. 디렉토리 및 파일 구조 (A to Z)</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          프로젝트의 물리적 구조와 컴포넌트 간 위계 관계는 다음과 같이 체계적으로 구성되어 있습니다.
        </p>
        <pre className="rounded-xl bg-muted p-4 text-xs font-mono text-card-foreground overflow-x-auto leading-relaxed border border-border whitespace-pre-wrap break-all">
{`c:\\caresignal
├── app/                        # Next.js App Router 페이지 및 전역 스타일
│   ├── globals.css             # Tailwind CSS 및 커스텀 출력(Print) 스타일 정의
│   ├── layout.tsx              # 최상위 루트 레이아웃 (HTML 뼈대, 웹 폰트, 메타데이터)
│   └── page.tsx                # 엔트리 포인트 (인증/대시보드/상세 페이지 라우팅 분기)
├── components/                 # 화면 렌더링에 사용되는 독립 컴포넌트
│   ├── app-sidebar.tsx         # 사이드바 네비게이션 및 모바일 하단 네비게이션
│   ├── auth-screen.tsx         # 사회복지사 로그인 및 데모 로그인 우회 화면
│   ├── dashboard.tsx           # 종합 대시보드 (트리아지 목록, 센서 상태, 음성로그 탭 전환)
│   ├── patient-detail.tsx      # 수면 차트, 복약 달력, AI 인과 매핑, 행동 가이드 상세화면
│   ├── analysis-section.tsx    # [신규] 시스템 A to Z 분석 보고서 및 PDF 인쇄 컴포넌트
│   └── ui/                     # 공통 UI 컴포넌트 (shadcn/ui 기반 단추 등)
├── lib/                        # 비즈니스 데이터 및 공통 유틸리티
│   ├── data.ts                 # 30명의 어르신 목(Mock) 데이터 및 위험 수준 정의
│   ├── supabase.ts             # 데이터베이스 및 사용자 인증 세션 연동용 Supabase 클라이언트
│   ├── ai.ts                   # Gemini API 호출 및 프롬프트 제어 유틸리티
│   └── utils.ts                # Tailwind 클래스 병합 유틸리티 함수 (cn)
├── scripts/                    # 관리 및 자동화 스크립트 폴더
│   └── generate_pdf.js         # [신규] Edge 헤드리스 모드 활용 로컬 PDF 자동 생성기
├── package.json                # 의존성 라이브러리 및 프로젝트 빌드 스크립트
├── next.config.mjs             # Next.js 프레임워크 동작 환경 설정
└── tsconfig.json               # TypeScript 컴파일러 구성 옵션`}
        </pre>
      </section>

      {/* 3. 핵심 파일별 기능 설명 */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Code className="h-5 w-5" />
          <h3 className="text-lg font-bold text-card-foreground">3. 핵심 파일별 기능 설명 (Key Components)</h3>
        </div>
        <div className="space-y-3.5">
          <div className="border-l-4 border-primary pl-4 py-1 space-y-1">
            <h4 className="text-sm font-bold text-card-foreground font-sans">page.tsx (컨트롤러 역할)</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              사용자의 상태에 따라 대화면 뷰(<code className="font-mono bg-muted px-1 text-[11px] rounded">auth</code>: 로그인 화면, <code className="font-mono bg-muted px-1 text-[11px] rounded">dashboard</code>: 메인 대시보드, <code className="font-mono bg-muted px-1 text-[11px] rounded">detail</code>: 어르신 분석 상세 화면)를 전환하고 사이드바 탭의 리액트 상태(<code className="font-mono bg-muted px-1 text-[11px] rounded">useState</code>)를 라우팅 역할로 중재합니다.
            </p>
          </div>
          <div className="border-l-4 border-primary pl-4 py-1 space-y-1">
            <h4 className="text-sm font-bold text-card-foreground font-sans">dashboard.tsx (메인 대시보드 화면)</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              수치 요약 카드와 위험도 기준 내림차순 정렬된 <strong>우선순위 트리아지 목록</strong>을 렌더링합니다. 사이드바 메뉴 전환에 따라 실시간 센서 결선 상태 탭, 어르신 댁 방문 시 녹음한 음성기록 목록 탭, 시스템 모니터링 알림 설정 탭을 스위칭하여 렌더링합니다.
            </p>
          </div>
          <div className="border-l-4 border-primary pl-4 py-1 space-y-1">
            <h4 className="text-sm font-bold text-card-foreground font-sans">patient-detail.tsx (개별 어르신 정밀 분석)</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              최근 7일간의 수면 부족 추이 차트, 스마트 약통과 연동되는 일일 복약 타임라인(아침/점심/저녁 복약 완료 여부), 복지사의 방문 녹취를 텍스트화한 로그 및 Gemini가 분석한 질환 위험 인과 매핑 카드, 보호자 전송용 자동 리포트 등 핵심 비즈니스 로직을 집약한 화면입니다.
            </p>
          </div>
          <div className="border-l-4 border-primary pl-4 py-1 space-y-1">
            <h4 className="text-sm font-bold text-card-foreground font-sans">data.ts (데이터 모델 및 가상 데이터)</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <code className="font-mono bg-muted px-1 text-[11px] rounded">Patient</code>, <code className="font-mono bg-muted px-1 text-[11px] rounded">RiskLevel</code> 등의 타입 정의와 김순자 어르신(긴급/88점), 이영수 어르신(주의/64점), 박말순 어르신(안정/22점) 및 심사위원 데모를 위해 무작위 생성되는 27명의 추가 어르신을 포함한 총 30명의 데이터를 담고 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 4. 서비스 고도화 아키텍처 제안 */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6 page-break">
        <div className="flex items-center gap-2 text-primary">
          <Server className="h-5 w-5" />
          <h3 className="text-lg font-bold text-card-foreground">4. 고도화 아키텍처 제안 (Architecture Roadmap)</h3>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* 가상 연동 1 */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Shield className="h-4.5 w-4.5" />
              <h4 className="text-sm font-bold text-card-foreground font-sans">1) Supabase 기반 실시간 백엔드</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              현재의 하드코딩된 <code className="font-mono text-[11px]">data.ts</code> 구조에서 탈피하여 PostgreSQL DB를 탑재한 Supabase Auth 및 Database를 구축합니다. 이를 통해 복지사의 회원가입/인증을 처리하고, 스마트 기기 로그를 실시간 웹소켓(<code className="font-mono text-[11px]">Realtime Subscription</code>)으로 구독하여 화면 새로고침 없이 대시보드 상태를 동기화합니다.
            </p>
          </div>

          {/* 가상 연동 2 */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <BrainCircuit className="h-4.5 w-4.5" />
              <h4 className="text-sm font-bold text-card-foreground font-sans">2) Gemini AI & STT 분석 파이프라인</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              복지사가 마이크로 현장 요약 음성을 녹음하면, OpenAI Whisper STT API를 통과해 텍스트화된 후 Gemini 1.5 Flash 모델의 구조화된 출력(Structured JSON Output)을 통해 <code className="font-mono text-[11px]">감지된 증상</code>, <code className="font-mono text-[11px]">의심 원인</code>, <code className="font-mono text-[11px]">실천 지침</code>, <code className="font-mono text-[11px]">의료보고서</code> 형태로 자동 변환 및 데이터베이스에 적재됩니다.
            </p>
          </div>

          {/* 가상 연동 3 */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Cpu className="h-4.5 w-4.5" />
              <h4 className="text-sm font-bold text-card-foreground font-sans">3) 하드웨어 스마트 약통 설계</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ESP32 마이크로컨트롤러 칩셋과 자석/리밋 센서를 내장한 스마트 약통 하드웨어를 제작합니다. 어르신이 뚜껑을 개폐하면 Wi-Fi를 통해 백엔드 API에 HTTP POST 이벤트를 송신하고, 해당 로그가 저장됨과 동시에 대시보드 내 어르신의 복약 여부 상태를 자동으로 확인 처리합니다.
            </p>
          </div>

          {/* 가상 연동 4 */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Settings className="h-4.5 w-4.5" />
              <h4 className="text-sm font-bold text-card-foreground font-sans">4) 모바일 앱 패키징 (Capacitor)</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Next.js로 구현된 프론트엔드를 <code className="font-mono text-[11px]">npm run build</code> 명령어로 정적 내보내기(<code className="font-mono text-[11px]">output: 'export'</code>) 한 뒤, Capacitor CLI를 통해 네이티브 안드로이드 스튜디오 프로젝트와 동기화하여 단기간 내에 하이브리드 앱으로 빌드하고 구글 헬스 커넥트 등 디바이스 권한에 접근할 수 있도록 포장합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Footer (Report Sign-off) */}
      <div className="border-t border-border pt-5 text-center text-xs text-muted-foreground no-print">
        본 시스템 분석 문서는 브라우저 인쇄를 통해 PDF 파일로 영구 저장하거나 공유할 수 있습니다.
      </div>
    </div>
  )
}
