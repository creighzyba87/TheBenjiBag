
import { useState } from 'react'
const API = import.meta.env.VITE_API_BASE || 'https://thebenjibag-backend.onrender.com'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  async function submit(e) {
    e.preventDefault()
    setMsg('')
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) setMsg(data.error || 'Login failed')
      else { localStorage.setItem('token', data.token); setMsg('Logged in') }
    } catch { setMsg('Network error') }
  }
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={submit} className="bg-white border rounded-xl shadow-sm p-4 space-y-3">
        <input className="border rounded-lg p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="border rounded-lg p-2 w-full" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="rounded-lg bg-brand-600 text-white px-4 py-2">Login</button>
        {msg && <div className="text-sm">{msg}</div>}
      </form>
    </div>
  )
}
