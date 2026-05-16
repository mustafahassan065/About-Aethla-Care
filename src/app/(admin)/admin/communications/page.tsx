'use client'
import { useState } from 'react'
const conversations = [
  { id: '1', name: 'Maria Santos', role: 'Caregiver', msg: 'Client completed all exercises today. Mood was excellent.', time: '5m ago', unread: 0 },
  { id: '2', name: 'Al-Rashid Family', role: 'Family', msg: 'Thank you for the update! Very reassuring.', time: '12m ago', unread: 2 },
  { id: '3', name: 'Ana Reyes', role: 'Caregiver', msg: 'Baby feeding schedule updated for tomorrow.', time: '1h ago', unread: 0 },
  { id: '4', name: 'Hassan Family', role: 'Family', msg: 'When is the next scheduled visit?', time: '2h ago', unread: 1 },
]
export default function CommunicationsPage() {
  const [selected, setSelected] = useState(conversations[0])
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading-xl font-extrabold font-poppins text-neutral-800">Communications</h1>
          <p className="text-body-sm text-neutral-400">Secure messaging center</p>
        </div>
        <button className="btn-primary btn-sm">📣 Broadcast</button>
      </div>
      <div className="card overflow-hidden" style={{ height: '600px' }}>
        <div className="grid grid-cols-3 h-full">
          <div className="border-r border-neutral-100 overflow-y-auto">
            {conversations.map(c => (
              <div key={c.id} onClick={() => setSelected(c)} className={`flex items-start gap-3 p-4 cursor-pointer border-b border-neutral-50 transition-colors ${selected.id===c.id?'bg-primary-50 border-l-4 border-l-primary-500':''}`}>
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 font-bold font-poppins text-sm flex-shrink-0">
                  {c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between"><strong className="text-body-sm font-bold text-neutral-800 truncate">{c.name}</strong><span className="text-caption text-neutral-400 ml-1 flex-shrink-0">{c.time}</span></div>
                  <span className="text-caption text-neutral-400">{c.role}</span>
                  <p className="text-caption text-neutral-500 truncate">{c.msg}</p>
                </div>
                {c.unread > 0 && <div className="w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{c.unread}</div>}
              </div>
            ))}
          </div>
          <div className="col-span-2 flex flex-col">
            <div className="p-4 border-b border-neutral-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 font-bold font-poppins text-sm">
                {selected.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
              </div>
              <div><strong className="block text-body-sm font-bold text-neutral-800">{selected.name}</strong><span className="text-caption text-neutral-400">{selected.role}</span></div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              <div className="flex justify-end"><div className="bg-primary-500 text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-xs text-body-sm">Good morning! Can you please confirm today's schedule?</div></div>
              <div className="flex justify-start"><div className="bg-neutral-100 px-4 py-2 rounded-2xl rounded-tl-sm max-w-xs text-body-sm text-neutral-700">{selected.msg}</div></div>
            </div>
            <div className="p-4 border-t border-neutral-100 flex gap-2">
              <input className="form-input flex-1" placeholder="Type a message..." />
              <button className="btn-primary btn-sm px-5">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
