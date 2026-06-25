import { Component, useEffect } from 'react'
import { Outlet, Route, Routes, useLoaderData, useLocation } from 'react-router-dom'
import PasswordGate from './components/PasswordGate.jsx'
import Header from './components/Layout/Header.jsx'
import Footer from './components/Layout/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import BerichtePage from './pages/BerichtePage.jsx'
import KartePage from './pages/KartePage.jsx'
import RankingPage from './pages/RankingPage.jsx'
import VergleichPage from './pages/VergleichPage.jsx'
import BewertungPage from './pages/BewertungPage.jsx'
import DatenschutzPage from './pages/DatenschutzPage.jsx'
import AGBPage from './pages/AGBPage.jsx'
import FAQPage from './pages/FAQPage.jsx'
import UeberUnsPage from './pages/UeberUnsPage.jsx'
import BerichteDetailPage from './pages/BerichteDetailPage.jsx'
import KlinikProfilePage from './pages/KlinikProfilePage.jsx'
import StadtPage from './pages/StadtPage.jsx'
import BundeslandPage from './pages/BundeslandPage.jsx'
import FachrichtungPage from './pages/FachrichtungPage.jsx'
import { primeRatingsStore, useRatingsStore } from './store/ratingsStore.js'
import {
  getClinicStaticPaths,
  getCityStaticPaths,
  getLegacyReportStaticPaths,
  getRegionStaticPaths,
  getReportStaticPaths,
  getSpecialtyStaticPaths,
} from './lib/ssgStaticPaths.js'
import { fetchAllRatings } from './lib/ratingsData.js'

class RenderErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: '#E61919' }}>
          <h2>RENDER ERROR:</h2>
          <p>{this.state.error.message}</p>
          <p>{this.state.error.stack}</p>
        </div>
      )
    }

    return this.props.children
  }
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function AppShell() {
  const loaderData = useLoaderData()
  const loadedRatings = loaderData?.ratings ?? []
  const hydrate = useRatingsStore((state) => state.hydrate)

  primeRatingsStore(loadedRatings)

  useEffect(() => {
    if (loadedRatings.length === 0) {
      hydrate()
    }
  }, [hydrate, loadedRatings.length])

  return (
    <PasswordGate>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-canvas">
        <Header />
        <main className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8">
          <RenderErrorBoundary>
            <Outlet />
          </RenderErrorBoundary>
        </main>
        <Footer />
      </div>
    </PasswordGate>
  )
}

export const routes = [
  {
    id: 'root',
    path: '/',
    loader: async () => ({ ratings: await fetchAllRatings() }),
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'berichte', element: <BerichtePage /> },
      {
        path: 'berichte/:hospitalSlug/:id',
        element: <BerichteDetailPage />,
        getStaticPaths: getReportStaticPaths,
      },
      {
        path: 'berichte/:id',
        element: <BerichteDetailPage />,
        getStaticPaths: getLegacyReportStaticPaths,
      },
      {
        path: 'klinik/:slug',
        element: <KlinikProfilePage />,
        getStaticPaths: getClinicStaticPaths,
      },
      {
        path: 'stadt/:slug',
        element: <StadtPage />,
        getStaticPaths: getCityStaticPaths,
      },
      {
        path: 'bundesland/:slug',
        element: <BundeslandPage />,
        getStaticPaths: getRegionStaticPaths,
      },
      {
        path: 'fachrichtung/:slug',
        element: <FachrichtungPage />,
        getStaticPaths: getSpecialtyStaticPaths,
      },
      { path: 'karte', element: <KartePage /> },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'vergleich', element: <VergleichPage /> },
      { path: 'bewerten', element: <BewertungPage /> },
      { path: 'ueber-uns', element: <UeberUnsPage /> },
      { path: 'datenschutz', element: <DatenschutzPage /> },
      { path: 'agb', element: <AGBPage /> },
      { path: 'faq', element: <FAQPage /> },
    ],
  },
]

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="berichte" element={<BerichtePage />} />
        <Route path="berichte/:hospitalSlug/:id" element={<BerichteDetailPage />} />
        <Route path="berichte/:id" element={<BerichteDetailPage />} />
        <Route path="klinik/:slug" element={<KlinikProfilePage />} />
        <Route path="stadt/:slug" element={<StadtPage />} />
        <Route path="bundesland/:slug" element={<BundeslandPage />} />
        <Route path="fachrichtung/:slug" element={<FachrichtungPage />} />
        <Route path="karte" element={<KartePage />} />
        <Route path="ranking" element={<RankingPage />} />
        <Route path="vergleich" element={<VergleichPage />} />
        <Route path="bewerten" element={<BewertungPage />} />
        <Route path="ueber-uns" element={<UeberUnsPage />} />
        <Route path="datenschutz" element={<DatenschutzPage />} />
        <Route path="agb" element={<AGBPage />} />
        <Route path="faq" element={<FAQPage />} />
      </Route>
    </Routes>
  )
}
