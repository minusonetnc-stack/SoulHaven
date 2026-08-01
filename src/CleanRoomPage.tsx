import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'

interface CleanMessage { id: string; text: string; timestamp: number; type: 'user' | 'system' | 'sterile' }

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function CleanRoomPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<CleanMessage[]>([])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)
  const [timeUntilWipe, setTimeUntilWipe] = useState(600)
  const [sterile, setSterile] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  useEffect(() => {
    const socket = io(`${API_URL}/clean-room`, { transports: ['websocket'] })
    socketRef.current = socket
    socket.on('connect', () => { setConnected(true); socket.emit('join-clean-room') })
    socket.on('disconnect', () => setConnected(false))
    socket.on('message', (msg: CleanMessage) => setMessages(prev => [...prev, msg]))
    socket.on('participant-count', (count: number) => setParticipantCount(count))
    socket.on('sterilize', () => {
      setSterile(true)
      setMessages(prev => [...prev, { id: 'sterilize-' + Date.now(), text: '> ROOM STERILIZED. ALL MESSAGES DESTROYED.', timestamp: Date.now(), type: 'sterile' }])
    })
    socket.on('wipe-timer', (seconds: number) => setTimeUntilWipe(seconds))
    return () => { socket.disconnect() }
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60), s = seconds % 60
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
  }

  const sendMessage = useCallback(() => {
    if (!input.trim() || !socketRef.current || sterile) return
    socketRef.current.emit('send-message', { text: input.trim(), timestamp: Date.now() })
    setInput(''); inputRef.current?.focus()
  }, [input, sterile])

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }
  const handleExit = () => { socketRef.current?.disconnect(); navigate('/') }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#4ade80', fontFamily: '"Courier New", "Monaco", monospace', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)', pointerEvents: 'none', zIndex: 50, opacity: 0.3 }} />
      <div style={{ borderBottom: '1px solid #1a3a1a', padding: 'clamp(0.5rem, 2vh, 0.75rem) clamp(0.75rem, 3vw, 1rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#050a05', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
          <div style={{ width: 'clamp(6px, 1.5vw, 8px)', height: 'clamp(6px, 1.5vw, 8px)', borderRadius: '50%', background: connected ? '#4ade80' : '#f87171', boxShadow: connected ? '0 0 8px #4ade80' : '0 0 8px #f87171' }} />
          <span style={{ fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{sterile ? 'STERILIZED' : connected ? 'STERILE ENVIRONMENT ACTIVE' : 'DISCONNECTED'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
          <div style={{ fontSize: 'clamp(0.55rem, 1.8vw, 0.625rem)', color: '#2d5a2d', letterSpacing: '0.1em' }}>PARTICIPANTS: {participantCount}</div>
          {!sterile && <div style={{ fontSize: 'clamp(0.55rem, 1.8vw, 0.625rem)', color: timeUntilWipe < 60 ? '#f87171' : '#2d5a2d', letterSpacing: '0.1em' }}>WIPE IN: {formatTime(timeUntilWipe)}</div>}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(0.75rem, 3vw, 1rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(0.3rem, 1.5vh, 0.5rem)', position: 'relative', zIndex: 10 }}>
        {messages.length === 0 && !sterile && (
          <div style={{ textAlign: 'center', padding: 'clamp(2rem, 8vh, 3rem) clamp(1rem, 4vw, 1rem)', color: '#1a3a1a', fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)', lineHeight: 1.8 }}>
            <div style={{ marginBottom: 'clamp(0.75rem, 3vh, 1rem)', fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', opacity: 0.5 }}>🧪</div>
            <div>{`> CLEAN ROOM INITIALIZED`}</div>
            <div>{`> NO LOGS. NO HISTORY. NO TRACE.`}</div>
            <div>{`> MESSAGES EXIST ONLY IN MEMORY.`}</div>
            <div>{`> ROOM STERILIZES WHEN EMPTY.`}</div>
            <div style={{ marginTop: 'clamp(0.75rem, 3vh, 1rem)', color: '#2d5a2d' }}>{`Speak freely. Leave no evidence.`}</div>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} style={{ padding: 'clamp(0.3rem, 1.5vh, 0.5rem) clamp(0.5rem, 2vw, 0.75rem)', borderRadius: '2px', background: msg.type === 'sterile' ? 'rgba(248,113,113,0.05)' : msg.type === 'system' ? 'rgba(74,222,128,0.05)' : 'transparent', borderLeft: msg.type === 'sterile' ? '2px solid #f87171' : msg.type === 'system' ? '2px solid #4ade80' : '2px solid transparent', fontSize: 'clamp(0.75rem, 2.5vw, 0.8125rem)', lineHeight: 1.5, color: msg.type === 'sterile' ? '#f87171' : msg.type === 'system' ? '#4ade80' : '#a3d9a3', wordBreak: 'break-word' }}>
            {msg.type === 'user' && <span style={{ color: '#2d5a2d', marginRight: 'clamp(0.3rem, 1vw, 0.5rem)' }}>{new Date(msg.timestamp).toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit'})}</span>}
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ borderTop: '1px solid #1a3a1a', padding: 'clamp(0.5rem, 2vh, 0.75rem) clamp(0.75rem, 3vw, 1rem)', background: '#050a05', display: 'flex', gap: 'clamp(0.3rem, 1.5vw, 0.5rem)', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <span style={{ color: '#2d5a2d', fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}>{`>`}</span>
        <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} disabled={sterile} placeholder={sterile ? 'ROOM STERILIZED' : 'Type message...'} style={{ flex: 1, background: 'transparent', border: 'none', color: '#4ade80', fontFamily: '"Courier New", monospace', fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)', outline: 'none' }} />
        <button onClick={sendMessage} disabled={sterile || !input.trim()} style={{ padding: 'clamp(0.3rem, 1.5vh, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)', background: sterile ? 'transparent' : 'rgba(74,222,128,0.1)', color: sterile ? '#1a3a1a' : '#4ade80', border: sterile ? '1px solid #1a3a1a' : '1px solid #4ade80', fontFamily: '"Courier New", monospace', fontSize: 'clamp(0.55rem, 1.8vw, 0.625rem)', cursor: sterile ? 'not-allowed' : 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{sterile ? '[LOCKED]' : '[SEND]'}</button>
      </div>
      <div style={{ borderTop: '1px solid #0a1a0a', padding: 'clamp(0.4rem, 1.5vh, 0.5rem) clamp(0.75rem, 3vw, 1rem)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#020502', position: 'relative', zIndex: 10 }}>
        <div style={{ fontSize: 'clamp(0.5rem, 1.5vw, 0.5625rem)', color: '#0d1f0d', letterSpacing: '0.1em' }}>{sterile ? '> STERILE. NO NEW MESSAGES.' : '> MESSAGES NOT PERSISTED'}</div>
        <button onClick={() => setShowExitConfirm(true)} style={{ background: 'transparent', border: 'none', color: '#1a3a1a', fontFamily: '"Courier New", monospace', fontSize: 'clamp(0.5rem, 1.5vw, 0.5625rem)', cursor: 'pointer', letterSpacing: '0.1em' }}>[EXIT CLEAN ROOM]</button>
      </div>
      {showExitConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1rem, 4vw, 1rem)', background: 'rgba(0,0,0,0.9)' }}>
          <div style={{ background: '#000', border: '1px solid #4ade80', borderRadius: '2px', padding: 'clamp(1.5rem, 5vh, 2rem)', maxWidth: 'min(90vw, 360px)', width: '100%', fontFamily: '"Courier New", monospace' }}>
            <div style={{ color: '#4ade80', marginBottom: 'clamp(1rem, 3vh, 1.5rem)', fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', lineHeight: 1.6 }}>{`> CONFIRM EXIT\n> ALL MESSAGES WILL BE DESTROYED\n> THIS CANNOT BE UNDONE`}</div>
            <div style={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
              <button onClick={() => setShowExitConfirm(false)} style={{ flex: 1, padding: 'clamp(0.5rem, 2vh, 0.625rem)', background: 'transparent', color: '#4ade80', border: '1px solid #4ade80', fontFamily: '"Courier New", monospace', fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)', cursor: 'pointer' }}>[STAY]</button>
              <button onClick={handleExit} style={{ flex: 1, padding: 'clamp(0.5rem, 2vh, 0.625rem)', background: '#f87171', color: '#000', border: 'none', fontFamily: '"Courier New", monospace', fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)', cursor: 'pointer', fontWeight: 'bold' }}>[EXIT & WIPE]</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
