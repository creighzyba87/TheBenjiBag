import { useEffect, useState } from 'react'

// Base URL for the backend API. When running locally this can be overridden
// with VITE_API_BASE; otherwise it will default to the deployed backend.
const API = import.meta.env.VITE_API_BASE || 'https://thebenjibag-backend.onrender.com'

// Define the two products currently offered.  Each includes a unique id,
// descriptive name, appropriate image, description and the updated price of
// $100 per ounce.  The images point to the assets folder and will be
// bundled by Vite at build time.
const products = [
  {
    id: 'indica',
    name: 'Indica',
    img: '/assets/indica.jpg',
    desc: 'Premium Indica flower',
    price: 100,
  },
  {
    id: 'sativa',
    name: 'Sativa',
    img: '/assets/sativa.jpg',
    desc: 'Premium Sativa flower',
    price: 100,
  },
]

export default function Shop() {
  const [orders, setOrders] = useState([])
  const [qty, setQty] = useState(1)
  const [product, setProduct] = useState('Indica')
  const [customer, setCustomer] = useState('')
  const [deliveryWindow, setDeliveryWindow] = useState('')
  const [msg, setMsg] = useState('')

  // Load existing orders from the API when the component mounts.  Errors are
  // silently ignored so the page still renders if the backend is unavailable.
  async function load() {
    try {
      const r = await fetch(`${API}/api/orders`)
      const d = await r.json()
      setOrders(d)
    } catch {
      /* noop */
    }
  }

  useEffect(() => {
    load()
  }, [])

  // Submit a new order to the backend.  Resets the form state upon success
  // and reloads the recent orders list.
  async function submit(e) {
    e.preventDefault()
    setMsg('')
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, product, quantity: qty, deliveryWindow }),
      })
      const data = await res.json()
      if (!res.ok) setMsg(data.error || 'Submit failed')
      else {
        setMsg('Order placed!')
        setCustomer('')
        setQty(1)
        setDeliveryWindow('')
        load()
      }
    } catch {
      setMsg('Network error')
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Shop</h1>
      {/* Product catalog.  Only the two strains are offered and each shows
          the updated $100/oz price along with minimum and maximum purchase
          quantities. */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {products.map((p) => (
          <div key={p.id} className="bg-white border rounded-xl shadow-sm p-4">
            <img src={p.img} alt={p.name} className="h-40 w-40 object-contain mx-auto" />
            <div className="mt-3">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-slate-600">{p.desc}</div>
              <div className="text-sm mt-1">${p.price}/oz • Min 1oz • Max 4oz</div>
            </div>
          </div>
        ))}
      </div>

      {/* Order form.  Customers provide their name, select a product and
          quantity, and specify a delivery window.  Successful orders will
          trigger a reload of the recent orders list below. */}
      <form onSubmit={submit} className="bg-white border rounded-xl shadow-sm p-4 mb-8">
        <div className="grid sm:grid-cols-4 gap-3">
          <input
            className="border rounded-lg p-2"
            placeholder="Customer name"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
          />
          <select
            className="border rounded-lg p-2"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          >
            <option>Indica</option>
            <option>Sativa</option>
          </select>
          <input
            type="number"
            min="1"
            max="4"
            step="1"
            className="border rounded-lg p-2"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />
          <input
            className="border rounded-lg p-2"
            placeholder="Delivery window (e.g., 2–4pm)"
            value={deliveryWindow}
            onChange={(e) => setDeliveryWindow(e.target.value)}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-slate-600">Free delivery on orders ≥ $100.</div>
          <button className="rounded-lg bg-brand-600 text-white px-4 py-2 hover:bg-brand-700">
            Place Order
          </button>
        </div>
        {msg && <div className="mt-2 text-sm">{msg}</div>}
      </form>

      {/* Recent orders list. */}
      <h2 className="text-lg font-medium mb-3">Recent Orders</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-white border rounded-lg p-3">
            <div className="font-medium">{o.customer}</div>
            <div className="text-sm text-slate-600">
              {o.product} — {o.quantity} oz
            </div>
            <div className="text-xs text-slate-500">{o.deliveryWindow || 'No window'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}