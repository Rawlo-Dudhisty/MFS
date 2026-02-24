'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useUIStore } from '@/lib/ui-store'

export default function Navbar() {
  const { itemCount } = useCart()
  const { openCart, openAuth, toggleSearch } = useUIStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-[72px] transition-all duration-300 ${scrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm' : 'bg-cream/90 backdrop-blur-sm'} border-b border-border`}>
      {/* Logo */}
      <button onClick={() => scrollTo('home')} className="font-serif text-2xl font-light tracking-[6px] uppercase hover:text-accent transition-colors duration-200">
        Maison
      </button>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-10 list-none">
        {[['Home', 'home'], ['Shop', 'shop'], ['Collection', 'featured']].map(([label, id]) => (
          <li key={id}>
            <button onClick={() => scrollTo(id)} className="text-[11px] tracking-[2px] uppercase text-charcoal hover:text-accent transition-colors duration-200">
              {label}
            </button>
          </li>
        ))}
        <li>
          <button onClick={toggleSearch} className="text-[11px] tracking-[2px] uppercase text-charcoal hover:text-accent transition-colors duration-200">
            AI Search
          </button>
        </li>
      </ul>

      {/* Actions */}
      <div className="flex items-center gap-5">
        <button onClick={openAuth} className="hidden md:flex items-center gap-1.5 text-[11px] tracking-[1.5px] uppercase text-charcoal hover:text-accent transition-colors duration-200">
          <User size={14} /> Account
        </button>
        <button onClick={openCart} className="flex items-center gap-1.5 text-[11px] tracking-[1.5px] uppercase text-charcoal hover:text-accent transition-colors duration-200 relative">
          <ShoppingBag size={14} /> Bag
          {itemCount > 0 && (
            <span className="absolute -top-2.5 -right-3 bg-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium animate-fade-in">
              {itemCount}
            </span>
          )}
        </button>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-charcoal">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-cream border-b border-border py-6 flex flex-col gap-1 animate-fade-in">
          {[['Home', 'home'], ['Shop', 'shop'], ['Collection', 'featured']].map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)} className="px-8 py-3 text-left text-xs tracking-[2px] uppercase hover:text-accent transition-colors duration-200">
              {label}
            </button>
          ))}
          <button onClick={() => { toggleSearch(); setMobileOpen(false) }} className="px-8 py-3 text-left text-xs tracking-[2px] uppercase hover:text-accent transition-colors duration-200">
            AI Search
          </button>
          <button onClick={() => { openAuth(); setMobileOpen(false) }} className="px-8 py-3 text-left text-xs tracking-[2px] uppercase hover:text-accent transition-colors duration-200">
            Account
          </button>
        </div>
      )}
    </nav>
  )
}
