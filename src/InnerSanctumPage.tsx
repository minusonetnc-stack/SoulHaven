import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'

interface SanctumMessage { id: string; text: string; timestamp: number; type: 'user' | 'system' }

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function InnerSanctumPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<SanctumMessage[]>([])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  useEffect(() => {
    const socket = io(`${API_URL}/inner-sanctum`, { transports: ['websocket'] })
    socketRef.current = socket
    socket.on('connect', () => { setConnected(true); socket.emit('join-inner-sanctum') })
    socket.on('disconnect', () => setConnected(false))
    socket.on('message', (msg: SanctumMessage) => setMessages(prev => [...prev, msg]))
    socket.on('participant-count', (count: number) => setParticipantCount(count))
    socket.on('cleared', () => setMessages(prev => [...prev, { id: 'cleared-' + Date.now(), text: '> LOUNGE CLEARED BY ADMIN.', timestamp: Date.now(), type: 'system' }]))
    return () => { socket.disconnect() }
  }, [])

  const sendMessage = useCallback(() => {
    if (!input.trim() || !socketRef.current) return
    socketRef.current.emit('send-message', { text: input.trim(), timestamp: Date.now() })
    setInput(''); inputRef.current?.focus()
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }
  const clearLounge = () => { socketRef.current?.emit('clear-messages') }
  const handleExit = () => { socketRef.current?.disconnect(); navigate('/') }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fbbf24', fontFamily: '"Courier New", "Monaco", monospace', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)', pointerEvents: 'none', zIndex: 50, opacity: 0.3 }} />
      <div style={{ borderBottom: '1px solid #78350f', padding: 'clamp(0.5rem, 2vh, 0.75rem) clamp(0.75rem, 3vw, 1rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0500', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
          <div style={{ width: 'clamp(6px, 1.5vw, 8px)', height: 'clamp(6px, 1.5vw, 8px)', borderRadius: '50%', background: connected ? '#fbbf24' : '#f87171', boxShadow: connected ? '0 0 8px #fbbf24' : '0 0 8px #f87171' }} />
          <span style={{ fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{connected ? 'INNER SANCTUM — ADMIN LOUNGE' : 'DISCONNECTED'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
          <div style={{ fontSize: 'clamp(0.55rem, 1.8vw, 0.625rem)', color: '#78350f', letterSpacing: '0.1em' }}>PRESENT: {participantCount}</div>
          <button onClick={clearLounge} style={{ padding: 'clamp(0.2rem, 1vh, 0.25rem) clamp(0.4rem, 1.5vw, 0.5rem)', background: 'transparent', color: '#78350f', border: '1px solid #78350f', fontFamily: '"Courier New", monospace', fontSize: 'clamp(0.55rem, 1.8vw, 0.625rem)', cursor: 'pointer', letterSpacing: '0.1em' }}>[CLEAR]</button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(0.75rem, 3vw, 1rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(0.3rem, 1.5vh, 0.5rem)', position: 'relative', zIndex: 10 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'clamp(2rem, 8vh, 3rem) clamp(1rem, 4vw, 1rem)', color: '#78350f', fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)', lineHeight: 1.8 }}>
            <div style={{ marginBottom: 'clamp(0.75rem, 3vh, 1rem)', fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', opacity: 0.5 }}>🜂</div>
            <div>{`> INNER SANCTUM INITIALIZED`}</div>
            <div>{`> ADMIN LOUNGE`}</div>
            <div>{`> MESSAGES PERSIST IN MEMORY`}</div>
            <div style={{ marginTop: 'clamp(0.75rem, 3vh, 1rem)', color: '#92400e' }}>{`Welcome, keeper.`}</div>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} style={{ padding: 'clamp(0.3rem, 1.5vh, 0.5rem) clamp(0.5rem, 2vw, 0.75rem)', borderRadius: '2px', background: msg.type === 'system' ? 'rgba(251, 191, 36, 0.05)' : 'transparent', borderLeft: msg.type === 'system' ? '2px solid #fbbf24' : '2px solid transparent', fontSize: 'clamp(0.75rem, 2.5vw, 0.8125rem)', lineHeight: 1.5, color: msg.type === 'system' ? '#fbbf24' : '#fcd34d', wordBreak: 'break-word' }}>
            {msg.type === 'user' && <span style={{ color: '#78350f', marginRight: 'clamp(0.3rem, 1vw, 0.5rem)' }}>{new Date(msg.timestamp).toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit'})}</span>}
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ borderTop: '1px solid #78350f', padding: 'clamp(0.5rem, 2vh, 0.75rem) clamp(0.75rem, 3vw, 1rem)', background: '#0a0500', display: 'flex', gap: 'clamp(0.3rem, 1.5vw, 0.5rem)', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <span style={{ color: '#78350f', fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}>{`>`}</span>
        <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type message..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fbbf24', fontFamily: '"Courier New", monospace', fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)', outline: 'none' }} />
        <button onClick={sendMessage} disabled={!input.trim()} style={{ padding: 'clamp(0.3rem, 1.5vh, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid #fbbf24', fontFamily: '"Courier New", monospace', fontSize: 'clamp(0.55rem, 1.8vw, 0.625rem)', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}>[SEND]</button>
      </div>
      <div style={{ borderTop: '1px solid #451a03', padding: 'clamp(0.4rem, 1.5vh, 0.5rem) clamp(0.75rem, 3vw, 1rem)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#050300', position: 'relative', zIndex: 10 }}>
        <div style={{ fontSize: 'clamp(0.5rem, 1.5vw, 0.5625rem)', color: '#451a03', letterSpacing: '0.1em' }}>{`> MESSAGES NOT PERSISTED TO DISK`}</div>
        <button onClick={() => setShowExitConfirm(true)} style={{ background: 'transparent', border: 'none', color: '#451a03', fontFamily: '"Courier New", monospace', fontSize: 'clamp(0.5rem, 1.5vw, 0.5625rem)', cursor: 'pointer', letterSpacing: '0.1em' }}>[EXIT SANCTUM]</button>
      </div>
      {showExitConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1rem, 4vw, 1rem)', background: 'rgba(0,0,0,0.9)' }}>
          <div style={{ background: '#000', border: '1px solid #fbbf24', borderRadius: '2px', padding: 'clamp(1.5rem, 5vh, 2rem)', maxWidth: 'min(90vw, 360px)', width: '100%', fontFamily: '"Courier New", monospace' }}>
            <div style={{ color: '#fbbf24', marginBottom: 'clamp(1rem, 3vh, 1.5rem)', fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', lineHeight: 1.6 }}>{`> CONFIRM EXIT\n> RETURN TO PUBLIC SANCTUARY`}</div>
            <div style={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
              <button onClick={() => setShowExitConfirm(false)} style={{ flex: 1, padding: 'clamp(0.5rem, 2vh, 0.625rem)', background: 'transparent', color: '#fbbf24', border: '1px solid #fbbf24', fontFamily: '"Courier New", monospace', fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)', cursor: 'pointer' }}>[STAY]</button>
              <button onClick={handleExit} style={{ flex: 1, padding: 'clamp(0.5rem, 2vh, 0.625rem)', background: '#fbbf24', color: '#000', border: 'none', fontFamily: '"Courier New", monospace', fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)', cursor: 'pointer', fontWeight: 'bold' }}>[EXIT]</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
