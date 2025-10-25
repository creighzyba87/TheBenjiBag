
import { useEffect, useState } from 'react'
const API = import.meta.env.VITE_API_BASE || 'https://thebenjibag-backend.onrender.com'

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [inv, setInv] = useState({ indica: 100, sativa: 100 })

  async function load() {
    try {
      const r = await fetch(`${API}/api/orders`)
      const d = await r.json()
      setOrders(d)
    } catch {}
  }

  useEffect(() => { load() }, [])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <div className="font-medium mb-2">Inventory</div>
          <div className="text-sm">Indica: {inv.indica} oz</div>
          <div className="text-sm">Sativa: {inv.sativa} oz</div>
        </div>
        <div className="bg-white border rounded-xl p-4 md:col-span-2">
          <div className="font-medium mb-2">Recent Orders</div>
          <div className="space-y-2 max-h-80 overflow-auto">
            {orders.map(o => (
              <div key={o.id} className="border rounded-lg p-3">
                <div className="font-medium">{o.customer}</div>
                <div className="text-sm text-slate-600">{o.product} — {o.quantity} oz</div>
                <div className="text-xs text-slate-500">{o.deliveryWindow || 'No window'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
