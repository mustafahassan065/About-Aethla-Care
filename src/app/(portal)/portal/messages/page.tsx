'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/lib/auth'
import { PageHeader } from '@/components/ui/index'

// Simple messaging UI — messages stored in state, backend integration via /messages endpoint
export default function PortalMessages() {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'coordinator',
      name: 'Care Coordinator',
      text: 'Hello! Welcome to the Aethla Care family portal. Feel free to message us here with any questions about your care arrangement.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, {
      id: Date.now(),
      from: 'user',
      name: `${user?.firstName} ${user?.lastName}`,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }])
    setInput('')
  }

  return (
    <div>
      <PageHeader title="Messages" subtitle="Direct communication with your care coordinator" />

      <div className="card overflow-hidden flex flex-col" style={{ height: '65vh' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <p className="text-caption text-neutral-400">{msg.name} · {msg.time}</p>
                <div className={`px-4 py-3 rounded-2xl text-body-sm leading-relaxed ${
                  msg.from === 'user'
                    ? 'bg-primary-500 text-white rounded-br-md'
                    : 'bg-neutral-100 text-neutral-800 rounded-bl-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-neutral-100 p-4 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            className="form-input flex-1"
            placeholder="Type a message..."
          />
          <button onClick={send} disabled={!input.trim()} className="btn-primary btn-sm px-5">Send</button>
        </div>
      </div>

      <div className="card p-4 mt-4">
        <p className="text-body-sm text-neutral-500">
          For urgent matters, call our care line directly:{' '}
          <a href="tel:+97460000000" className="text-primary-500 hover:underline font-semibold">+974 6000 0000</a>
        </p>
      </div>
    </div>
  )
}