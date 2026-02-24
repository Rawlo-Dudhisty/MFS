'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useUIStore } from '@/lib/ui-store'

export default function AuthModal() {
  const { authOpen, closeAuth, showToast } = useUIStore()
  const [tab, setTab] = useState<'login' | 'register'>('login')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    closeAuth()
    showToast(tab === 'login' ? 'Welcome back to Maison' : 'Account created — welcome to Maison')
  }

  if (!authOpen) return null

  return (
    <div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm animate-fade-in flex items-center justify-center px-4" onClick={closeAuth}>
      <div className="bg-white w-full max-w-md p-12 relative animate-slide-up" onClick={e => e.stopPropagation()}>
        <button
          onClick={closeAuth}
          className="absolute top-5 right-6 text-muted hover:text-black transition-colors duration-200"
          aria-label="Close authentication modal"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl font-light tracking-[5px] uppercase mb-2">Maison</h2>
          <p className="text-sm text-muted">Your personal style, elevated.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          {(['login', 'register'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 pb-3 text-[11px] tracking-[2px] uppercase transition-all duration-200 border-b-2 -mb-px ${tab === t ? 'border-black text-black' : 'border-transparent text-muted'}`}
            >
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {tab === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-2">First Name</label>
                <input type="text" placeholder="Jane" className="input-base" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-2">Last Name</label>
                <input type="text" placeholder="Doe" className="input-base" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-2">Email Address</label>
            <input type="email" placeholder="your@email.com" className="input-base" required />
          </div>

          <div>
            <label className="block text-[10px] tracking-[2px] uppercase text-muted mb-2">Password</label>
            <input type="password" placeholder="••••••••" className="input-base" required />
          </div>

          {tab === 'login' && (
            <p className="text-right text-[11px] text-muted underline cursor-pointer hover:text-black transition-colors duration-200">
              Forgot your password?
            </p>
          )}

          <button type="submit" className="btn-primary w-full mt-2">
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
