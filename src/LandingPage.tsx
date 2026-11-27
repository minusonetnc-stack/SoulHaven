import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useStore } from './store'
import HavenMark from './HavenMark'

export default function LandingPage() {
  const navigate = useNavigate()
  const { theme, setTheme } = useStore()
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)', padding: '1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div onClick={() => setKnockCount(prev => prev + 1)} style={{ position: 'relative', zIndex: 10, cursor: 'default', transition: 'all 0.6s ease', opacity: isCleanMode ? 0 : 1, transform: isCleanMode ? 'scale(0.8)' : 'scale(1)', userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}>
        <HavenMark size={64} color="var(--accent)" style={{ marginBottom: '1.75rem' }} />
        <h1 style={{ fontSize: '2.9rem', fontWeight: 400, fontFamily: 'var(--serif)', letterSpacing: '0.015em', lineHeight: 1.1, marginBottom: '0.9rem' }}>SoulHaven</h1>
        <p style={{ fontSize: '1.12rem', fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--muted)', maxWidth: '400px', margin: '0 auto' }}>A quiet place for heavy hearts</p>

        <div style={{ marginTop: '1rem', height: '16px', fontSize: '1rem', lineHeight: 1, color: knockCount === 0 ? 'transparent' : knockCount === 1 ? '#1a3a1a' : '#4ade80', textShadow: knockCount >= 2 ? '0 0 12px #4ade80' : 'none', opacity: knockCount > 0 ? 1 : 0, transition: 'all 0.2s ease', userSelect: 'none' }}>.</div>
      </div>

      {isCleanMode && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20, textAlign: 'center', animation: 'cleanFadeIn 0.8s ease-out forwards' }}>
          <img src="/soulhaven-logo.jpg" alt="SoulHaven" style={{ width: '120px', height: '120px', marginBottom: '1rem', borderRadius: '6px' }} />
          <h1 style={{ fontFamily: 'var(--sans)', fontSize: '1.5rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 300 }}>SoulHaven</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.625rem', color: 'var(--accent)', opacity: 0.6, letterSpacing: '0.3em', marginTop: '0.5rem' }}>SECURE ACCESS</p>
        </div>
      )}

      <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '300px', opacity: isCleanMode ? 0 : 1, transition: 'opacity 0.5s', pointerEvents: isCleanMode ? 'none' : 'auto' }}>
        <button onClick={() => navigate('/welcome')} style={{ width: '100%', padding: '0.95rem 2.75rem', background: 'var(--accent-deep)', color: 'var(--accent-ink)', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.01em' }}>Enter Sanctuary</button>
        <p style={{ fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--faint)', marginTop: '0.85rem' }}><b style={{ color: 'var(--muted)', fontWeight: 600 }}>No accounts.</b> &nbsp;·&nbsp; <b style={{ color: 'var(--muted)', fontWeight: 600 }}>No tracking.</b> &nbsp;·&nbsp; <b style={{ color: 'var(--muted)', fontWeight: 600 }}>Just presence.</b></p>
      </div>

      <div style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: '8px', overflow: 'hidden', marginTop: '2.5rem', opacity: isCleanMode ? 0 : 1, transition: 'opacity 0.5s', pointerEvents: isCleanMode ? 'none' : 'auto' }} role="group" aria-label="color mode">
        <button onClick={() => setTheme('dark')} style={{ border: 0, cursor: 'pointer', background: theme === 'dark' ? 'var(--accent-soft)' : 'transparent', color: theme === 'dark' ? 'var(--text)' : 'var(--muted)', fontFamily: 'var(--sans)', fontSize: '0.8rem', padding: '0.45rem 1rem', fontWeight: theme === 'dark' ? 600 : 400 }}>Dark</button>
        <button onClick={() => setTheme('light')} style={{ border: 0, borderLeft: '1px solid var(--line)', cursor: 'pointer', background: theme === 'light' ? 'var(--accent-soft)' : 'transparent', color: theme === 'light' ? 'var(--text)' : 'var(--muted)', fontFamily: 'var(--sans)', fontSize: '0.8rem', padding: '0.45rem 1rem', fontWeight: theme === 'light' ? 600 : 400 }}>Light</button>
      </div>

      <div style={{ marginTop: '4rem', paddingTop: '1.5rem', width: '100%', maxWidth: '520px', borderTop: '1px solid var(--line)', color: 'var(--faint)', fontSize: '0.82rem', opacity: isCleanMode ? 0 : 1, transition: 'opacity 0.5s' }}>
        A peer support community for recovery, grief, parenting, and the 3am thoughts — rooms, threads, and resources, held gently.
      </div>

      <div onClick={() => { setIsCleanMode(true); setTimeout(() => setShowGate(true), 400) }} style={{ position: 'fixed', bottom: '0', right: '0', width: '120px', height: '120px', cursor: 'default', zIndex: 5, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '2rem' }}>
        <span style={{ color: 'transparent', fontSize: '2rem', userSelect: 'none' }}>.</span>
      </div>

      {showGate && (
        <div data-theme="dark" style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.95)' }}>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--accent)', borderRadius: '8px', padding: '2.5rem', maxWidth: '420px', width: '100%', fontFamily: 'var(--sans)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <img src="/soulhaven-logo.jpg" alt="SoulHaven" style={{ width: '64px', height: '64px', marginBottom: '0.75rem', borderRadius: '6px' }} />
              <div style={{ color: 'var(--accent)', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{`> SECURE ACCESS GATE\n> AUTHORIZATION REQUIRED`}</div>
            </div>
            <div style={{ color: 'var(--accent)', fontSize: '0.625rem', marginBottom: '0.5rem', letterSpacing: '0.1em', opacity: 0.7 }}>{`> SELECT DESTINATION:`}</div>
            <select value={selectedRoom} onChange={e => setSelectedRoom(e.target.value as 'inner-sanctum' | 'cleanroom')} style={{ width: '100%', background: 'var(--bg)', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '0.5rem', fontFamily: 'var(--sans)', fontSize: '0.875rem', marginBottom: '1.5rem', outline: 'none', cursor: 'pointer' }}>
              <option value="inner-sanctum">INNER SANCTUM</option>
              <option value="cleanroom">CLEAN ROOM</option>
            </select>
            <div style={{ color: 'var(--accent)', fontSize: '0.625rem', marginBottom: '0.5rem', letterSpacing: '0.1em', opacity: 0.7 }}>{`> ENTER PASSPHRASE:`}</div>
            <input type="password" value={passphrase} onChange={e => setPassphrase(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleGate()} autoFocus style={{ width: '100%', background: 'var(--bg)', color: 'var(--accent)', border: 'none', borderBottom: '1px solid var(--accent)', padding: '0.75rem 0', fontFamily: 'var(--sans)', fontSize: '1rem', outline: 'none', marginBottom: '1.5rem', letterSpacing: '0.1em' }} />
            {gateError && <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginBottom: '1rem' }}>{gateError}</div>}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => { setShowGate(false); setIsCleanMode(false); setPassphrase(''); setGateError('') }} style={{ flex: 1, padding: '0.625rem', background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)', fontFamily: 'var(--sans)', fontSize: '0.75rem', cursor: 'pointer', borderRadius: '6px' }}>[ABORT]</button>
              <button onClick={handleGate} style={{ flex: 1, padding: '0.625rem', background: 'var(--accent)', color: 'var(--accent-ink)', border: 'none', fontFamily: 'var(--sans)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold', borderRadius: '6px' }}>[ENTER]</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes cleanFadeIn { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); } 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } }`}</style>
    </div>
  )
}
