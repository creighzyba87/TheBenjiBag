import logo from '../assets/logo.png'

/*
 * Global footer component.  Shows the company logo with a descriptive tagline
 * and provides links to basic legal/contact pages.  Links have been updated
 * to point to the home page rather than dead "#" anchors so that all
 * navigation is functional until dedicated pages are implemented.
 */
export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <img src={logo} className="h-5 w-5 rounded" alt="TheBenjiBag logo" />
          <span>© TheBenjiBag — Premium Cannabis Delivery</span>
        </div>
        <div className="flex gap-4">
          {/* Until dedicated pages exist these links return to the home page */}
          <a href="/" className="hover:text-white">Terms</a>
          <a href="/" className="hover:text-white">Privacy</a>
          <a href="/" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  )
}