import { useState, useEffect } from 'react'
import { useStore } from './store'
import { useNavigate } from 'react-router-dom'
import type { Thread } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const CATEGORIES = ['All', 'Recovery', 'Parenting', 'Grief', 'Veteran', 'Night Watch', 'Social', 'General']

const timeAgo = (ts: number | string) => {
  if (!ts) return 'just now'
  const date = typeof ts === 'string' ? new Date(ts) : new Date(ts)
  if (isNaN(date.getTime())) return 'just now'
  const s = Math.floor((Date.now() - date.getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function ThreadsPage() {
  const navigate = useNavigate()
  const { identity } = useStore()
  const [activeCategory, setActiveCategory] = useState('All')
  const [showNew, setShowNew] = useState(false)
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')

  useEffect(() => {
    fetchThreads()
  }, [activeCategory])

  const fetchThreads = async () => {
    setLoading(true)
    setError('')
    try {
      const url = activeCategory === 'All'
        ? `${API_URL}/api/threads`
        : `${API_URL}/api/threads?category=${encodeURIComponent(activeCategory)}`
      const res = await fetch(url)
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Server error: ${res.status} ${errText}`)
      }
      const data = await res.json()
      const threadArray = Array.isArray(data) ? data : []
      setThreads(threadArray)
    } catch (err: any) {
      console.error('Failed to load threads:', err)
      setError(err.message || 'Failed to load threads')
      setThreads([])
    } finally {
      setLoading(false)
    }
  }

  const postThread = async () => {
    if (!newTitle.trim() || !newContent.trim()) return
    try {
      const res = await fetch(`${API_URL}/api/threads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          author: identity?.soulName || 'Anonymous',
          authorColor: identity?.soulColor || '#7fb069',
          category: activeCategory === 'All' ? 'General' : activeCategory,
        })
      })
      if (res.ok) {
        setNewTitle('')
        setNewContent('')
        setShowNew(false)
        fetchThreads()
      } else {
        const errText = await res.text()
        setError(`Failed to post: ${errText}`)
      }
    } catch (err: any) {
      console.error('Failed to post thread:', err)
      setError(err.message || 'Failed to post thread')
    }
  }

  const pinned = threads.filter(t => t.isPinned)
  const regular = threads.filter(t => !t.isPinned)
  const allThreads = [...pinned, ...regular]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0a', color: '#e8ede6', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button onClick={() => navigate('/sanctuary')} style={{ padding: '0.5rem', background: 'none', border: 'none', color: '#a8b5a3', cursor: 'pointer' }}>← Back</button>
          <button onClick={() => setShowNew(true)} style={{ padding: '0.5rem 1rem', background: '#5a8a52', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>+ New Thread</button>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#c4a86b', fontFamily: 'Georgia, serif', marginBottom: '0.5rem' }}>📖 Threads & Boards</h1>

        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '0.375rem 0.875rem', borderRadius: '999px', fontSize: '0.75rem', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', background: activeCategory === cat ? '#5a8a52' : '#1a2e18', color: activeCategory === cat ? 'white' : '#a8b5a3' }}>
              {cat}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: 'rgba(158,123,123,0.15)', border: '1px solid #3d2a2a', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', color: '#c4a86b', fontSize: '0.875rem' }}>
            ⚠️ {error}
            <button onClick={fetchThreads} style={{ marginLeft: '0.5rem', color: '#7fb069', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
          </div>
        )}

        {showNew && (
          <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>Start a New Thread</h3>
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="What is on your mind?"
              style={{ width: '100%', padding: '0.625rem', background: '#0a0f0a', border: '1px solid #2d4a2a', borderRadius: '8px', color: '#e8ede6', marginBottom: '0.5rem' }}
            />
            <textarea
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="Share your story..." rows={3}
              style={{ width: '100%', padding: '0.625rem', background: '#0a0f0a', border: '1px solid #2d4a2a', borderRadius: '8px', color: '#e8ede6', marginBottom: '0.5rem', resize: 'none' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowNew(false)} style={{ padding: '0.5rem 1rem', background: '#1a2e18', color: '#a8b5a3', borderRadius: '8px', border: '1px solid #2d4a2a', cursor: 'pointer' }}>Cancel</button>
              <button onClick={postThread} style={{ padding: '0.5rem 1rem', background: '#5a8a52', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Post</button>
            </div>
          </div>
        )}

        {loading && <p style={{ color: '#6b7a66', textAlign: 'center', padding: '2rem' }}>Loading threads...</p>}

        {!loading && allThreads.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7a66' }}>
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No threads yet</p>
            <p style={{ fontSize: '0.875rem' }}>Be the first to start a conversation 🌱</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {allThreads.map(thread => (
            <button key={thread.id} onClick={() => navigate(`/thread/${thread.id}`)} style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem', textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 600, flexShrink: 0, background: (thread.authorColor || '#7fb069') + '20', color: thread.authorColor || '#7fb069' }}>
                  {(thread.author || 'A')[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    {thread.isPinned && <span style={{ fontSize: '0.625rem' }}>📌</span>}
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{thread.title || 'Untitled'}</h3>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#a8b5a3', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{thread.content || ''}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.625rem', color: '#6b7a66' }}>
                    <span style={{ color: thread.authorColor || '#7fb069' }}>{thread.author || 'Anonymous'}</span>
                    <span>{timeAgo(thread.createdAt || thread.created_at)}</span>
                    <span>💬 {(thread.replyCount || thread.reply_count || thread.replies?.length || 0)} replies</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
