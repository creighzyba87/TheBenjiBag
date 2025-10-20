import { useEffect, useState } from 'react';
import './index.css';

const API = 'https://thebenjibag-backend.onrender.com';

export default function App() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ customer: '', product: 'Indica', quantity: 1, deliveryWindow: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const res = await fetch(`${API}/api/orders`);
      setOrders(await res.json());
    } catch {
      setError('Failed to load orders');
    }
  }

  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Submit failed');
      else { setForm({ customer: '', product: 'Indica', quantity: 1, deliveryWindow: '' }); load(); }
    } catch {
      setError('Network error');
    }
    setBusy(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="max-w-5xl mx-auto p-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">TheBenjiBag</h1>
        <span className="text-sm text-slate-500">Vite + React + Tailwind</span>
      </header>
      <main className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6">
        <form onSubmit={submit} className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Place Order</h2>
          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          <div className="space-y-3">
            <input required className="w-full border rounded-lg p-2"
              placeholder="Customer name" value={form.customer}
              onChange={e=>setForm({ ...form, customer:e.target.value })} />
            <select className="w-full border rounded-lg p-2"
              value={form.product}
              onChange={e=>setForm({ ...form, product:e.target.value })}>
              <option>Indica</option>
              <option>Sativa</option>
            </select>
            <input type="number" min="1" max="4" step="1"
              className="w-full border rounded-lg p-2"
              value={form.quantity}
              onChange={e=>setForm({ ...form, quantity:Number(e.target.value) })} />
            <input className="w-full border rounded-lg p-2"
              placeholder="Delivery window (e.g. 2–4pm)" value={form.deliveryWindow}
              onChange={e=>setForm({ ...form, deliveryWindow:e.target.value })} />
            <button disabled={busy}
              className="w-full rounded-lg bg-blue-600 text-white py-2 hover:bg-blue-700 disabled:opacity-50">
              {busy ? 'Submitting...' : 'Place Order'}
            </button>
          </div>
        </form>
        <section className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Orders</h2>
          {orders.length === 0 && <div className="text-slate-500 text-sm">No orders yet.</div>}
          <ul className="space-y-2">
            {orders.map(o => (
              <li key={o.id} className="border rounded-md p-3">
                <div className="font-medium">{o.customer}</div>
                <div className="text-sm text-slate-600">{o.product} — {o.quantity} oz</div>
                <div className="text-xs text-slate-500">{o.deliveryWindow || 'No window'}</div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
