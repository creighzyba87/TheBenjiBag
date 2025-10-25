import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { getToken } from '../lib/auth'

export default function Account(){
  const [products,setProducts] = useState([])
  const [orders,setOrders] = useState([])
  const [err,setErr] = useState('')
  const token = getToken()

  useEffect(()=>{
    api('/api/products').then(setProducts).catch(e=>setErr(e.message))
    api('/api/orders',{ token }).then(setOrders).catch(()=>{})
  },[])

  const order = async (productId, quantity=1) => {
    try{
      const res = await api('/api/orders',{ method:'POST', token, body:{ productId, quantity } })
      setOrders([res, ...orders])
    }catch(e){ setErr(e.message) }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">My Account</h1>
      {err && <div className="text-red-400 text-sm mb-3">{err}</div>}

      <h2 className="text-lg font-medium mb-3">Products</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {products.map(p=>(
          <div key={p.id} className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{p.name}</div>
              <span className="text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-700">{p.type}</span>
            </div>
            <div className="text-sm text-zinc-400 mb-4">$100 / oz</div>
            <div className="flex gap-2">
              {[1,2,3,4].map(q=>(
                <button key={q} className="px-3 py-1 rounded border border-zinc-700 hover:bg-zinc-800"
                  onClick={()=>order(p.id,q)}>{q} oz</button>
              ))}
            </div>
            <div className="text-xs text-zinc-500 mt-2">Delivery window is not guaranteed until order submitted.</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-medium mt-10 mb-3">My Orders</h2>
      <div className="space-y-3">
        {orders.map(o=>(
          <div key={o.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Order #{o.id.slice(0,6)}</div>
              <div className="text-xs text-zinc-400">{o.quantity} oz — ${'{'}o.price{'}'}</div>
            </div>
            <div className="text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-700">{'{'}o.status{'}'}</div>
          </div>
        ))}
        {orders.length===0 && <div className="text-zinc-400 text-sm">No orders yet.</div>}
      </div>
    </div>
  )
}