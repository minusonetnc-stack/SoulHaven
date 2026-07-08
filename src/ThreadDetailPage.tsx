import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from './store'
import { useState, useEffect } from 'react'
import type { Thread } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const timeAgo = (ts: number | string) => {
  const date = typeof ts === 'string' ? new Date(ts) : new Date(ts)
  const s = Math.floor((Date.now() - date.getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function ThreadDetailPage() {
  const { threadId } = useParams<{ threadId: string }>()
  const navigate = useNavigate()
  const { identity } = useStore()
  const [reply, setReply] = useState('')
  const [thread, setThread] = useState<Thread | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!threadId) return
    fetchThread()
  }, [threadId])

  const fetchThread = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/threads/${threadId}`)
      const data = await res.json()
      setThread(data)
    } catch (err) {
      console.error('Failed to load thread:', err)
    } finally {
      setLoading(false)
    }
  }

  const postReply = async () => {
    if (!reply.trim() || !threadId) return
    try {
      const res = await fetch(`${API_URL}/api/threads/${threadId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: identity?.soulName || 'Anonymous',
          authorColor: identity?.soulColor || '#7fb069',
          content: reply,
        })
      })
      if (res.ok) {
        setReply('')
        fetchThread()
      }
    } catch (err) {
      console.error('Failed to post reply:', err)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f0a', color: '#e8ede6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7a66' }}>Loading thread...</p>
      </div>
    )
  }

  if (!thread) {
    navigate('/threads')
    return null
  }

  const replies = thread.replies || []

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0a', color: '#e8ede6', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1.5rem' }}>
        <button onClick={() => navigate('/threads')} style={{ marginBottom: '1rem', padding: '0.5rem', background: 'none', border: 'none', color: '#a8b5a3', cursor: 'pointer' }}>← Back</button>

        <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0, background: thread.authorColor + '20', color: thread.authorColor }}>
              {thread.author[0]}
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'Georgia, serif', marginBottom: '0.25rem' }}>{thread.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.625rem', color: '#6b7a66' }}>
                <span style={{ color: thread.authorColor }}>{thread.author}</span>
                <span>•</span>
                <span>{timeAgo(thread.createdAt || thread.created_at)}</span>
              </div>
            </div>
          </div>
          <p style={{ color: '#a8b5a3', lineHeight: 1.6 }}>{thread.content}</p>
        </div>

        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#a8b5a3' }}>💬 {replies.length} Replies</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {replies.map((r: any) => (
            <div key={r.id} style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 600, flexShrink: 0, background: r.authorColor + '20', color: r.authorColor }}>
                  {r.author[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: r.authorColor }}>{r.author}</span>
                    <span style={{ fontSize: '0.625rem', color: '#6b7a66' }}>{timeAgo(r.createdAt || r.created_at)}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#a8b5a3' }}>{r.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder="Add your voice..."
            style={{ flex: 1, padding: '0.625rem', background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '12px', color: '#e8ede6', outline: 'none' }}
            onKeyDown={e => e.key === 'Enter' && postReply()}
          />
          <button onClick={postReply} disabled={!reply.trim()} style={{ padding: '0.625rem 1rem', background: '#5a8a52', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', opacity: reply.trim() ? 1 : 0.4 }}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}