import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useStore } from './store'
import { io, Socket } from 'socket.io-client'
import type { Message } from './types'

const ROOM_META: Record<string, { name: string; color: string; welcome: string }> = {
  recovery: { name: 'Recovery Circle', color: '#8ba888', welcome: 'Every step matters, including the ones that feel backwards.' },
  parenting: { name: 'Parenting Post', color: '#c2a06b', welcome: 'Single dads, new moms, tired parents — you are seen.' },
  veteran: { name: 'Veteran Ground', color: '#9a8fa8', welcome: 'Welcome home. This ground is steady.' },
  grief: { name: 'Grief Harbor', color: '#a88383', welcome: 'Hold what you need to hold.' },
  quiet: { name: 'Quiet Corner', color: '#8299b3', welcome: 'No need to perform here.' },
  green: { name: 'Green Room', color: '#6f9a8a', welcome: 'Chill vibes, good people.' },
  night: { name: 'Night Watch', color: '#9a8f7d', welcome: '3am thoughts welcome.' },
  new: { name: 'New Beginnings', color: '#93a06f', welcome: 'Every sunrise is a fresh start.' },
  sanctuary: { name: 'The Sanctuary', color: '#8ba888', welcome: 'Authorized souls only. Be kind. Be real.' },
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function RoomChatPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { identity } = useStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [connected, setConnected] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)

  const room = roomId ? ROOM_META[roomId] : null

  useEffect(() => {
    if (!roomId || !identity) return

    const socket = io(API_URL, { transports: ['websocket', 'polling'] })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      socket.emit('join-room', {
        roomId,
        soulName: identity.soulName,
        soulColor: identity.soulColor,
        feeling: identity.feeling,
        tagline: identity.tagline,
      })
    })

    socket.on('disconnect', () => setConnected(false))

    socket.on('message', (msg: Message) => {
      setMessages(prev => {
        if (prev.find(m => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    })

    socket.on('typing', () => {
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 3000)
    })

    return () => {
      socket.emit('leave-room', { roomId })
      socket.disconnect()
    }
  }, [roomId, identity])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  if (!room || !identity) {
    navigate('/sanctuary')
    return null
  }

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return
    socketRef.current.emit('send-message', {
      roomId,
      soulName: identity.soulName,
      soulColor: identity.soulColor,
      content: input.trim(),
      type: 'text',
      feeling: identity.feeling,
      tagline: identity.tagline,
    })
    socketRef.current.emit('typing', { roomId, soulName: identity.soulName })
    setInput('')
  }

  const msgStyle = (isMe: boolean) => ({
    padding: '0.625rem 1rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    lineHeight: 1.5,
    background: isMe ? 'var(--accent-deep)' : 'var(--surface)',
    color: isMe ? 'var(--accent-ink)' : 'var(--text)',
  })

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', color: 'var(--text)' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'var(--surface)', borderBottom: '1px solid var(--line)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 20 }}>
        <button onClick={() => navigate('/rooms')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.25rem' }}>←</button>
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: room.color, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{room.name}</h1>
          <p style={{ fontSize: '0.625rem', color: 'var(--faint)' }}>
            {connected ? '● Connected' : '● Disconnected'} · {messages.length > 0 ? 'active' : 'joining...'}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '60px', padding: '0.75rem 1rem', background: 'var(--surface)', fontSize: '0.75rem', color: 'var(--muted)', borderBottom: '1px solid var(--line)' }}>
        {room.welcome}
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--faint)', fontSize: '0.875rem' }}>
            No messages yet. Say hello.
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.soulName === identity.soulName
          return (
            <div key={msg.id} style={{ display: 'flex', gap: '0.75rem', flexDirection: isMe ? 'row-reverse' : 'row' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 600, flexShrink: 0, background: msg.soulColor + '30', color: msg.soulColor }}>
                {msg.soulName[0]}
              </div>
              <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 600, color: msg.soulColor }}>{msg.soulName}</span>
                  {msg.tagline && (
                    <span style={{ fontSize: '0.625rem', color: 'var(--faint)', fontStyle: 'italic' }}>"{msg.tagline}"</span>
                  )}
                  {msg.feeling && (
                    <span style={{ fontSize: '0.625rem', color: msg.soulColor + 'aa' }}>— {msg.feeling}</span>
                  )}
                  <span style={{ fontSize: '0.625rem', color: 'var(--faint)' }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={msgStyle(isMe)}>
                  {msg.content}
                </div>
              </div>
            </div>
          )
        })}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--faint)' }}>
            <span>●</span><span>●</span><span>●</span> Someone is typing...
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--line)', padding: '0.75rem', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Share what is on your heart..."
            rows={1}
            style={{ flex: 1, padding: '0.625rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.875rem', outline: 'none', resize: 'none', minHeight: '40px' }}
          />
          <button onClick={sendMessage} disabled={!input.trim() || !connected} style={{ padding: '0.625rem 1rem', background: 'var(--accent-deep)', color: 'var(--accent-ink)', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', opacity: input.trim() && connected ? 1 : 0.4 }}>
            Send
          </button>
        </div>
        <p style={{ fontSize: '0.625rem', color: 'var(--faint)', textAlign: 'center', marginTop: '0.5rem' }}>
          Messages are saved to the database. Be kind.
        </p>
      </div>
    </div>
  )
}
