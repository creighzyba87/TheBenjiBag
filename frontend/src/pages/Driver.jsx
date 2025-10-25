
import { useEffect, useState } from 'react'
const API = import.meta.env.VITE_API_BASE || 'https://thebenjibag-backend.onrender.com'

export default function Driver() {
  const [loc, setLoc] = useState({ lat: null, lng: null })
  const [eta, setEta] = useState('')
  const [dest, setDest] = useState('')

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      })
    }
  }, [])

  async function report() {
    if (loc.lat == null) return
    const r = await fetch(`${API}/api/driver/location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')||''}` },
      body: JSON.stringify({ lat: loc.lat, lng: loc.lng })
    })
    await r.json()
  }

  async function calc() {
    if (loc.lat == null || !dest) return
    const r = await fetch(`${API}/api/eta`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: loc, toAddress: dest })
    })
    const d = await r.json()
    setEta(d.eta || 'n/a')
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Driver Console</h1>
      <div className="bg-white border rounded-xl shadow-sm p-4 space-y-3">
        <div className="text-sm">Location: {loc.lat?.toFixed(4)},{loc.lng?.toFixed(4)}</div>
        <input className="border rounded-lg p-2 w-full" placeholder="Next delivery address" value={dest} onChange={e=>setDest(e.target.value)} />
        <div className="flex gap-2">
          <button onClick={report} className="rounded-lg bg-brand-600 text-white px-3 py-2">Report Location</button>
          <button onClick={calc} className="rounded-lg border px-3 py-2">Calculate ETA</button>
        </div>
        {eta && <div className="text-sm">ETA: {eta}</div>}
      </div>
    </div>
  )
}
