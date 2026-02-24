'use client'

import { Heart } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/lib/cart-context'
import { useUIStore } from '@/lib/ui-store'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'
import AIRecommendations from '@/components/ai/AIRecommendations'
import styles from './ProductCard.module.css'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart()
  const { showToast } = useUIStore()
  const [showRecs, setShowRecs] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product)
    showToast(`${product.name} added to bag`)
    setShowRecs(true)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    setWishlisted(w => !w)
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♡')
  }

  return (
    <div className="product-card">
      {/* Image */}
      <div
        className={`relative aspect-[3/4] overflow-hidden mb-5 ${styles.productCardImage} ${
          styles[`productBg${product.id as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`]
        }`}
      >
        <div className="w-full h-full flex items-center justify-center text-7xl transition-transform duration-500 group-hover:scale-105">
          {product.emoji}
        </div>

        {product.tag && (
          <span className="absolute top-4 left-4 bg-black text-white text-[9px] tracking-[2px] uppercase px-2.5 py-1">
            {product.tag}
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 ${wishlisted ? 'text-red-400' : 'text-muted'}`}
        >
          <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        <button
          onClick={handleAdd}
          className="absolute bottom-0 left-0 right-0 bg-black text-white py-3.5 text-[10px] tracking-[2px] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-accent"
        >
          Add to Bag
        </button>
      </div>

      {/* Info */}
      <div>
        <p className="text-[10px] tracking-[2px] uppercase text-muted mb-1.5">{product.cat}</p>
        <h3 className="font-serif text-lg font-light mb-2">{product.name}</h3>
        <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>

      {/* AI Recs (shown after add to cart) */}
      {showRecs && (
        <AIRecommendations productId={product.id} />
      )}
    </div>
  )
}
