import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Layout/Header.jsx'
import HomePage from './pages/HomePage.jsx'
import BerichtePage from './pages/BerichtePage.jsx'
import KartePage from './pages/KartePage.jsx'
import RankingPage from './pages/RankingPage.jsx'
import VergleichPage from './pages/VergleichPage.jsx'
import BewertungPage from './pages/BewertungPage.jsx'
import { useRatingsStore } from './store/ratingsStore.js'

export default function App() {
  const hydrate = useRatingsStore((s) => s.hydrate)
  useEffect(() => { hydrate() }, [hydrate])

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/"          element={<HomePage />}     />
          <Route path="/berichte"  element={<BerichtePage />} />
          <Route path="/karte"     element={<KartePage />}    />
          <Route path="/ranking"   element={<RankingPage />}  />
          <Route path="/vergleich" element={<VergleichPage />}/>
          <Route path="/bewerten"  element={<BewertungPage />}/>
        </Routes>
      </main>
    </div>
  )
}
