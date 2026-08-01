import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

export default function LandingPage() {
  const navigate = useNavigate()
  const [knockCount, setKnockCount] = useState(0)
  const [showGate, setShowGate] = useState(false)
  const [passphrase, setPassphrase] = useState('')
  const [gateError, setGateError] = useState('')
  const [isCleanMode, setIsCleanMode] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<'inner-sanctum' | 'cleanroom'>('inner-sanctum')
  const knockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (knockCount > 0) {
      if (knockTimerRef.current) clearTimeout(knockTimerRef.current)
      knockTimerRef.current = setTimeout(() => setKnockCount(0), 1500)
    }
    if (knockCount >= 3) {
      setKnockCount(0)
      setIsCleanMode(true)
      setTimeout(() => setShowGate(true), 600)
    }
    return () => {
      if (knockTimerRef.current) clearTimeout(knockTimerRef.current)
    }
  }, [knockCount])

  const handleGate = () => {
    const p = passphrase.trim()
    if (!p) return
    if (selectedRoom === 'cleanroom' && p === 'soulhaven-clean') {
      setShowGate(false); setPassphrase(''); setGateError(''); setIsCleanMode(false)
      navigate('/cleanroom')
    } else if (selectedRoom === 'inner-sanctum' && p === 'soulhaven-sanctum') {
      setShowGate(false); setPassphrase(''); setGateError(''); setIsCleanMode(false)
      navigate('/inner-sanctum')
    } else {
      setGateError('> ACCESS DENIED')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0f0a', color: '#e8ede6', padding: '1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237fb069' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, pointerEvents: 'none' }} />
      
      <div onClick={() => setKnockCount(prev => prev + 1)} style={{ position: 'relative', zIndex: 10, cursor: 'default', transition: 'all 0.6s ease', opacity: isCleanMode ? 0 : 1, transform: isCleanMode ? 'scale(0.8)' : 'scale(1)', userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 30px rgba(127, 176, 105, 0.3))' }}>🌿</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 300, fontFamily: 'Georgia, serif', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>SoulHaven</h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7a66', maxWidth: '400px', margin: '0 auto' }}>A quiet place for heavy hearts</p>
        
        <div style={{ marginTop: '1rem', height: '16px', fontSize: '1rem', lineHeight: 1, color: knockCount === 0 ? 'transparent' : knockCount === 1 ? '#1a3a1a' : '#4ade80', textShadow: knockCount >= 2 ? '0 0 12px #4ade80' : 'none', opacity: knockCount > 0 ? 1 : 0, transition: 'all 0.2s ease', userSelect: 'none' }}>.</div>
      </div>

      {isCleanMode && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20, textAlign: 'center', animation: 'cleanFadeIn 0.8s ease-out forwards' }}>
          <img src="/soulhaven-logo.jpg" alt="SoulHaven" style={{ width: '120px', height: '120px', marginBottom: '1rem', filter: 'drop-shadow(0 0 30px rgba(74, 222, 128, 0.4))', borderRadius: '4px' }} />
          <h1 style={{ fontFamily: '"Courier New", monospace', fontSize: '1.5rem', color: '#4ade80', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 300, textShadow: '0 0 20px rgba(74, 222, 128, 0.3)' }}>SoulHaven</h1>
          <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.625rem', color: '#4ade80', opacity: 0.6, letterSpacing: '0.3em', marginTop: '0.5rem' }}>SECURE ACCESS</p>
        </div>
      )}

      <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '300px', opacity: isCleanMode ? 0 : 1, transition: 'opacity 0.5s', pointerEvents: isCleanMode ? 'none' : 'auto' }}>
        <button onClick={() => navigate('/welcome')} style={{ width: '100%', padding: '0.875rem', background: '#5a8a52', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}>Enter Sanctuary</button>
        <p style={{ fontSize: '0.75rem', color: '#6b7a66' }}>No accounts. No tracking. Just presence.</p>
      </div>

      <div onClick={() => { setIsCleanMode(true); setTimeout(() => setShowGate(true), 400) }} style={{ position: 'fixed', bottom: '0', right: '0', width: '120px', height: '120px', cursor: 'default', zIndex: 5, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '2rem' }}>
        <span style={{ color: '#0a0f0a', fontSize: '2rem', userSelect: 'none' }}>.</span>
      </div>

      {showGate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: '#000', border: '1px solid #4ade80', borderRadius: '2px', padding: '2.5rem', maxWidth: '420px', width: '100%', fontFamily: '"Courier New", monospace' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <img src="/soulhaven-logo.jpg" alt="SoulHaven" style={{ width: '64px', height: '64px', marginBottom: '0.75rem', filter: 'drop-shadow(0 0 15px rgba(74, 222, 128, 0.3))', borderRadius: '2px' }} />
              <div style={{ color: '#4ade80', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{`> SECURE ACCESS GATE\n> AUTHORIZATION REQUIRED`}</div>
            </div>
            <div style={{ color: '#4ade80', fontSize: '0.625rem', marginBottom: '0.5rem', letterSpacing: '0.1em', opacity: 0.7 }}>{`> SELECT DESTINATION:`}</div>
            <select value={selectedRoom} onChange={e => setSelectedRoom(e.target.value as 'inner-sanctum' | 'cleanroom')} style={{ width: '100%', background: '#000', color: '#4ade80', border: '1px solid #4ade80', padding: '0.5rem', fontFamily: '"Courier New", monospace', fontSize: '0.875rem', marginBottom: '1.5rem', outline: 'none', cursor: 'pointer' }}>
              <option value="inner-sanctum">INNER SANCTUM</option>
              <option value="cleanroom">CLEAN ROOM</option>
            </select>
            <div style={{ color: '#4ade80', fontSize: '0.625rem', marginBottom: '0.5rem', letterSpacing: '0.1em', opacity: 0.7 }}>{`> ENTER PASSPHRASE:`}</div>
            <input type="password" value={passphrase} onChange={e => setPassphrase(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleGate()} autoFocus style={{ width: '100%', background: '#000', color: '#4ade80', border: 'none', borderBottom: '1px solid #4ade80', padding: '0.75rem 0', fontFamily: '"Courier New", monospace', fontSize: '1rem', outline: 'none', marginBottom: '1.5rem', letterSpacing: '0.1em' }} />
            {gateError && <div style={{ color: '#f87171', fontSize: '0.75rem', marginBottom: '1rem' }}>{gateError}</div>}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => { setShowGate(false); setIsCleanMode(false); setPassphrase(''); setGateError('') }} style={{ flex: 1, padding: '0.625rem', background: 'transparent', color: '#4ade80', border: '1px solid #4ade80', fontFamily: '"Courier New", monospace', fontSize: '0.75rem', cursor: 'pointer' }}>[ABORT]</button>
              <button onClick={handleGate} style={{ flex: 1, padding: '0.625rem', background: '#4ade80', color: '#000', border: 'none', fontFamily: '"Courier New", monospace', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>[ENTER]</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes cleanFadeIn { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); } 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } }`}</style>
    </div>
  )
}
