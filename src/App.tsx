import { HashRouter, Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
    <HashRouter>
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
      </Routes>
    </HashRouter>
  )
}