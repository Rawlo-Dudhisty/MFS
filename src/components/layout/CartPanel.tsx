'use client'

import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useUIStore } from '@/lib/ui-store'
import { formatPrice } from '@/lib/utils'
import styles from './CartPanel.module.css'

export default function CartPanel() {
  const { cart, removeFromCart, changeQty, total } = useCart()
  const { cartOpen, closeCart, showToast } = useUIStore()

  const swatchClassById: Record<number, string> = {
    1: styles.swatch1,
    2: styles.swatch2,
    3: styles.swatch3,
    4: styles.swatch4,
    5: styles.swatch5,
    6: styles.swatch6,
    7: styles.swatch7,
    8: styles.swatch8,
  }

  const handleCheckout = () => {
    showToast('Redirecting to secure checkout...')
    closeCart()
  }

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-fade-in" onClick={closeCart} />
      )}

      {/* Panel */}
      <div className={`fixed top-0 right-0 bottom-0 z-[101] w-full max-w-md bg-white flex flex-col shadow-2xl transition-transform duration-350 ease-in-out ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-7 border-b border-border">
          <h2 className="font-serif text-2xl font-light">Shopping Bag</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart panel"
            className="text-muted hover:text-black transition-colors duration-200 p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-border" />
              <h3 className="font-serif text-xl font-light text-charcoal">Your bag is empty</h3>
              <p className="text-sm text-muted">Add some beautiful pieces to get started</p>
              <button onClick={closeCart} className="btn-outline mt-4 text-xs">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {cart.map(item => (
                <div key={item.id} className="py-5 flex gap-4 animate-slide-up">
                  <div className={`w-20 h-24 flex-shrink-0 flex items-center justify-center text-4xl rounded-sm ${styles.colorSwatch} ${swatchClassById[item.id] ?? styles.swatchDefault}`}>
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[1.5px] uppercase text-muted mb-1">{item.cat}</p>
                    <h4 className="font-serif text-lg font-light mb-2 truncate">{item.name}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => changeQty(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:text-accent transition-colors duration-200"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => changeQty(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:text-accent transition-colors duration-200"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-medium">{formatPrice(item.price * item.qty)}</span>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-[10px] tracking-[1px] uppercase text-muted hover:text-black underline mt-2 transition-colors duration-200">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-8 py-6 border-t border-border">
            <div className="flex justify-between text-sm text-muted mb-2">
              <span>Subtotal</span><span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted mb-4">
              <span>Shipping</span><span className="text-black">Free</span>
            </div>
            <div className="flex justify-between font-serif text-xl font-light mb-6 pt-4 border-t border-border">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
            <button onClick={handleCheckout} className="btn-primary w-full text-center mb-3">
              Proceed to Checkout
            </button>
            <button onClick={closeCart} className="btn-outline w-full text-center">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
