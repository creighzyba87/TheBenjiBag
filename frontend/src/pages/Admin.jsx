export default function Admin(){
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">Admin Portal</h1>
      <p className="text-sm text-zinc-400">Driver accounts must be created by an admin. Admin can only be created by master admin.</p>
      <div className="card p-6 mt-6">
        <div className="text-sm text-zinc-300">Future: inventory management, driver onboarding, order oversight.</div>
      </div>
    </div>
  )
}