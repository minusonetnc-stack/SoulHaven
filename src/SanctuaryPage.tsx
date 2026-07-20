import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from './store'

const ROOMS = [
  { id: 'recovery', name: 'Recovery Circle', emoji: '🌱', color: '#7fb069', desc: 'For those walking the path' },
  { id: 'parenting', name: 'Parenting Post', emoji: '🍼', color: '#c4a86b', desc: 'Single dads, new moms, all parents' },
  { id: 'veteran', name: 'Veteran Ground', emoji: '🎖️', color: '#8b7b9e', desc: 'Coming home, finding peace' },
  { id: 'grief', name: 'Grief Harbor', emoji: '🕯️', color: '#9e7b7b', desc: 'Loss, remembrance, healing' },
  { id: 'quiet', name: 'Quiet Corner', emoji: '🫧', color: '#7b9ec4', desc: 'Social anxiety, introverts welcome' },
  { id: 'green', name: 'Green Room', emoji: '🌲', color: '#6b9e8e', desc: 'Cannabis-friendly, chill vibes' },
  { id: 'night', name: 'Night Watch', emoji: '🌙', color: '#9e8b7b', desc: 'Insomnia, night owls, 3am thoughts' },
  { id: 'new', name: 'New Beginnings', emoji: '☀️', color: '#8b9e7b', desc: 'Pregnancy, new chapters, fresh starts' },
]

const NAV_ITEMS = [
  { path: '/sanctuary', label: 'Home', icon: '🏠' },
  { path: '/rooms', label: 'Rooms', icon: '💬' },
  { path: '/threads', label: 'Threads', icon: '📖' },
  { path: '/playdates', label: 'Play Dates', icon: '📅' },
  { path: '/resources', label: 'Resources', icon: '❤️' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
]

const FEELINGS = ['Okay', 'Struggling', 'Hopeful', 'Lonely', 'Grateful', 'Overwhelmed', 'Excited', 'Tired']

export default function SanctuaryPage() {
  const navigate = useNavigate()
  const { identity, clearIdentity, setFeeling, setTagline } = useStore()
  const [showGate, setShowGate] = useState(false)
  const [passphrase, setPassphrase] = useState('')
  const [gateError, setGateError] = useState('')

  if (!identity) {
    navigate('/')
    return null
  }

  const handleGate = () => {
    const valid = passphrase.toLowerCase().trim()
    if (valid === 'haven' || valid === 'soulhaven2025') {
      setShowGate(false)
      setPassphrase('')
      setGateError('')
      navigate('/room/sanctuary')
    } else {
      setGateError('> ACCESS DENIED')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0a', color: '#e8ede6', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{identity.soulEmoji}</span>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'Georgia, serif' }}>
                {identity.soulName}
                {identity.tagline && (
                  <span style={{ fontSize: '0.75rem', color: '#6b7a66', fontWeight: 400, marginLeft: '0.5rem', fontStyle: 'italic' }}>
                    "{identity.tagline}"
                  </span>
                )}
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#6b7a66' }}>
                {identity.feeling ? `feeling ${identity.feeling.toLowerCase()}` : 'Your sanctuary awaits'}
              </p>
            </div>
          </div>
          <button onClick={clearIdentity} style={{ padding: '0.5rem', background: 'transparent', color: '#6b7a66', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
            🚪 Logout
          </button>
        </div>

        <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#a8b5a3', marginBottom: '0.75rem' }}>
            ✨ How is today feeling? <span style={{ color: '#6b7a66' }}>(optional)</span>
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {FEELINGS.map(mood => (
              <button
                key={mood}
                onClick={() => setFeeling(mood)}
                style={{
                  padding: '0.375rem 0.875rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  background: identity.feeling === mood ? (identity.soulColor + '40') : '#0a0f0a',
                  color: identity.feeling === mood ? identity.soulColor : '#a8b5a3',
                  border: identity.feeling === mood ? `1px solid ${identity.soulColor}` : '1px solid #2d4a2a',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: identity.feeling === mood ? 600 : 400,
                }}
              >
                {mood}
              </button>
            ))}
          </div>
          <input
            value={identity.tagline || ''}
            onChange={e => setTagline(e.target.value)}
            placeholder="Short tagline (e.g., 'just breathing')..."
            maxLength={30}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              background: '#0a0f0a',
              border: '1px solid #2d4a2a',
              borderRadius: '8px',
              color: '#e8ede6',
              fontSize: '0.75rem',
              outline: 'none',
            }}
          />
          <p style={{ fontSize: '0.625rem', color: '#6b7a66', marginTop: '0.25rem', textAlign: 'right' }}>
            {(identity.tagline || '').length}/30
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#7fb069', fontFamily: 'Georgia, serif' }}>💬 Healing Rooms</h2>
            <button onClick={() => navigate('/rooms')} style={{ fontSize: '0.875rem', color: '#7fb069', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {ROOMS.map(room => (
              <button
                key={room.id}
                onClick={() => navigate(`/room/${room.id}`)}
                style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = room.color; e.currentTarget.style.boxShadow = `0 0 20px ${room.color}15` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2d4a2a'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{room.emoji}</span>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: room.color }}>{room.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#6b7a66', marginTop: '0.25rem' }}>{room.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <button onClick={() => navigate('/threads')} style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📖</span>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Threads & Boards</h3>
              <p style={{ fontSize: '0.75rem', color: '#6b7a66' }}>Share stories, ask questions</p>
            </div>
          </button>
          <button onClick={() => navigate('/playdates')} style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📅</span>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Adult Play Dates</h3>
              <p style={{ fontSize: '0.75rem', color: '#6b7a66' }}>Walks, coffee, skill shares</p>
            </div>
          </button>
          <button onClick={() => navigate('/resources')} style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>❤️</span>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Crisis & Resources</h3>
              <p style={{ fontSize: '0.75rem', color: '#6b7a66' }}>Hotlines, therapy, support</p>
            </div>
          </button>
        </div>
      </div>

      <span
        onClick={() => { setShowGate(true); setGateError(''); setPassphrase('') }}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '12px',
          color: '#0d0d0d',
          fontSize: '10px',
          cursor: 'pointer',
          userSelect: 'none',
          zIndex: 40,
        }}
        title="."
      >
        .
      </span>

      {showGate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#000',
            border: '1px solid #0f0',
            borderRadius: '4px',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            fontFamily: '"Courier New", monospace',
          }}>
            <div style={{ color: '#0f0', marginBottom: '1rem', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {`> ACCESS SANCTUARY
> AUTHORIZATION REQUIRED
> ENTER PASSPHRASE:`}
            </div>
            <input
              type="password"
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGate()}
              autoFocus
              style={{
                width: '100%',
                background: '#000',
                color: '#0f0',
                border: 'none',
                borderBottom: '1px solid #0f0',
                padding: '0.5rem 0',
                fontFamily: '"Courier New", monospace',
                fontSize: '0.875rem',
                outline: 'none',
                marginBottom: '1rem',
              }}
            />
            {gateError && (
              <div style={{ color: '#f00', fontSize: '0.75rem', marginBottom: '1rem' }}>
                {gateError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setShowGate(false)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: 'transparent',
                  color: '#0f0',
                  border: '1px solid #0f0',
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                [ABORT]
              </button>
              <button
                onClick={handleGate}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: '#0f0',
                  color: '#000',
                  border: 'none',
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                [ENTER]
              </button>
            </div>
          </div>
        </div>
      )}

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(10,15,10,0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid #2d4a2a', padding: '0.5rem', zIndex: 50 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'space-around' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '0.5rem', background: 'none', border: 'none', color: item.path === '/sanctuary' ? '#7fb069' : '#6b7a66', fontSize: '0.625rem', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
