'use client'

import { useUIStore } from '@/lib/ui-store'

export default function Toast() {
  const { toast } = useUIStore()

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-black text-white px-7 py-3.5 text-[11px] tracking-[2px] uppercase whitespace-nowrap transition-all duration-300 ease-in-out pointer-events-none ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {toast}
    </div>
  )
}
