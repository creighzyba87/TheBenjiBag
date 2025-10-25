
import { Outlet, Link, useLocation } from 'react-router-dom'

const logoSrc = '/logofordelivery.png'
const navLink = 'px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100'

export default function Layout() {
  const loc = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="TheBenjiBag" className="h-10 w-10 rounded-full ring-2 ring-brand-500/30" />
            <span className="font-semibold text-lg">TheBenjiBag</span>
          </div>
          <nav className="flex items-center gap-1">
            <Link to="/" className={navLink + (loc.pathname==='/'?' bg-slate-100':'')}>Shop</Link>
            <Link to="/login" className={navLink + (loc.pathname==='/login'?' bg-slate-100':'')}>Login</Link>
            <Link to="/signup" className={navLink + (loc.pathname==='/signup'?' bg-slate-100':'')}>Signup</Link>
            <Link to="/driver" className={navLink + (loc.pathname==='/driver'?' bg-slate-100':'')}>Driver</Link>
            <Link to="/admin" className={navLink + (loc.pathname==='/admin'?' bg-slate-100':'')}>Admin</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto p-4 text-xs text-slate-500">© TheBenjiBag • 24/7 California delivery</div>
      </footer>
    </div>
  )
}
