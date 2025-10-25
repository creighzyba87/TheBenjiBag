import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Config ===
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-render';
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../data/db.json');

// === DB init (lowdb v6) ===
const adapter = new JSONFile(DB_PATH);
const db = new Low(adapter, { users: [], products: [], orders: [], logs: [] });
await db.read();
db.data ||= { users: [], products: [], orders: [], logs: [] };

// Seed defaults if empty
if (db.data.users.length === 0) {
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  db.data.users.push(
    { id: nanoid(), email: 'master@thebenjibag.com', name: 'Master Admin', role: 'masterAdmin', passwordHash },
    { id: nanoid(), email: 'admin@thebenjibag.com', name: 'Admin', role: 'admin', passwordHash },
    { id: nanoid(), email: 'driver@thebenjibag.com', name: 'Driver', role: 'driver', passwordHash },
    { id: nanoid(), email: 'customer@thebenjibag.com', name: 'Customer', role: 'customer', passwordHash }
  );
}
if (db.data.products.length === 0) {
  db.data.products.push(
    { id: nanoid(), name: 'Premium Indica', type: 'Indica', price: 100, img: '/assets/indica.jpg', active: true },
    { id: nanoid(), name: 'Premium Sativa', type: 'Sativa', price: 100, img: '/assets/sativa.jpg', active: true }
  );
}
await db.write();

// === App ===
const app = express();
app.use(cors({ origin: '*', credentials: false }));
app.use(bodyParser.json());

// === Helpers ===
const sign = (user) => jwt.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
const auth = (roles = []) => (req, res, next) => {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    if (roles.length && !roles.includes(decoded.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const logEvent = async (type, meta) => {
  db.data.logs.push({ id: nanoid(), type, meta, ts: new Date().toISOString() });
  await db.write();
};

// === Routes ===
app.get('/', (_, res) => res.json({ ok: true, service: 'TheBenjiBag Backend' }));

// Auth
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const exists = db.data.users.find(u => u.email.toLowerCase() == email.toLowerCase());
  if (exists) return res.status(409).json({ error: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: nanoid(), email, name: name || email.split('@')[0], role: 'customer', passwordHash };
  db.data.users.push(user); await db.write();
  await logEvent('signup', { email });
  res.json({ token: sign(user), user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = db.data.users.find(u => u.email.toLowerCase() == (email||'').toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password || '', user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  await logEvent('login', { email });
  res.json({ token: sign(user), user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

// Products (public read, admin write)
app.get('/api/products', async (_, res) => res.json(db.data.products.filter(p => p.active)));
app.post('/api/products', auth(['admin','masterAdmin']), async (req, res) => {
  const { name, type, price, img, active = true } = req.body || {};
  const prod = { id: nanoid(), name, type, price, img, active };
  db.data.products.push(prod); await db.write();
  await logEvent('product_add', { id: prod.id, name });
  res.json(prod);
});

// Orders (customer+)
app.get('/api/orders', auth(['customer','driver','admin','masterAdmin']), async (req, res) => {
  const role = req.user.role;
  let list = db.data.orders;
  if (role === 'customer') list = list.filter(o => o.userId === req.user.sub);
  res.json(list);
});

app.post('/api/orders', auth(['customer']), async (req, res) => {
  const { productId, quantity, deliveryWindow } = req.body || {};
  const qty = parseInt(quantity, 10);
  if (!productId || !Number.isInteger(qty) || qty < 1 || qty > 4) {
    return res.status(400).json({ error: 'Invalid order (1..4 oz, productId required)' });
  }
  const prod = db.data.products.find(p => p.id === productId && p.active);
  if (!prod) return res.status(400).json({ error: 'Product unavailable' });
  const order = {
    id: nanoid(),
    userId: req.user.sub,
    productId,
    quantity: qty,
    price: prod.price * qty,
    deliveryWindow: deliveryWindow || '',
    status: 'placed',
    createdAt: new Date().toISOString()
  };
  db.data.orders.push(order); await db.write();
  await logEvent('order_placed', { id: order.id, user: req.user.email });
  res.json(order);
});

// Users (admin)
app.get('/api/users', auth(['admin','masterAdmin']), async (_, res) => res.json(db.data.users.map(u=>({id:u.id,email:u.email,role:u.role,name:u.name}))));
app.post('/api/users/driver', auth(['admin','masterAdmin']), async (req,res)=>{
  const { email, name, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const exists = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return res.status(409).json({ error: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: nanoid(), email, name: name || 'Driver', role: 'driver', passwordHash };
  db.data.users.push(user); await db.write();
  await logEvent('driver_create', { email });
  res.json({ id: user.id, email: user.email, role: user.role });
});

app.listen(PORT, () => console.log(`Backend live on :${PORT}`));