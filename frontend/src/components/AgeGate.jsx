import { useEffect, useState } from 'react'
export default function AgeGate() {
  const [show, setShow] = useState(false)
  useEffect(()=>{ if(!localStorage.getItem('ageOk')) setShow(true) },[])
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/90">
      <div className="card p-8 max-w-md w-full text-center">
        <h2 className="text-xl font-semibold mb-2">Are you 21 or older?</h2>
        <p className="text-sm text-zinc-400 mb-6">You must verify your age to enter.</p>
        <div className="flex gap-3 justify-center">
          <button className="btn-primary" onClick={()=>{ localStorage.setItem('ageOk','1'); setShow(false); }}>Yes</button>
          <button className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800"
                  onClick={()=>{ window.location.href='https://www.google.com'; }}>No</button>
        </div>
      </div>
    </div>
  )
}