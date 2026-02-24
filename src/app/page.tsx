'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { products } from '@/lib/products'
import ProductCard from '@/components/ui/ProductCard'
import { useUIStore } from '@/lib/ui-store'
import AISearch from '@/components/ai/AISearch'
import AuthModal from '@/components/ui/AuthModal'

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories']

export default function Home() {
  const [filter, setFilter] = useState('All')
  const { toggleSearch } = useUIStore()

  const filtered = filter === 'All'
    ? products
    : products.filter(p => p.cat === filter)

  return (
    <>
      <AISearch />
      <AuthModal />

      {/* ── HERO ── */}
      <section id="home" className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-[72px]">
        {/* Text */}
        <div className="flex flex-col justify-center px-10 md:px-20 py-20 animate-slide-up">
          <p className="section-eyebrow">New Collection — Spring 2025</p>
          <h1 className="font-serif text-6xl md:text-8xl font-light leading-[1.05] tracking-tight mb-7">
            Dress with<br />
            <em className="text-accent not-italic">intention.</em><br />
            Live with style.
          </h1>
          <p className="text-sm leading-relaxed text-muted max-w-md mb-10">
            Curated essentials and statement pieces crafted for the modern wardrobe. Where simplicity meets sophistication.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <button
              className="btn-primary"
              onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Collection
            </button>
            <button onClick={toggleSearch} className="btn-outline flex items-center gap-2">
              <Sparkles size={13} /> AI Search
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-12 pt-10 border-t border-border">
            {[['4.2k+', 'Pieces Curated'], ['28+', 'Global Brands'], ['98%', 'Happy Clients']].map(([n, l]) => (
              <div key={l}>
                <h3 className="font-serif text-3xl font-light">{n}</h3>
                <p className="text-[10px] tracking-[1.5px] uppercase text-muted mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image / Illustration */}
        <div className="relative bg-gradient-to-br from-[#DDD5C8] to-[#B0A08E] min-h-[60vh] md:min-h-0 flex items-center justify-center overflow-hidden">
          <svg className="w-2/3 max-w-xs opacity-80" viewBox="0 0 300 450" fill="none">
            <ellipse cx="150" cy="55" rx="28" ry="32" fill="rgba(255,255,255,0.15)" />
            <rect x="144" y="85" width="12" height="20" fill="rgba(255,255,255,0.12)" />
            <path d="M100 105 Q80 120 72 160 Q65 200 68 260 Q70 290 90 310 L120 315 L130 200 L150 195 L170 200 L180 315 L210 310 Q230 290 232 260 Q235 200 228 160 Q220 120 200 105 Q175 98 150 96 Q125 98 100 105Z" fill="rgba(255,255,255,0.18)" />
            <rect x="118" y="188" width="64" height="8" rx="2" fill="rgba(200,169,110,0.7)" />
            <path d="M130 105 Q150 115 170 105" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" />
            <path d="M90 310 Q70 360 60 410 L240 410 Q230 360 210 310Z" fill="rgba(255,255,255,0.12)" />
            <ellipse cx="110" cy="416" rx="22" ry="8" fill="rgba(255,255,255,0.1)" />
            <ellipse cx="190" cy="416" rx="22" ry="8" fill="rgba(255,255,255,0.1)" />
          </svg>

          {/* AI badge */}
          <button
            onClick={toggleSearch}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-4 py-2.5 text-[10px] tracking-[2px] uppercase hover:bg-accent/90 transition-colors duration-200"
          >
            <Sparkles size={11} /> AI Style Search
          </button>

          {/* Scroll line */}
          <div className="absolute right-8 bottom-8 flex flex-col items-center gap-2 text-white/40">
            <span className="text-[9px] tracking-[3px] uppercase rotate-90 origin-right mb-4">Scroll</span>
            <div className="w-px h-10 bg-white/25 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── SHOP ── */}
      <section id="shop" className="px-10 md:px-20 py-20 md:py-28">
        <div className="flex justify-between items-end mb-12 flex-wrap gap-6">
          <div>
            <p className="section-eyebrow">Our Selection</p>
            <h2 className="section-title">New <em className="font-serif italic text-accent">Arrivals</em></h2>
          </div>
          <button
            onClick={toggleSearch}
            className="flex items-center gap-2 text-[11px] tracking-[2px] uppercase border border-black px-4 py-2.5 hover:bg-black hover:text-white transition-all duration-200"
          >
            <Sparkles size={12} /> AI Search
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 text-[10px] tracking-[1.5px] uppercase border transition-all duration-200 ${filter === cat ? 'bg-black text-white border-black' : 'border-border text-muted hover:border-black hover:text-black'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── FEATURED BANNER ── */}
      <section id="featured" className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] bg-black text-white">
        <div className="flex flex-col justify-center px-10 md:px-20 py-20">
          <p className="text-[10px] tracking-[4px] uppercase text-accent mb-6">Limited Edition</p>
          <h2 className="font-serif text-5xl md:text-6xl font-light leading-tight mb-6">
            The Atelier<br />Collection
          </h2>
          <p className="text-sm leading-relaxed text-white/50 max-w-sm mb-10">
            Handcrafted in small batches, each piece tells a story. Exclusive fabrics, enduring quality, timeless design.
          </p>
          <button className="btn-accent self-start">Explore Now</button>
        </div>
        <div className="flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#333] min-h-[300px]">
          <svg width="200" height="280" viewBox="0 0 200 280" fill="none">
            <rect x="40" y="20" width="120" height="180" rx="2" fill="rgba(255,255,255,0.06)" stroke="rgba(200,169,110,0.3)" strokeWidth="1" />
            <rect x="55" y="35" width="90" height="140" rx="1" fill="rgba(255,255,255,0.04)" />
            {[90, 110, 130].map(y => (
              <path key={y} d={`M70 ${y} Q100 ${y - 10} 130 ${y}`} stroke="rgba(200,169,110,0.5)" strokeWidth="1.5" fill="none" />
            ))}
            <rect x="80" y="200" width="40" height="60" rx="1" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          </svg>
        </div>
      </section>

      {/* ── AI FEATURES SHOWCASE ── */}
      <section className="px-10 md:px-20 py-20 md:py-28 bg-white">
        <div className="text-center mb-16">
          <p className="section-eyebrow">Powered by Gemini AI</p>
          <h2 className="section-title">Your Intelligent <em className="font-serif italic text-accent">Style Guide</em></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '💬',
              title: 'Style Assistant',
              desc: 'Chat with our AI stylist for personalized outfit advice, sizing help, and fashion tips tailored to your lifestyle.',
              cta: 'Chat Now',
              action: () => {},
            },
            {
              icon: '🔍',
              title: 'Smart Search',
              desc: 'Describe what you need in plain language. Our AI understands "elegant for a winter dinner" and finds the perfect matches.',
              cta: 'Try AI Search',
              action: toggleSearch,
            },
            {
              icon: '✨',
              title: 'AI Recommendations',
              desc: 'Add something to your bag and watch our AI instantly curate perfectly paired pieces to complete your look.',
              cta: 'Browse Pieces',
              action: () => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }),
            },
          ].map(f => (
            <div key={f.title} className="border border-border p-8 hover:border-accent transition-colors duration-300 group">
              <div className="text-4xl mb-5">{f.icon}</div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={12} className="text-accent" />
                <h3 className="text-[11px] tracking-[2px] uppercase text-accent">AI Feature</h3>
              </div>
              <h4 className="font-serif text-2xl font-light mb-3">{f.title}</h4>
              <p className="text-sm text-muted leading-relaxed mb-6">{f.desc}</p>
              <button onClick={f.action} className="text-[11px] tracking-[2px] uppercase border-b border-black pb-0.5 hover:text-accent hover:border-accent transition-colors duration-200">
                {f.cta} →
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
