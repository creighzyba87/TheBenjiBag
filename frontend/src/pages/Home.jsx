import AgeGate from '../components/AgeGate'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

/*
 * Home page for the TheBenjiBag storefront.  Displays the age gate, a hero
 * section introducing the business with updated marketing copy, and a
 * selection of the two available products.  All references to pricing
 * explicitly show the new $100/oz rate.  Buttons link to the appropriate
 * authentication or admin portals via react‑router.
 */
export default function Home() {
  return (
    <div>
      {/* Require visitors to verify their age before viewing content */}
      <AgeGate />
      <section className="relative overflow-hidden">
        {/* Subtle background gradients for visual interest */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_#D4AF37_0%,_transparent_50%),radial-gradient(circle_at_bottom_right,_#0f5132_0%,_transparent_50%)]"></div>
        <div className="max-w-6xl mx-auto px-4 py-24 relative">
          <div className="flex flex-col items-center text-center">
            <img src={logo} className="h-20 w-20 rounded-xl mb-6" alt="TheBenjiBag" />
            {/* Updated heading and tagline to reflect the new pricing and service offering */}
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Great, competitive prices — starting at $100/oz
            </h1>
            <p className="text-zinc-300 max-w-2xl">
              24/7 ordering, scheduled delivery, and free delivery on qualifying orders.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/login" className="btn-primary">
                Login to Order
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold mb-6">Our Selection</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: 'Premium Indica', type: 'Indica', img: '/assets/indica.jpg' },
            { name: 'Premium Sativa', type: 'Sativa', img: '/assets/sativa.jpg' },
          ].map((p, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{p.name}</div>
                <span className="text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-700">
                  {p.type}
                </span>
              </div>
              <div className="text-sm text-zinc-400">
                Only $100 per ounce. Login to add to cart.
              </div>
              <div className="mt-4">
                <Link to="/login" className="btn-primary">
                  Login to Order
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-sm text-zinc-400">
          * Delivery times are estimated; delivery window confirmed at checkout.
        </div>
        <div className="mt-6 text-sm">
          <Link to="/admin" className="underline text-zinc-300 hover:text-white">
            Admin / Driver Portal
          </Link>
        </div>
      </section>
    </div>
  )
}