import { useNavigate } from 'react-router-dom'
import { useStore, genIdentity } from './store'

export default function LandingPage() {
  const navigate = useNavigate()
  const { identity, setIdentity, isOnboarded } = useStore()

  const enter = () => {
    if (!identity) setIdentity(genIdentity())
    navigate('/sanctuary')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#0a0f0a', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
      <h1 style={{ fontSize: '3rem', fontWeight: 600, background: 'linear-gradient(90deg, #7fb069, #c4a86b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Georgia, serif', marginBottom: '1rem' }}>SoulHaven</h1>
      <p style={{ fontSize: '1.125rem', color: '#a8b5a3', maxWidth: '400px', marginBottom: '2.5rem', lineHeight: 1.6 }}>
        A quiet place to find your people. No judgment. No pressure. Just humans being human together.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', maxWidth: '600px', width: '100%', marginBottom: '2.5rem' }}>
        <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem', textAlign: 'left' }}>
          <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🛡️</div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>No Data Stored</h3>
          <p style={{ fontSize: '0.75rem', color: '#6b7a66' }}>Your soul name lives only on your device.</p>
        </div>
        <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem', textAlign: 'left' }}>
          <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>💚</div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>All Welcome</h3>
          <p style={{ fontSize: '0.75rem', color: '#6b7a66' }}>Recovery, grief, parenthood, anxiety — whatever brought you here.</p>
        </div>
        <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem', textAlign: 'left' }}>
          <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🤝</div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>Real Connection</h3>
          <p style={{ fontSize: '0.75rem', color: '#6b7a66' }}>Chat rooms, threads, and play dates.</p>
        </div>
      </div>

      <button
        onClick={enter}
        style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', background: '#5a8a52', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 500 }}
        onMouseEnter={e => (e.target as HTMLButtonElement).style.background = '#7fb069'}
        onMouseLeave={e => (e.target as HTMLButtonElement).style.background = '#5a8a52'}
      >
        {isOnboarded ? 'Return to Sanctuary →' : 'Enter Sanctuary →'}
      </button>
      <p style={{ fontSize: '0.75rem', color: '#6b7a66', marginTop: '1rem' }}>
        {isOnboarded && identity ? `Welcome back, ${identity.soulName}` : 'No signup. No email. Just a gentle name and a warm room.'}
      </p>
    </div>
  )
}