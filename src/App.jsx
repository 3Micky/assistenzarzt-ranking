import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import PasswordGate  from './components/PasswordGate.jsx'
import Header        from './components/Layout/Header.jsx'
import Footer        from './components/Layout/Footer.jsx'
import HomePage      from './pages/HomePage.jsx'
import BerichtePage  from './pages/BerichtePage.jsx'
import KartePage     from './pages/KartePage.jsx'
import RankingPage   from './pages/RankingPage.jsx'
import VergleichPage from './pages/VergleichPage.jsx'
import BewertungPage from './pages/BewertungPage.jsx'
import DatenschutzPage    from './pages/DatenschutzPage.jsx'
import AGBPage            from './pages/AGBPage.jsx'
import FAQPage            from './pages/FAQPage.jsx'
import UeberUnsPage       from './pages/UeberUnsPage.jsx'
import BerichteDetailPage from './pages/BerichteDetailPage.jsx'
import KlinikProfilePage  from './pages/KlinikProfilePage.jsx'
import StadtPage          from './pages/StadtPage.jsx'
import BundeslandPage     from './pages/BundeslandPage.jsx'
import FachrichtungPage   from './pages/FachrichtungPage.jsx'
import { useRatingsStore } from './store/ratingsStore.js'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const hydrate = useRatingsStore((s) => s.hydrate)
  useEffect(() => { hydrate() }, [hydrate])

  return (
    <PasswordGate>
    <ScrollToTop />
    <div className="min-h-screen flex flex-col bg-canvas">
      <Header />
      <main className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8">
        <Routes>
          <Route path="/"           element={<HomePage />}       />
          <Route path="/berichte"   element={<BerichtePage />}   />
          <Route path="/berichte/:hospitalSlug/:id" element={<BerichteDetailPage />} />
          <Route path="/berichte/:id"               element={<BerichteDetailPage />} />
          <Route path="/klinik/:slug"      element={<KlinikProfilePage />}  />
          <Route path="/stadt/:slug"       element={<StadtPage />}          />
          <Route path="/bundesland/:slug"  element={<BundeslandPage />}     />
          <Route path="/fachrichtung/:slug" element={<FachrichtungPage />}  />
          <Route path="/karte"      element={<KartePage />}      />
          <Route path="/ranking"    element={<RankingPage />}    />
          <Route path="/vergleich"  element={<VergleichPage />}  />
          <Route path="/bewerten"   element={<BewertungPage />}  />
          <Route path="/ueber-uns"  element={<UeberUnsPage />}   />
          <Route path="/datenschutz" element={<DatenschutzPage />} />
          <Route path="/agb"        element={<AGBPage />}        />
          <Route path="/faq"        element={<FAQPage />}        />
        </Routes>
      </main>
      <Footer />
    </div>
    </PasswordGate>
  )
}
