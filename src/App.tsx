import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AppProvider } from '@/context/AppContext'
import { OnboardingProvider } from '@/context/OnboardingContext'
import { Layout } from '@/components/shared/Layout'
import { StrategicMap } from '@/pages/StrategicMap'
import { DeepFocus } from '@/pages/DeepFocus'
import { Analytics } from '@/pages/Analytics'
import { OnboardingOverlay } from '@/components/shared/OnboardingOverlay'

function App() {
  return (
    <Router>
      <AppProvider>
        <OnboardingProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/map" replace />} />
              <Route path="/map" element={<StrategicMap />} />
              <Route path="/focus" element={<DeepFocus />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
            <OnboardingOverlay />
          </Layout>
          <Toaster />
        </OnboardingProvider>
      </AppProvider>
    </Router>
  )
}

export default App