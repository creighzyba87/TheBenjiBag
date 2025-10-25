import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { saveToken } from '../lib/auth'

export default function Login(){
  const nav = useNavigate()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [err,setErr] = useState('')
  const [busy,setBusy] = useState(false)

  const submit = async(e)=>{
    e.preventDefault(); setErr(''); setBusy(true)
    try{
      const res = await api('/api/auth/login',{ method:'POST', body:{ email, password } })
      saveToken(res.token)
      nav('/account')
    }catch(ex){ setErr(ex.message) } finally { setBusy(false) }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      {err && <div className="text-red-400 text-sm mb-3">{err}</div>}
      <form onSubmit={submit} className="card p-6 space-y-3">
        <input className="w-full rounded border border-zinc-700 bg-zinc-900 p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full rounded border border-zinc-700 bg-zinc-900 p-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn-primary w-full" disabled={busy}>{busy?'Signing in...':'Sign In'}</button>
      </form>
    </div>
  )
}