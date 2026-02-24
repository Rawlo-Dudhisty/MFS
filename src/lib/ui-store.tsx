'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface UIState {
  cartOpen: boolean
  authOpen: boolean
  searchOpen: boolean
  toast: string
  openCart: () => void
  closeCart: () => void
  openAuth: () => void
  closeAuth: () => void
  toggleSearch: () => void
  closeSearch: () => void
  showToast: (msg: string) => void
}

const UIContext = createContext<UIState | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <UIContext.Provider value={{
      cartOpen, authOpen, searchOpen, toast,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      openAuth: () => setAuthOpen(true),
      closeAuth: () => setAuthOpen(false),
      toggleSearch: () => setSearchOpen(p => !p),
      closeSearch: () => setSearchOpen(false),
      showToast,
    }}>
      {children}
    </UIContext.Provider>
  )
}

export const useUIStore = () => {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUIStore must be within UIProvider')
  return ctx
}
