import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, genIdentity } from './store'
import HavenMark from './HavenMark'

const COLORS = ['#8ba888', '#c2a06b', '#9a8fa8', '#a88383', '#8299b3', '#6f9a8a', '#9a8f7d', '#93a06f']
const EMOJIS = ['🌿', '🌙', '🔥', '💧', '🍃', '🌻', '🦋', '🐢', '🌲', '🌊']

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { setIdentity } = useStore()
  const [name, setName] = useState(() => genIdentity().soulName)
  const [color, setColor] = useState(COLORS[0])
  const [emoji, setEmoji] = useState(EMOJIS[0])

  const regenerate = () => {
    const id = genIdentity()
    setName(id.soulName)
    setColor(id.soulColor)
    setEmoji(id.soulEmoji)
  }

  const proceed = () => {
    setIdentity({ soulName: name, soulColor: color, soulEmoji: emoji, createdAt: Date.now(), isAnonymous: true })
    navigate('/sanctuary')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg)', color: 'var(--text)' }}>
      <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <HavenMark size={40} color="var(--accent)" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--serif)', marginBottom: '0.5rem' }}>Your Soul Name</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>This is how others will know you. No real names needed.</p>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1rem', background: color + '20', border: `2px solid ${color}50` }}>
            {emoji}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color, marginBottom: '0.5rem', fontFamily: 'var(--serif)' }}>{name}</h2>
          <button onClick={regenerate} style={{ fontSize: '0.75rem', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.5rem' }}>Generate Another</button>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--faint)', marginBottom: '0.5rem' }}>Choose your color</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, border: color === c ? '2px solid var(--text)' : 'none', cursor: 'pointer', transform: color === c ? 'scale(1.1)' : 'scale(1)' }} />
              ))}
            </div>
          </div>

          <button onClick={proceed} style={{ width: '100%', padding: '0.875rem', background: 'var(--accent-deep)', color: 'var(--accent-ink)', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}>
            Enter Sanctuary →
          </button>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--faint)' }}>Your identity is stored only on this device.</p>
      </div>
    </div>
  )
}