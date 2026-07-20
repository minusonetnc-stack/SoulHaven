import { useNavigate } from 'react-router-dom'
import { useStore } from './store'
import { useSecureMode } from './SecureModeContext'
import { useState } from 'react'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { identity, theme, setTheme, privacyMode, setPrivacyMode, clearAllData } = useStore()
  const { isSecure, toggleSecure, isTransitioning } = useSecureMode()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0a', color: '#e8ede6', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem' }}>
        <button onClick={() => navigate('/sanctuary')} style={{ marginBottom: '1rem', padding: '0.5rem', background: 'none', border: 'none', color: '#a8b5a3', cursor: 'pointer' }}>← Back</button>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, fontFamily: 'Georgia, serif', marginBottom: '1.5rem' }}>⚙️ Settings</h1>

        {identity && (
          <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: identity.soulColor + '25' }}>
              {identity.soulEmoji}
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>{identity.soulName}</h2>
              <p style={{ fontSize: '0.75rem', color: '#6b7a66' }}>Anonymous soul • Created {new Date(identity.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '0.75rem', color: '#6b7a66', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Appearance</h2>
          <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem' }}>🌙 Theme</span>
              <div style={{ display: 'flex', gap: '0.25rem', background: '#0a0f0a', borderRadius: '8px', padding: '0.25rem' }}>
                <button onClick={() => setTheme('dark')} style={{ padding: '0.375rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', border: 'none', cursor: 'pointer', background: theme === 'dark' ? '#2d4a2a' : 'transparent', color: theme === 'dark' ? 'white' : '#6b7a66' }}>Dark</button>
                <button onClick={() => setTheme('light')} style={{ padding: '0.375rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', border: 'none', cursor: 'pointer', background: theme === 'light' ? '#2d4a2a' : 'transparent', color: theme === 'light' ? 'white' : '#6b7a66' }}>Light</button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '0.75rem', color: '#6b7a66', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Privacy</h2>
          <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.875rem' }}>🔒 Privacy Mode</span>
                <p style={{ fontSize: '0.625rem', color: '#6b7a66', marginTop: '0.25rem' }}>How much you want to hide</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(['standard', 'enhanced', 'maximum'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setPrivacyMode(mode)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: privacyMode === mode ? '#5a8a52' : '#2d4a2a',
                    background: privacyMode === mode ? '#5a8a5220' : '#0a0f0a',
                    color: privacyMode === mode ? '#7fb069' : '#a8b5a3',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'capitalize' }}>{mode}</span>
                  <p style={{ fontSize: '0.625rem', color: '#6b7a66', marginTop: '0.25rem' }}>
                    {mode === 'standard' && 'Basic protections'}
                    {mode === 'enhanced' && 'No tracking, minimal logs'}
                    {mode === 'maximum' && 'Full anonymity mode'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '0.75rem', color: '#6b7a66', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Security</h2>
          <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f0' }}>
                  🔒 Secure Mode
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#6b7a66', marginTop: '0.25rem' }}>
                  Activate Tor-layer visual encryption
                </p>
              </div>
              <button
                onClick={toggleSecure}
                disabled={isTransitioning}
                style={{
                  width: '48px',
                  height: '28px',
                  borderRadius: '14px',
                  border: 'none',
                  background: isSecure ? '#0f0' : '#2d4a2a',
                  position: 'relative',
                  cursor: isTransitioning ? 'wait' : 'pointer',
                  transition: 'background 0.3s',
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  left: isSecure ? '22px' : '2px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#000',
                  transition: 'left 0.3s',
                }} />
              </button>
            </div>
            {isSecure && (
              <p style={{ 
                fontSize: '0.625rem', 
                color: '#0f0', 
                marginTop: '0.75rem',
                fontFamily: '"Courier New", monospace',
              }}>
                ✓ Secure layer active. You're safe.
              </p>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '0.75rem', color: '#6b7a66', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Danger Zone</h2>
          <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem' }}>
            {!showClearConfirm ? (
              <button onClick={() => setShowClearConfirm(true)} style={{ width: '100%', padding: '0.75rem', background: '#9e7b7b20', color: '#9e7b7b', border: '1px solid #9e7b7b', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                🗑️ Clear All Data
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#9e7b7b', marginBottom: '0.5rem' }}>Are you sure? This cannot be undone.</p>
                <button onClick={clearAllData} style={{ padding: '0.75rem', background: '#9e7b7b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>Yes, clear everything</button>
                <button onClick={() => setShowClearConfirm(false)} style={{ padding: '0.75rem', background: '#1a2e18', color: '#a8b5a3', border: '1px solid #2d4a2a', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <p style={{ fontSize: '0.625rem', color: '#6b7a66' }}>SoulHaven v2.2 • Made with 💚 for healing</p>
        </div>
      </div>
    </div>
  )
}
