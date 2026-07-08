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

export default function SanctuaryPage() {
  const navigate = useNavigate()
  const { identity, clearIdentity } = useStore()

  if (!identity) {
    navigate('/')
    return null
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0a', color: '#e8ede6', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{identity.soulEmoji}</span>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'Georgia, serif' }}>Welcome, {identity.soulName}</h1>
              <p style={{ fontSize: '0.75rem', color: '#6b7a66' }}>Your sanctuary awaits</p>
            </div>
          </div>
          <button onClick={clearIdentity} style={{ padding: '0.5rem', background: 'transparent', color: '#6b7a66', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
            🚪 Logout
          </button>
        </div>

        <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#a8b5a3', marginBottom: '0.75rem' }}>✨ How is today feeling? <span style={{ color: '#6b7a66' }}>(optional)</span></p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['Okay', 'Struggling', 'Hopeful', 'Lonely', 'Grateful', 'Overwhelmed', 'Excited', 'Tired'].map(mood => (
              <button key={mood} style={{ padding: '0.375rem 0.875rem', borderRadius: '999px', fontSize: '0.75rem', background: '#0a0f0a', color: '#a8b5a3', border: '1px solid #2d4a2a', cursor: 'pointer' }}>
                {mood}
              </button>
            ))}
          </div>
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