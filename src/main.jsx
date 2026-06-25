import { ViteReactSSG } from 'vite-react-ssg'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/archivo-black/400.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/700.css'
import './index.css'
import { routes } from './App.jsx'
import { fetchAllRatings } from './lib/ratingsData.js'
import { primeRatingsStore } from './store/ratingsStore.js'

export const createRoot = ViteReactSSG(
  { routes },
  async ({ initialState }) => {
    if (!initialState.ratings) {
      initialState.ratings = await fetchAllRatings()
    }

    primeRatingsStore(initialState.ratings)
  }
)
