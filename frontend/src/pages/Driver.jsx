export default function Driver(){
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">Driver Dashboard</h1>
      <p className="text-sm text-zinc-400">Access restricted to authorized drivers.</p>
      <div className="card p-6 mt-6">
        <div className="text-sm text-zinc-300">Future: assigned stops, live ETA, routing.</div>
      </div>
    </div>
  )
}