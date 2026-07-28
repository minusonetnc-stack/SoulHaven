import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import OnboardingPage from './OnboardingPage'
import SanctuaryPage from './SanctuaryPage'
import InnerSanctumPage from './InnerSanctumPage'
import RoomsPage from './RoomsPage'
import RoomChatPage from './RoomChatPage'
import ThreadsPage from './ThreadsPage'
import ThreadDetailPage from './ThreadDetailPage'
import PlayDatesPage from './PlayDatesPage'
import ResourcesPage from './ResourcesPage'
import SettingsPage from './SettingsPage'
import CleanRoomPage from './CleanRoomPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/welcome" element={<OnboardingPage />} />
        <Route path="/sanctuary" element={<SanctuaryPage />} />
        <Route path="/inner-sanctum" element={<InnerSanctumPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/room/:id" element={<RoomChatPage />} />
        <Route path="/rooms/:id" element={<RoomChatPage />} />
        <Route path="/threads" element={<ThreadsPage />} />
        <Route path="/thread/:id" element={<ThreadDetailPage />} />
        <Route path="/threads/:id" element={<ThreadDetailPage />} />
        <Route path="/playdates" element={<PlayDatesPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/cleanroom" element={<CleanRoomPage />} />
      </Routes>
    </Router>
  )
}

export default App
