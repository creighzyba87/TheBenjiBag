import React, { useEffect, useState } from 'react'
import logo from '/logofordelivery.png'
import './index.css'
const API_BASE = import.meta.env.VITE_API_BASE || 'https://thebenjibag-backend.onrender.com'
export default function App() {
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ customer: '', product: 'Indica', quantity: 1, deliveryWindow: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  async function load() {
    try {
      const r = await fetch(`${API_BASE}/api/orders`)
      const data = await r.json()
      setOrders(Array.isArray(data) ? data.sort((a,b)=> (b.createdAt||0)-(a.createdAt||0)) : [])
    } catch { setErr('Failed to load orders') }
  }
  useEffect(()=>{ load() }, [])
  async function submit(e){
    e.preventDefault(); setMsg(''); setErr('')
    try {
      const r = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      })
      const data = await r.json()
      if(!r.ok){ setErr(data.error || 'Submit failed'); return }
      setMsg('Order placed successfully!')
      setForm({ customer:'', product:'Indica', quantity:1, deliveryWindow:'' }); load()
    } catch { setErr('Network error') }
  }
  return (
    <div className="min-h-screen">
      <header className="bg-emerald-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <img src={logo} alt="TheBenjiBag" className="h-10 w-10 rounded-full ring-2 ring-white/60" />
          <h1 className="text-xl font-semibold tracking-wide">TheBenjiBag</h1>
          <span className="ml-auto text-xs opacity-90">Vite + React + Tailwind</span>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">
        <section className="bg-white shadow-sm rounded-xl border p-5">
          <h2 className="text-lg font-medium mb-3">Place Order</h2>
          {msg && <div className="mb-2 text-green-700">{msg}</div>}
          {err && <div className="mb-2 text-red-600">{err}</div>}
          <form onSubmit={submit} className="space-y-3">
            <input className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Your name" value={form.customer}
              onChange={e=>setForm({...form, customer:e.target.value})} required />
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={()=>setForm({...form, product:'Indica'})}
                className={`border rounded-lg p-3 text-left hover:shadow ${form.product==='Indica' ? 'ring-2 ring-emerald-500' : ''}`}>
                <div className="font-medium">Indica</div>
                <div className="text-sm text-slate-600">Relaxing evening strain</div>
              </button>
              <button type="button" onClick={()=>setForm({...form, product:'Sativa'})}
                className={`border rounded-lg p-3 text-left hover:shadow ${form.product==='Sativa' ? 'ring-2 ring-emerald-500' : ''}`}>
                <div className="font-medium">Sativa</div>
                <div className="text-sm text-slate-600">Uplifting daytime strain</div>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Quantity (oz)</label>
              <button type="button" onClick={()=> setForm({...form, quantity: Math.max(1, form.quantity-1)})}
                className="px-3 py-1 border rounded">-</button>
              <span className="min-w-8 text-center">{form.quantity}</span>
              <button type="button" onClick={()=> setForm({...form, quantity: Math.min(4, form.quantity+1)})}
                className="px-3 py-1 border rounded">+</button>
              <span className="text-xs text-slate-500">(1–4)</span>
            </div>
            <input type="time" className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={form.deliveryWindow} onChange={e=>setForm({...form, deliveryWindow:e.target.value})} required />
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2">Place Order</button>
          </form>
        </section>
        <section className="bg-white shadow-sm rounded-xl border p-5">
          <h2 className="text-lg font-medium mb-3">Recent Orders</h2>
          <ul className="space-y-2 max-h-[460px] overflow-auto pr-1">
            {orders.map(o => (
              <li key={o.id} className="border rounded-lg p-3">
                <div className="font-medium">{o.customer}</div>
                <div className="text-sm text-slate-600">{o.product} — {o.quantity} oz</div>
                <div className="text-xs text-slate-500">{o.deliveryWindow || 'No window'}</div>
              </li>
            ))}
            {orders.length===0 && <li className="text-sm text-slate-500">No orders yet.</li>}
          </ul>
        </section>
      </main>
      <footer className="text-center text-xs text-slate-500 py-6">© TheBenjiBag</footer>
    </div>
  )
}
