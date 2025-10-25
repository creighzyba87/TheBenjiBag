import logo from '../assets/logo.png'
export default function Footer(){
  return (
    <footer className="border-t border-zinc-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <img src={logo} className="h-5 w-5 rounded" alt="logo" />
          <span>© TheBenjiBag — Premium Cannabis Delivery</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  )
}