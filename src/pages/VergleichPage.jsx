import { useState } from 'react'
import HospitalSelector from '../components/Charts/HospitalSelector.jsx'
import RadarComparison from '../components/Charts/RadarComparison.jsx'

export default function VergleichPage() {
  const [selected, setSelected] = useState([])

  return (
    <div>
      <div className="register-strip border-b border-ink">
        <span>/// KLINIK-VERGLEICH</span>
        <span className="text-canvas/40">BIS ZU 3 KLINIKEN VERGLEICHEN</span>
      </div>
      <HospitalSelector selected={selected} onChange={setSelected} />
      <div className="border-t border-ink">
        <RadarComparison selected={selected} />
      </div>
    </div>
  )
}
