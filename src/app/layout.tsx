import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { UIProvider } from '@/lib/ui-store'
import Navbar from '@/components/layout/Navbar'
import CartPanel from '@/components/layout/CartPanel'
import StyleAssistant from '@/components/ai/StyleAssistant'
import Toast from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: 'MAISON — Modern Fashion',
  description: 'Curated fashion for the modern wardrobe. Powered by AI styling.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UIProvider>
          <CartProvider>
            <Navbar />
            <CartPanel />
            <StyleAssistant />
            <Toast />
            <main>{children}</main>
            <footer className="bg-black text-white">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-10 md:px-20 py-20">
                <div className="md:col-span-2">
                  <h3 className="font-serif text-2xl font-light tracking-[5px] uppercase mb-4">Maison</h3>
                  <p className="text-sm text-white/40 leading-relaxed max-w-xs mb-6">
                    A curated fashion destination powered by AI, for those who appreciate the art of dressing well.
                  </p>
                  <div className="flex gap-4">
                    {['ig', 'fb', 'tw', 'pt'].map(s => (
                      <button key={s} className="w-9 h-9 border border-white/20 text-xs uppercase hover:border-[#C8A96E] hover:bg-[#C8A96E] hover:text-black transition-all duration-200">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                {[
                  { title: 'Shop', links: ['New Arrivals', 'Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Sale'] },
                  { title: 'Help', links: ['Sizing Guide', 'Shipping & Returns', 'FAQ', 'Contact Us', 'Track Order'] },
                ].map(col => (
                  <div key={col.title}>
                    <h4 className="text-[10px] tracking-[3px] uppercase text-[#C8A96E] mb-6">{col.title}</h4>
                    <ul className="space-y-3">
                      {col.links.map(l => (
                        <li key={l} className="text-sm text-white/40 hover:text-white transition-colors duration-200 cursor-pointer">{l}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 px-10 md:px-20 py-6 flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] text-white/25">
                <span>© 2025 Maison. All rights reserved.</span>
                <span>Built with Next.js · Styled with Tailwind · Powered by Gemini AI</span>
              </div>
            </footer>
          </CartProvider>
        </UIProvider>
      </body>
    </html>
  )
}
