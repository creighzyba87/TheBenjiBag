
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Database from 'better-sqlite3'
import nodemailer from 'nodemailer'

const app = express()
app.use(cors())
app.use(bodyParser.json())

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const PORT = process.env.PORT || 10000

const db = new Database('data.db')
db.pragma('journal_mode = WAL')
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Customer',
  dob TEXT
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer TEXT NOT NULL,
  product TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  deliveryWindow TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
`)

let transporter = null
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  })
}
function sendEmail(to, subject, text) {
  if (!transporter) { console.log(`[EMAIL MOCK] to=${to} subject=${subject} text=${text}`); return }
  transporter.sendMail({ from: 'no-reply@thebenjibag.com', to, subject, text }).catch(console.error)
}

function sign(user) { return jwt.sign({ id:user.id, role:user.role, email:user.email }, JWT_SECRET, { expiresIn:'7d' }) }
function auth(req,res,next){
  const hdr = req.headers.authorization || ''
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null
  if (!token) return res.status(401).json({ error:'Missing token' })
  try{ req.user = jwt.verify(token, JWT_SECRET); next() }catch{ return res.status(401).json({ error:'Invalid token' }) }
}
function requireRole(role){ return (req,res,next)=>{ if (!req.user || req.user.role !== role) return res.status(403).json({ error:'Forbidden' }); next() } }

app.get('/', (_,res)=> res.send('TheBenjiBag API is live'))

app.post('/api/auth/register', (req,res)=>{
  const { email, password, dob } = req.body
  if (!email || !password || !dob) return res.status(400).json({ error:'Email, password, dob required' })
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25*24*3600*1000))
  if (age < 21) return res.status(400).json({ error:'Must be 21+' })
  const hash = bcrypt.hashSync(password, 10)
  try {
    const info = db.prepare('INSERT INTO users (email,password,role,dob) VALUES (?,?,?,?)').run(email, hash, 'Customer', dob)
    sendEmail(email, 'Welcome to TheBenjiBag', 'Your account has been created.')
    return res.json({ ok:true, id: info.lastInsertRowid })
  } catch { return res.status(400).json({ error:'Email already registered' }) }
})
app.post('/api/auth/login', (req,res)=>{
  const { email, password } = req.body
  const user = db.prepare('SELECT * FROM users WHERE email=?').get(email)
  if (!user) return res.status(400).json({ error:'Invalid credentials' })
  if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ error:'Invalid credentials' })
  return res.json({ token: sign(user), role: user.role })
})

app.get('/api/orders', (_,res)=>{
  const rows = db.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 50').all()
  res.json(rows)
})
app.post('/api/orders', (req,res)=>{
  const { customer, product, quantity, deliveryWindow } = req.body
  if (!customer || !product || !quantity) return res.status(400).json({ error:'Missing fields' })
  const q = parseInt(quantity, 10)
  if (!Number.isInteger(q) || q < 1 || q > 4) return res.status(400).json({ error:'Quantity must be 1..4 oz' })
  const info = db.prepare('INSERT INTO orders (customer,product,quantity,deliveryWindow) VALUES (?,?,?,?)').run(customer, product, q, deliveryWindow || '')
  sendEmail(process.env.NOTIFY_EMAIL || 'ops@thebenjibag.com', 'New Order', `Order #${info.lastInsertRowid} from ${customer}`)
  res.json({ id: info.lastInsertRowid })
})

let driverLoc = { lat: null, lng: null }
function etaMinutes(distanceKm){ return Math.round((distanceKm / 30) * 60 + 15) } // 30km/h avg + 15m buffer
app.post('/api/driver/location', auth, requireRole('Driver'), (req,res)=>{
  const { lat, lng } = req.body
  driverLoc = { lat, lng }
  res.json({ ok:true })
})
app.post('/api/eta', (req,res)=>{
  const { from, toAddress } = req.body
  const start = (from && from.lat && from.lng) ? from : driverLoc
  if (!start?.lat) return res.json({ eta: null })
  const mins = etaMinutes(5) // mock 5km as example
  res.json({ eta: `${mins} min` })
})

app.get('/api/admin/ping', auth, requireRole('Admin'), (_,res)=> res.json({ ok:true }))

app.listen(PORT, ()=> console.log(`API listening on ${PORT}`))
