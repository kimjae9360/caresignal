"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Activity,
  HeartPulse,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Waves,
  Loader2
} from "lucide-react"

// Zod schema for form validation
const loginSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  password: z.string().min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "kim.jaewon@caresignal.kr",
      password: "demo1234",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)
    // 리다이렉트
    router.push("/dashboard")
  }

  const handleDemoLogin = () => {
    router.push("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      {/* Left hero */}
      <section className="relative flex flex-1 flex-col justify-between overflow-hidden bg-primary px-8 py-12 text-primary-foreground lg:px-14 lg:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <HeartPulse className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-lg font-semibold tracking-tight">CareSignal</span>
        </div>

        <div className="relative max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-sm ring-1 ring-white/20">
            <Sparkles className="h-4 w-4" aria-hidden />
            AI 돌봄 어시스턴트
          </div>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            케어시그널 <span className="text-white/80">(CareSignal)</span>
          </h1>
          <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-white/85">
            음성과 데이터로 어르신의 안전을 가장 먼저 캐치합니다. 흩어진 신호를
            모아 가장 먼저 살펴야 할 분을 알려드립니다.
          </p>

          <ul className="mt-10 flex flex-col gap-4">
            {[
              { icon: Activity, text: "웨어러블·스마트 약통 실시간 연동" },
              { icon: Waves, text: "현장 음성 기록 AI 자동 분석" },
              { icon: ShieldCheck, text: "다제약물 위험 우선순위 트리아지" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/90">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 ring-1 ring-white/20">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-base">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/60">
          © 2026 CareSignal. 사회복지사를 위한 AI 돌봄 트리아지 플랫폼.
        </p>
      </section>

      {/* Right form */}
      <section className="flex flex-1 items-center justify-center bg-background px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-card-foreground">
                {mode === "login" ? "사회복지사 로그인" : "회원가입"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode === "login"
                  ? "담당 어르신의 안전 신호를 확인하세요."
                  : "기관 정보로 새 계정을 등록하세요."}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-card-foreground"
                >
                  이메일 / 직원 ID
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    autoComplete="username"
                    placeholder="이메일 입력"
                    className={`w-full rounded-xl border ${errors.email ? 'border-destructive' : 'border-input'} bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-card-foreground"
                >
                  비밀번호
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <input
                    {...register("password")}
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="비밀번호 입력"
                    className={`w-full rounded-xl border ${errors.password ? 'border-destructive' : 'border-input'} bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30`}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
                )}
              </div>

              <button 
                type="submit" 
                className="mt-1 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-70" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    처리중...
                  </>
                ) : (
                  mode === "login" ? "사회복지사 로그인" : "회원가입 완료"
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">또는</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-accent px-4 py-3 text-sm font-bold text-accent-foreground transition hover:bg-accent/70"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              해커톤 데모 로그인
            </button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? "아직 계정이 없으신가요? " : "이미 계정이 있으신가요? "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                {mode === "login" ? "회원가입" : "로그인"}
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
