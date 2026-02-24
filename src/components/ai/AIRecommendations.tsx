'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/lib/cart-context'
import { useUIStore } from '@/lib/ui-store'
import { formatPrice } from '@/lib/utils'

interface Props {
  productId: number
}

interface RecommendedProduct extends Product {
  reason: string
}

export default function AIRecommendations({ productId }: Props) {
  const { cart, addToCart } = useCart()
  const { showToast } = useUIStore()
  const [recs, setRecs] = useState<RecommendedProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, cartItems: cart })
        })
        const data = await res.json()
        setRecs(data.recommendations || [])
      } catch { setRecs([]) }
      finally { setLoading(false) }
    }
    fetch_()
  }, [productId])

  if (loading) return (
    <div className="flex items-center gap-2 py-6 text-muted">
      <Loader2 size={14} className="animate-spin" />
      <span className="text-xs tracking-[1px] uppercase">AI is curating recommendations...</span>
    </div>
  )

  if (recs.length === 0) return null

  return (
    <div className="mt-10 pt-10 border-t border-border">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={14} className="text-accent" />
        <h3 className="text-[11px] tracking-[3px] uppercase text-muted">AI Style Picks — Pairs perfectly with this</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {recs.map(rec => (
          <div key={rec.id} className="group cursor-pointer">
            <div className="aspect-[3/4] flex items-center justify-center text-5xl mb-3 transition-transform duration-500 group-hover:scale-[1.02]" style={{ background: rec.color }}>
              {rec.emoji}
            </div>
            <p className="text-[9px] tracking-[2px] uppercase text-muted mb-1">{rec.cat}</p>
            <p className="font-serif text-base font-light mb-1">{rec.name}</p>
            <p className="text-[11px] text-muted italic mb-2">"{rec.reason}"</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{formatPrice(rec.price)}</span>
              <button
                onClick={() => { addToCart(rec); showToast(`${rec.name} added to bag`) }}
                className="text-[10px] tracking-[1.5px] uppercase bg-black text-white px-3 py-1.5 hover:bg-accent transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
