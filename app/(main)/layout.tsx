import { Sidebar } from "@/components/layout/Sidebar"
import { BottomNav } from "@/components/layout/BottomNav"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* PC 사이드바 (md 이상에서 보임) */}
      <Sidebar />

      {/* 메인 콘텐츠 영역 (모바일 바텀 네비게이션 공간 확보를 위해 pb-16/pb-safe 설정) */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="mx-auto max-w-7xl h-full">
          {children}
        </div>
      </main>

      {/* 모바일 하단 네비게이션 (md 미만에서 보임) */}
      <BottomNav />
    </div>
  )
}
