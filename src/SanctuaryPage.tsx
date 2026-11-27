import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from './store'
import { HomeIcon, RoomsIcon, ThreadsIcon, PlayDatesIcon, ResourcesIcon, SettingsIcon } from './icons'

const ROOMS = [
  { id: 'recovery', name: 'Recovery Circle', color: '#8ba888', desc: 'For those walking the path' },
  { id: 'parenting', name: 'Parenting Post', color: '#c2a06b', desc: 'Single dads, new moms, all parents' },
  { id: 'veteran', name: 'Veteran Ground', color: '#9a8fa8', desc: 'Coming home, finding peace' },
  { id: 'grief', name: 'Grief Harbor', color: '#a88383', desc: 'Loss, remembrance, healing' },
  { id: 'quiet', name: 'Quiet Corner', color: '#8299b3', desc: 'Social anxiety, introverts welcome' },
  { id: 'green', name: 'Green Room', color: '#6f9a8a', desc: 'Cannabis-friendly, chill vibes' },
  { id: 'night', name: 'Night Watch', color: '#9a8f7d', desc: 'Insomnia, night owls, 3am thoughts' },
  { id: 'new', name: 'New Beginnings', color: '#93a06f', desc: 'Pregnancy, new chapters, fresh starts' },
]

const NAV_ITEMS = [
  { path: '/sanctuary', label: 'Home', icon: <HomeIcon /> },
  { path: '/rooms', label: 'Rooms', icon: <RoomsIcon /> },
  { path: '/threads', label: 'Threads', icon: <ThreadsIcon /> },
  { path: '/playdates', label: 'Play Dates', icon: <PlayDatesIcon /> },
  { path: '/resources', label: 'Resources', icon: <ResourcesIcon /> },
  { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{identity.soulEmoji}</span>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'var(--serif)' }}>
                {identity.soulName}
                {identity.tagline && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--faint)', fontWeight: 400, marginLeft: '0.5rem', fontStyle: 'italic' }}>
                    "{identity.tagline}"
                  </span>
                )}
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--faint)' }}>
                {identity.feeling ? `feeling ${identity.feeling.toLowerCase()}` : 'Your sanctuary awaits'}
              </p>
            </div>
          </div>
          <button onClick={clearIdentity} style={{ padding: '0.5rem', background: 'transparent', color: 'var(--faint)', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
            Sign out
          </button>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
            How is today feeling? <span style={{ color: 'var(--faint)' }}>(optional)</span>
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {FEELINGS.map(mood => (
              <button
                key={mood}
                onClick={() => setFeeling(mood)}
                style={{
                  padding: '0.375rem 0.875rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  background: identity.feeling === mood ? 'var(--accent-soft)' : 'var(--surface-2)',
                  color: identity.feeling === mood ? 'var(--accent)' : 'var(--muted)',
                  border: identity.feeling === mood ? '1px solid var(--accent)' : '1px solid var(--line)',
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
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              borderRadius: '6px',
              color: 'var(--text)',
              fontSize: '0.75rem',
              outline: 'none',
            }}
          />
          <p style={{ fontSize: '0.625rem', color: 'var(--faint)', marginTop: '0.25rem', textAlign: 'right' }}>
            {(identity.tagline || '').length}/30
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--serif)' }}>Healing Rooms</h2>
            <button onClick={() => navigate('/rooms')} style={{ fontSize: '0.875rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {ROOMS.map(room => (
              <button
                key={room.id}
                onClick={() => navigate(`/room/${room.id}`)}
                style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', padding: '1rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = room.color }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: room.color, flexShrink: 0, marginTop: '0.35rem' }} />
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: room.color }}>{room.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--faint)', marginTop: '0.25rem' }}>{room.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <button onClick={() => navigate('/threads')} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', padding: '1rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Threads & Boards</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--faint)' }}>Share stories, ask questions</p>
            </div>
          </button>
          <button onClick={() => navigate('/playdates')} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', padding: '1rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Adult Play Dates</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--faint)' }}>Walks, coffee, skill shares</p>
            </div>
          </button>
          <button onClick={() => navigate('/resources')} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', padding: '1rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Crisis & Resources</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--faint)' }}>Hotlines, therapy, support</p>
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
          color: 'transparent',
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
        <div data-theme="dark" style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          background: 'rgba(0,0,0,0.95)',
        }}>
          <div style={{
            background: 'var(--bg)',
            border: '1px solid var(--accent)',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            fontFamily: 'var(--sans)',
          }}>
            <div style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
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
                background: 'var(--bg)',
                color: 'var(--accent)',
                border: 'none',
                borderBottom: '1px solid var(--accent)',
                padding: '0.5rem 0',
                fontFamily: 'var(--sans)',
                fontSize: '0.875rem',
                outline: 'none',
                marginBottom: '1rem',
              }}
            />
            {gateError && (
              <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginBottom: '1rem' }}>
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
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  fontFamily: 'var(--sans)',
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
                  background: 'var(--accent)',
                  color: 'var(--accent-ink)',
                  border: 'none',
                  fontFamily: 'var(--sans)',
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

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--surface)', borderTop: '1px solid var(--line)', padding: '0.5rem', zIndex: 50 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'space-around' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '0.5rem', background: 'none', border: 'none', color: item.path === '/sanctuary' ? 'var(--accent)' : 'var(--faint)', fontSize: '0.625rem', cursor: 'pointer' }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
