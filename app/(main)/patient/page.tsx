"use client"

import React, { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PatientDetailClient } from "@/components/patient/PatientDetailClient"

function PatientPageContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  if (!id) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-card-foreground">환자 ID가 없습니다</h2>
      </div>
    )
  }

  return <PatientDetailClient id={id} />
}

export default function PatientPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12 text-muted-foreground">로딩 중...</div>}>
      <PatientPageContent />
    </Suspense>
  )
}
