'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { Message } from '@/types'

const WELCOME = "Hello! I'm your personal style assistant. I can help with outfit ideas, sizing advice, occasion styling, and finding pieces that work for your wardrobe. What can I help you with today?"

export default function StyleAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  const sendMessage = async () => {
    const userMsg = input.trim()
    if (!userMsg || loading) return

    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    setStreaming('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!res.ok) throw new Error('Failed')

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let full = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          full += chunk
          setStreaming(full)
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: full }])
      setStreaming('')
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, I had trouble connecting. Please try again.' }])
      setStreaming('')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent transition-all duration-300 hover:scale-105"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-28 right-8 z-[149] w-80 md:w-96 bg-white shadow-2xl border border-border transition-all duration-300 origin-bottom-right ${open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-black text-white px-5 py-4 flex items-center gap-3">
          <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles size={13} />
          </div>
          <div>
            <p className="text-xs tracking-[2px] uppercase font-medium">Style Assistant</p>
            <p className="text-[10px] text-white/50 mt-0.5">Powered by Gemini AI</p>
          </div>
        </div>

        {/* Messages */}
        <div className="h-72 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              {msg.role === 'assistant' && (
                <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <Sparkles size={10} className="text-white" />
                </div>
              )}
              <div className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-black text-white' : 'bg-cream text-charcoal border border-border'}`}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Streaming response */}
          {streaming && (
            <div className="flex justify-start animate-slide-up">
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <Sparkles size={10} className="text-white" />
              </div>
              <div className="max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed bg-cream text-charcoal border border-border">
                {streaming}
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {loading && !streaming && (
            <div className="flex justify-start">
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <Sparkles size={10} className="text-white" />
              </div>
              <div className="px-4 py-3 bg-cream border border-border flex items-center gap-1.5">
                <span className="typing-dot w-1.5 h-1.5 bg-muted rounded-full inline-block" />
                <span className="typing-dot w-1.5 h-1.5 bg-muted rounded-full inline-block" />
                <span className="typing-dot w-1.5 h-1.5 bg-muted rounded-full inline-block" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {['Outfit for a date', 'Office wardrobe help', 'Summer essentials'].map(q => (
              <button key={q} onClick={() => { setInput(q); }} className="text-[10px] tracking-[1px] border border-border px-2.5 py-1.5 hover:border-black hover:bg-black hover:text-white transition-all duration-200 uppercase">
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-3 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about style, sizing..."
            className="flex-1 bg-cream px-3 py-2 text-sm outline-none border border-border focus:border-black transition-colors duration-200 placeholder:text-muted"
            disabled={loading}
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            aria-label="Send message"
            title="Send message"
            className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-accent transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </>
  )
}
