'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Sparkles, Loader2 } from 'lucide-react'
import { Product } from '@/types'
import { useUIStore } from '@/lib/ui-store'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'

export default function AISearch() {
  const { searchOpen, closeSearch, showToast } = useUIStore()
  const { addToCart } = useCart()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [interpretation, setInterpretation] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setQuery(''); setResults([]); setInterpretation('')
    }
  }, [searchOpen])

  useEffect(() => {
    clearTimeout(timerRef.current)
    if (!query.trim()) { setResults([]); setInterpretation(''); return }

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        })
        const data = await res.json()
        setResults(data.results || [])
        setInterpretation(data.interpretation || '')
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 500)
  }, [query])

  const handleAdd = (product: Product) => {
    addToCart(product)
    showToast(`${product.name} added to bag`)
  }

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm animate-fade-in" onClick={closeSearch}>
      <div className="max-w-2xl mx-auto mt-20 px-4" onClick={e => e.stopPropagation()}>
        <div className="bg-white shadow-2xl animate-slide-up">
          {/* Search Input */}
          <div className="flex items-center border-b border-border px-5 py-4 gap-3">
            <Sparkles size={16} className="text-accent flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Describe what you're looking for... e.g. 'something elegant for a winter dinner'"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted"
            />
            {loading ? (
              <Loader2 size={16} className="text-muted animate-spin flex-shrink-0" />
            ) : query ? (
              <button
                onClick={() => setQuery('')}
                className="text-muted hover:text-black"
                aria-label="Clear search"
                title="Clear search"
              >
                <X size={16} />
              </button>
            ) : (
              <Search size={16} className="text-muted flex-shrink-0" />
            )}
          </div>

          {/* AI Interpretation */}
          {interpretation && (
            <div className="px-5 py-2.5 bg-cream border-b border-border flex items-center gap-2">
              <Sparkles size={12} className="text-accent flex-shrink-0" />
              <p className="text-[11px] tracking-[0.5px] text-muted italic">{interpretation}</p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="max-h-96 overflow-y-auto divide-y divide-border">
              {results.map(product => (
                <div key={product.id} className="flex items-center gap-4 px-5 py-4 hover:bg-cream transition-colors duration-200 group">
                  <div className="w-12 h-14 flex-shrink-0 flex items-center justify-center text-2xl rounded-sm bg-cream">
                    {product.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] tracking-[2px] uppercase text-muted">{product.cat}</p>
                    <p className="font-serif text-base font-light truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                      {product.oldPrice && <span className="text-xs text-muted line-through">{formatPrice(product.oldPrice)}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAdd(product)}
                    className="opacity-0 group-hover:opacity-100 bg-black text-white text-[10px] tracking-[1.5px] uppercase px-3 py-2 hover:bg-accent transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {query && !loading && results.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-muted">
              No pieces found matching your description. Try different words.
            </div>
          )}

          {/* Hint */}
          {!query && (
            <div className="px-5 py-6 text-center">
              <p className="text-[11px] tracking-[1px] uppercase text-muted mb-3">Try searching for</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['warm winter coat', 'office outfit pieces', 'summer accessories', 'elegant evening look'].map(hint => (
                  <button key={hint} onClick={() => setQuery(hint)} className="text-[11px] border border-border px-3 py-1.5 hover:border-black hover:bg-black hover:text-white transition-all duration-200 uppercase tracking-[0.5px]">
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-border px-5 py-2.5 flex items-center gap-1.5">
            <Sparkles size={10} className="text-accent" />
            <span className="text-[10px] text-muted tracking-[0.5px]">AI-powered semantic search — understands natural language</span>
          </div>
        </div>
      </div>
    </div>
  )
}
