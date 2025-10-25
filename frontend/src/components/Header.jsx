import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="TheBenjiBag" className="h-8 w-8 rounded" />
          <span className="font-semibold tracking-wide">TheBenjiBag</span>
        </Link>
        <nav className="flex gap-6 text-sm text-zinc-300">
          <NavLink to="/" className={({isActive})=> isActive ? 'text-brand-gold' : 'hover:text-white'}>Home</NavLink>
          <NavLink to="/login" className={({isActive})=> isActive ? 'text-brand-gold' : 'hover:text-white'}>Login</NavLink>
          <NavLink to="/signup" className={({isActive})=> isActive ? 'text-brand-gold' : 'hover:text-white'}>Signup</NavLink>
          <NavLink to="/admin" className={({isActive})=> isActive ? 'text-brand-gold' : 'hover:text-white'}>Admin</NavLink>
        </nav>
      </div>
    </header>
  )
}