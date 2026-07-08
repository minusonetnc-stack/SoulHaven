import { useNavigate } from 'react-router-dom'

const ALL_ROOMS = [
  { id: 'recovery', name: 'Recovery Circle', emoji: '🌱', color: '#7fb069', desc: 'For those walking the path of recovery. All stages welcome.', category: 'Healing', members: 24 },
  { id: 'parenting', name: 'Parenting Post', emoji: '🍼', color: '#c4a86b', desc: 'Single dads, new moms, tired parents — you are seen.', category: 'Support', members: 18 },
  { id: 'veteran', name: 'Veteran Ground', emoji: '🎖️', color: '#8b7b9e', desc: 'Coming home, finding peace. Military and first responders.', category: 'Support', members: 12 },
  { id: 'grief', name: 'Grief Harbor', emoji: '🕯️', color: '#9e7b7b', desc: 'Loss, remembrance, healing. Hold what you need to hold.', category: 'Healing', members: 31 },
  { id: 'quiet', name: 'Quiet Corner', emoji: '🫧', color: '#7b9ec4', desc: 'Social anxiety, introverts, and those who need low pressure.', category: 'Social', members: 45 },
  { id: 'green', name: 'Green Room', emoji: '🌲', color: '#6b9e8e', desc: 'Cannabis-friendly, chill vibes. No judgment, just peace.', category: 'Social', members: 22 },
  { id: 'night', name: 'Night Watch', emoji: '🌙', color: '#9e8b7b', desc: 'Insomnia, night owls, 3am thoughts. You are not alone.', category: 'Social', members: 38 },
  { id: 'new', name: 'New Beginnings', emoji: '☀️', color: '#8b9e7b', desc: 'Pregnancy, new chapters, fresh starts. Every sunrise counts.', category: 'Healing', members: 15 },
]

export default function RoomsPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0a', color: '#e8ede6', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        <button onClick={() => navigate('/sanctuary')} style={{ marginBottom: '1rem', padding: '0.5rem', background: 'none', border: 'none', color: '#a8b5a3', cursor: 'pointer', fontSize: '0.875rem' }}>← Back</button>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#7fb069', fontFamily: 'Georgia, serif', marginBottom: '0.5rem' }}>💬 Healing Rooms</h1>
        <p style={{ color: '#a8b5a3', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Find your people. Every room is a safe harbor.</p>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {ALL_ROOMS.map(room => (
            <button
              key={room.id}
              onClick={() => navigate(`/room/${room.id}`)}
              style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = room.color }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2d4a2a' }}
            >
              <span style={{ fontSize: '2rem' }}>{room.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: room.color }}>{room.name}</h3>
                  <span style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem', background: '#0a0f0a', borderRadius: '999px', color: '#6b7a66' }}>{room.category}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#a8b5a3', marginBottom: '0.5rem' }}>{room.desc}</p>
                <span style={{ fontSize: '0.75rem', color: '#6b7a66' }}>👥 {room.members} here now</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}