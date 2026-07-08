import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PlayDate } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const TYPE_ICONS: Record<string, string> = { walk: '🚶', coffee: '☕', game: '🎲', skill: '🎓', other: '🌟' }

export default function PlayDatesPage() {
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)
  const [dates, setDates] = useState<PlayDate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDates()
  }, [])

  const fetchDates = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/playdates`)
      const data = await res.json()
      setDates(data)
    } catch (err) {
      console.error('Failed to load play dates:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0a', color: '#e8ede6', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button onClick={() => navigate('/sanctuary')} style={{ padding: '0.5rem', background: 'none', border: 'none', color: '#a8b5a3', cursor: 'pointer' }}>← Back</button>
          <button onClick={() => setShowNew(true)} style={{ padding: '0.5rem 1rem', background: '#5a8a52', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>+ Host One</button>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#c4a86b', fontFamily: 'Georgia, serif', marginBottom: '0.5rem' }}>📅 Adult Play Dates</h1>
        <p style={{ color: '#a8b5a3', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Low-pressure hangouts. Walks, coffee, games, skill shares — find your people offline too.</p>

        {showNew && (
          <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.25rem' }}>Host a Play Date</h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7a66', marginBottom: '0.75rem' }}>All fields are optional. Keep it gentle.</p>
            <input placeholder="What are you planning?" style={{ width: '100%', padding: '0.625rem', background: '#0a0f0a', border: '1px solid #2d4a2a', borderRadius: '8px', color: '#e8ede6', marginBottom: '0.5rem' }} />
            <input placeholder="Where?" style={{ width: '100%', padding: '0.625rem', background: '#0a0f0a', border: '1px solid #2d4a2a', borderRadius: '8px', color: '#e8ede6', marginBottom: '0.5rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input type="datetime-local" style={{ flex: 1, padding: '0.625rem', background: '#0a0f0a', border: '1px solid #2d4a2a', borderRadius: '8px', color: '#e8ede6' }} />
              <input type="number" placeholder="Max people" style={{ width: '100px', padding: '0.625rem', background: '#0a0f0a', border: '1px solid #2d4a2a', borderRadius: '8px', color: '#e8ede6' }} />
            </div>
            <textarea placeholder="Describe the vibe..." rows={3} style={{ width: '100%', padding: '0.625rem', background: '#0a0f0a', border: '1px solid #2d4a2a', borderRadius: '8px', color: '#e8ede6', marginBottom: '0.5rem', resize: 'none' }} />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowNew(false)} style={{ padding: '0.5rem 1rem', background: '#1a2e18', color: '#a8b5a3', borderRadius: '8px', border: '1px solid #2d4a2a', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowNew(false)} style={{ padding: '0.5rem 1rem', background: '#5a8a52', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Create</button>
            </div>
          </div>
        )}

        {loading && <p style={{ color: '#6b7a66', textAlign: 'center', padding: '2rem' }}>Loading play dates...</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {dates.map((date: any) => (
            <div key={date.id} style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>{TYPE_ICONS[date.type] || '🌟'}</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>{date.title}</h3>
                  <p style={{ fontSize: '0.75rem', color: '#a8b5a3', marginBottom: '0.5rem' }}>{date.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.625rem', color: '#6b7a66' }}>
                    <span>📍 {date.location}</span>
                    <span>🕐 {new Date(date.date_time || date.dateTime).toLocaleString()}</span>
                    <span>👥 {(date.participants?.length || 0)}/{date.max_participants || date.maxParticipants}</span>
                  </div>
                </div>
              </div>
              <button style={{ width: '100%', padding: '0.625rem', background: '#1a2e18', color: '#e8ede6', border: '1px solid #2d4a2a', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>Join</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}