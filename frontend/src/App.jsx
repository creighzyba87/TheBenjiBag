import { useState } from 'react'
import './index.css'
import logo from './assets/logo.png'

/*
 * Root application component containing an age gate and a simple marketing
 * landing page. The age gate ensures visitors are over 21 before viewing
 * any content. Once admitted, visitors see a header with navigation links,
 * a marketing section describing the business, a featured products section
 * and a footer. All prices and messaging reflect the current offer of
 * $100 per ounce and provide clear calls‑to‑action.
 */
function Gate({ children }) {
  const [over, setOver] = useState(null)
  // When explicitly confirmed the visitor is of age, render the child
  // components. If the visitor selects "No" redirect them off site. If
  // neither option has been chosen yet, render the modal overlay asking for
  // verification.
  if (over === true) return children
  if (over === false) {
    location.href = 'https://google.com'
    return null
  }
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center">
      <div className="bg-black/60 border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center">
        <img src={logo} className="mx-auto w-20 h-20 mb-3 opacity-90" alt="TheBenjiBag logo" />
        <h2 className="text-xl font-semibold mb-2">Are you 21 or older?</h2>
        <p className="text-xs opacity-80 mb-4">You must be of legal age to enter.</p>
        <div className="flex gap-3">
          <button
            className="flex-1 bg-brand-gold text-black rounded-lg py-2 font-medium"
            onClick={() => setOver(true)}
          >
            Yes
          </button>
          <button
            className="flex-1 bg-white/10 rounded-lg py-2"
            onClick={() => setOver(false)}
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Gate>
      <div className="min-h-screen">
        {/* Header with logo and navigation links.  */}
        <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} className="w-10 h-10" alt="TheBenjiBag logo" />
            <span className="font-semibold">TheBenjiBag</span>
          </div>
          <nav className="flex items-center gap-4 text-sm opacity-90">
            <a href="/signup">Customer Signup</a>
            <a href="/account">Customer Login</a>
            <a href="/admin">Admin</a>
            <a href="/driver">Driver</a>
          </nav>
        </header>
        {/* Main marketing area. */}
        <main className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6">
          <section className="bg-black/30 border border-white/10 rounded-2xl p-6">
            <h1 className="text-2xl font-semibold mb-2">Premium Cannabis, Simple Choices</h1>
            {/* Updated marketing copy: emphasises competitive pricing starting at $100/oz and the 24/7 service with scheduled delivery and free delivery on qualifying orders. */}
            <p className="opacity-80 text-sm mb-4">
              Great, competitive prices — starting at $100/oz. 24/7 ordering, scheduled delivery,
              and free delivery on qualifying orders.
            </p>
            <div className="flex gap-3">
              <a href="/signup" className="bg-brand-gold text-black rounded-lg px-4 py-2 font-medium">
                Create account
              </a>
              <a href="/account" className="bg-white/10 rounded-lg px-4 py-2">
                My account
              </a>
            </div>
          </section>
          {/* Featured products section showing the two available strains with clear pricing. */}
          <section className="bg-black/20 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-medium mb-3">Featured</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Indica', 'Sativa'].map((x) => (
                <div key={x} className="rounded-xl border border-white/10 p-3">
                  <div className="text-sm font-medium">{x}</div>
                  <div className="text-xs opacity-70">$100 / oz</div>
                  <div className="text-[11px] opacity-60 mt-2">Sign in to order</div>
                </div>
              ))}
            </div>
          </section>
        </main>
        {/* Footer with legal notice. */}
        <footer className="max-w-6xl mx-auto p-6 text-xs opacity-70">
          © TheBenjiBag — Valid ID required upon delivery.
        </footer>
      </div>
    </Gate>
  )
}