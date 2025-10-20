import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory order store (can be swapped with SQLite later)
const orders = [];

app.get('/', (req, res) => {
  res.send('TheBenjiBag Backend API is live');
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const { customer, product, quantity, deliveryWindow } = req.body || {};
  if (!customer || !product || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 4) {
    return res.status(400).json({ error: 'Quantity must be integer 1..4' });
  }
  const id = orders.length + 1;
  orders.push({ id, customer, product, quantity: qty, deliveryWindow: deliveryWindow || '' });
  res.json({ ok: true, id });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on port ${PORT}`);
});
