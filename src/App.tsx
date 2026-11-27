import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { SecureModeProvider, useSecureMode } from './SecureModeContext'
import { useStore } from './store'
import PixelWipe from './PixelWipe'
import LandingPage from './LandingPage'
import OnboardingPage from './OnboardingPage'
import SanctuaryPage from './SanctuaryPage'
import RoomsPage from './RoomsPage'
import RoomChatPage from './RoomChatPage'
import ThreadsPage from './ThreadsPage'
import ThreadDetailPage from './ThreadDetailPage'
import PlayDatesPage from './PlayDatesPage'
import ResourcesPage from './ResourcesPage'
import SettingsPage from './SettingsPage'
import CleanRoomPage from './CleanRoomPage'
import InnerSanctumPage from './InnerSanctumPage'

function AppContent() {
  const { isSecure, toggleSecure, isTransitioning } = useSecureMode()
  const theme = useStore(s => s.theme)

  // Apply the saved theme (dark / light) to the document root.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <>
      <PixelWipe isActive={isSecure || isTransitioning} />
      {/* Exit button for secure mode — sits on top of everything */}
      {isSecure && !isTransitioning && (
        <button
          onClick={toggleSecure}
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 9999,
            background: 'transparent',
            border: '1px solid var(--accent)',
            color: 'var(--accent)',
            padding: '0.5rem 1rem',
            fontFamily: 'var(--sans)',
            fontSize: '0.75rem',
            borderRadius: '6px',
            cursor: 'pointer',
            opacity: 0.6,
            transition: 'opacity 0.3s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
        >
          [EXIT]
        </button>
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/welcome" element={<OnboardingPage />} />
        <Route path="/sanctuary" element={<SanctuaryPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/room/:roomId" element={<RoomChatPage />} />
        <Route path="/threads" element={<ThreadsPage />} />
        <Route path="/thread/:threadId" element={<ThreadDetailPage />} />
        <Route path="/playdates" element={<PlayDatesPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/cleanroom" element={<CleanRoomPage />} />
        <Route path="/inner-sanctum" element={<InnerSanctumPage />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <SecureModeProvider>
        <AppContent />
      </SecureModeProvider>
    </HashRouter>
  )
}
