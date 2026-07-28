import { useNavigate } from 'react-router-dom'
import { useStore } from './store'
import { useState } from 'react'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { identity, theme, setTheme, privacyMode, setPrivacyMode, clearAllData } = useStore()
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🛡️</span>
              <div>
                <span style={{ fontSize: '0.875rem', display: 'block' }}>Privacy Mode</span>
                <span style={{ fontSize: '0.75rem', color: '#6b7a66' }}>How much data to keep locally</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {(['standard', 'enhanced', 'maximum'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setPrivacyMode(mode)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontSize: '0.75rem', textTransform: 'capitalize', border: 'none', cursor: 'pointer', background: privacyMode === mode ? '#5a8a52' : '#0a0f0a', color: privacyMode === mode ? 'white' : '#6b7a66' }}
                >
                  {mode}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7a66' }}>
              {privacyMode === 'maximum' && 'No local storage. Everything resets when you close the tab.'}
              {privacyMode === 'enhanced' && 'Minimal storage. Soul name and preferences only.'}
              {privacyMode === 'standard' && 'Full local storage. Threads and settings persist.'}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '0.75rem', color: '#6b7a66', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Data</h2>
          <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button style={{ width: '100%', padding: '0.75rem', background: '#1a2e18', color: '#e8ede6', border: '1px solid #2d4a2a', borderRadius: '12px', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              📥 Export My Data
            </button>
            <button onClick={() => setShowClearConfirm(true)} style={{ width: '100%', padding: '0.75rem', background: 'transparent', color: '#9e7b7b', border: '1px solid #3d2a2a', borderRadius: '12px', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              🗑️ Clear All Data
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7a66' }}>SoulHaven v1.0.0</p>
          <p style={{ fontSize: '0.75rem', color: '#6b7a66', marginTop: '0.25rem' }}>Made with care for humans being human.</p>
        </div>
      </div>

      {showClearConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#1a2e18', border: '1px solid #2d4a2a', borderRadius: '16px', padding: '1.5rem', maxWidth: '320px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#9e7b7b', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <h3 style={{ fontWeight: 600 }}>Clear Everything?</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#a8b5a3', marginBottom: '1rem' }}>This will erase your soul name, preferences, and all local data. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setShowClearConfirm(false)} style={{ flex: 1, padding: '0.5rem', background: '#1a2e18', color: '#a8b5a3', border: '1px solid #2d4a2a', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
              <button onClick={clearAllData} style={{ flex: 1, padding: '0.5rem', background: 'rgba(158,123,123,0.2)', color: '#9e7b7b', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Clear All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}