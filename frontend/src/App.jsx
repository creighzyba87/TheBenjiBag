
import { useEffect, useState } from 'react'
import './index.css'
const API = 'https://thebenjibag-backend.onrender.com';
export default function App() {
  const [token, setToken] = useState('');
  const [signup, setSignup] = useState({ email:'', password:'', dob:'' });
  const [login, setLogin]   = useState({ email:'', password:'' });
  const [form, setForm] = useState({ product: 'Indica', quantity: 1, deliveryWindow: '' });
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  async function fetchOrders(){
    setErr('');
    try {
      const r = await fetch(`${API}/api/orders`, { headers: token ? {Authorization: `Bearer ${token}`} : {} });
      if(!r.ok) throw new Error('failed');
      const data = await r.json();
      setOrders(data);
    } catch(e){ setErr('Failed to load orders'); }
  }
  useEffect(()=>{ if(token) fetchOrders(); }, [token]);

  async function doSignup(e){
    e.preventDefault();
    setErr(''); setOk('');
    const r = await fetch(`${API}/api/auth/signup`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(signup)
    });
    const data = await r.json();
    if(!r.ok) setErr(data.error||'signup failed'); else setOk('Account created. Please login.');
  }
  async function doLogin(e){
    e.preventDefault();
    setErr(''); setOk('');
    const r = await fetch(`${API}/api/auth/login`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(login)
    });
    const data = await r.json();
    if(!r.ok) setErr(data.error||'login failed'); else { setToken(data.token); }
  }
  async function placeOrder(e){
    e.preventDefault();
    setErr(''); setOk('');
    const r = await fetch(`${API}/api/orders`, {
      method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify(form)
    });
    const data = await r.json();
    if(!r.ok) setErr(data.error||'order failed'); else { setOk('Order placed'); setForm({product:'Indica', quantity:1, deliveryWindow:''}); fetchOrders(); }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="max-w-6xl mx-auto p-4 flex items-center gap-3">
        <img src="/logo.png" alt="logo" className="w-10 h-10 rounded-md" />
        <h1 className="text-2xl font-semibold">TheBenjiBag</h1>
        <div className="ml-auto text-sm text-slate-500">California • 24/7 Ordering</div>
      </header>
      <main className="max-w-6xl mx-auto p-4 grid md:grid-cols-2 gap-6">
        {!token ? (
          <section className="space-y-6">
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <h2 className="font-medium mb-3">Sign up (21+)</h2>
              {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
              {ok && <div className="text-green-600 text-sm mb-2">{ok}</div>}
              <form onSubmit={doSignup} className="space-y-3">
                <input required className="w-full border rounded p-2" placeholder="Email" value={signup.email} onChange={e=>setSignup({...signup,email:e.target.value})} />
                <input required className="w-full border rounded p-2" placeholder="Password" type="password" value={signup.password} onChange={e=>setSignup({...signup,password:e.target.value})} />
                <input required className="w-full border rounded p-2" placeholder="DOB (YYYY-MM-DD)" value={signup.dob} onChange={e=>setSignup({...signup,dob:e.target.value})} />
                <button className="w-full bg-blue-700 text-white rounded p-2">Create account</button>
              </form>
            </div>
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <h2 className="font-medium mb-3">Login</h2>
              <form onSubmit={doLogin} className="space-y-3">
                <input required className="w-full border rounded p-2" placeholder="Email" value={login.email} onChange={e=>setLogin({...login,email:e.target.value})} />
                <input required className="w-full border rounded p-2" placeholder="Password" type="password" value={login.password} onChange={e=>setLogin({...login,password:e.target.value})} />
                <button className="w-full bg-slate-800 text-white rounded p-2">Login</button>
              </form>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-xl border shadow-sm p-5">
            <h2 className="font-medium mb-3">Place Order</h2>
            {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
            {ok && <div className="text-green-600 text-sm mb-2">{ok}</div>}
            <form onSubmit={placeOrder} className="space-y-3">
              <select className="w-full border rounded p-2" value={form.product} onChange={e=>setForm({...form,product:e.target.value})}>
                <option>Indica</option>
                <option>Sativa</option>
              </select>
              <input type="number" min="1" max="4" step="1" className="w-full border rounded p-2" value={form.quantity} onChange={e=>setForm({...form,quantity:Number(e.target.value)})} />
              <input className="w-full border rounded p-2" placeholder="Delivery window (e.g. 2–4pm)" value={form.deliveryWindow} onChange={e=>setForm({...form,deliveryWindow:e.target.value})} />
              <button className="w-full bg-blue-700 text-white rounded p-2">Submit</button>
            </form>
          </section>
        )}
        <section className="bg-white rounded-xl border shadow-sm p-5">
          <h2 className="font-medium mb-3">Recent Orders</h2>
          <ul className="space-y-2">
            {orders.map(o => (
              <li key={o.id} className="border rounded p-3">
                <div className="font-medium">{o.product} — {o.quantity} oz</div>
                <div className="text-xs text-slate-600">{o.deliveryWindow || 'No window'}</div>
                <div className="text-xs text-slate-500">{o.customerEmail}</div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="max-w-6xl mx-auto p-4 text-xs text-slate-500">
        © TheBenjiBag • Free delivery $100+ • Premium Sativa & Indica
      </footer>
    </div>
  )
}
