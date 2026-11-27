import { useNavigate } from 'react-router-dom'

const ALL_ROOMS = [
  { id: 'recovery', name: 'Recovery Circle', color: '#8ba888', desc: 'For those walking the path of recovery. All stages welcome.', category: 'Healing', members: 24 },
  { id: 'parenting', name: 'Parenting Post', color: '#c2a06b', desc: 'Single dads, new moms, tired parents — you are seen.', category: 'Support', members: 18 },
  { id: 'veteran', name: 'Veteran Ground', color: '#9a8fa8', desc: 'Coming home, finding peace. Military and first responders.', category: 'Support', members: 12 },
  { id: 'grief', name: 'Grief Harbor', color: '#a88383', desc: 'Loss, remembrance, healing. Hold what you need to hold.', category: 'Healing', members: 31 },
  { id: 'quiet', name: 'Quiet Corner', color: '#8299b3', desc: 'Social anxiety, introverts, and those who need low pressure.', category: 'Social', members: 45 },
  { id: 'green', name: 'Green Room', color: '#6f9a8a', desc: 'Cannabis-friendly, chill vibes. No judgment, just peace.', category: 'Social', members: 22 },
  { id: 'night', name: 'Night Watch', color: '#9a8f7d', desc: 'Insomnia, night owls, 3am thoughts. You are not alone.', category: 'Social', members: 38 },
  { id: 'new', name: 'New Beginnings', color: '#93a06f', desc: 'Pregnancy, new chapters, fresh starts. Every sunrise counts.', category: 'Healing', members: 15 },
]

export default function RoomsPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        <button onClick={() => navigate('/sanctuary')} style={{ marginBottom: '1rem', padding: '0.5rem', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.875rem' }}>← Back</button>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--serif)', marginBottom: '0.5rem' }}>Healing Rooms</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Find your people. Every room is a safe harbor.</p>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {ALL_ROOMS.map(room => (
            <button
              key={room.id}
              onClick={() => navigate(`/room/${room.id}`)}
              style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', padding: '1.25rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = room.color }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)' }}
            >
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: room.color, flexShrink: 0, marginTop: '0.4rem' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: room.color }}>{room.name}</h3>
                  <span style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem', background: 'var(--surface-2)', borderRadius: '6px', color: 'var(--faint)' }}>{room.category}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{room.desc}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--faint)' }}>{room.members} here now</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}