"use client"

import { Phone, ShieldCheck } from "lucide-react"
import type { ContactInfo } from "@/lib/mockData"

export function SafeContact({ contact, title = "담당 종사자 연락처" }: { contact: ContactInfo, title?: string }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-bold text-primary">
        <ShieldCheck className="h-5 w-5" aria-hidden />
        {title}
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-base font-bold text-card-foreground">
          {contact.name} <span className="font-normal text-muted-foreground">({contact.role})</span>
        </p>
        {contact.organization && (
          <p className="text-sm text-muted-foreground">{contact.organization}</p>
        )}
        
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-card p-3 shadow-sm ring-1 ring-border transition hover:ring-primary/50 cursor-pointer">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Phone className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold text-primary">일회용 안심번호 (24시간 유효)</p>
            <p className="text-lg font-bold tracking-wide text-card-foreground">
              {contact.safePhone || contact.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
