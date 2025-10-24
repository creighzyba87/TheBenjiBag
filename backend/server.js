import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
const app = express()
app.use(cors())
app.use(bodyParser.json())
let orders = []
let idSeq = 1
app.get('/', (req, res)=> res.send('TheBenjiBag Backend API is live'))
app.get('/api/orders', (req, res)=>{ res.json(orders.slice(-50)) })
app.post('/api/orders', (req, res)=>{
  const { customer, product, quantity, deliveryWindow } = req.body || {}
  if(!customer || !product || !quantity) { return res.status(400).json({ error: 'Missing required fields' }) }
  const q = parseInt(quantity, 10)
  if(!Number.isInteger(q) || q<1 || q>4) { return res.status(400).json({ error: 'Quantity must be integer 1..4 oz' }) }
  const order = { id: idSeq++, customer, product, quantity: q, deliveryWindow: deliveryWindow||'', createdAt: Date.now() }
  orders.push(order); res.json(order)
})
const PORT = process.env.PORT || 10000
app.listen(PORT, ()=> console.log(`Backend listening on ${PORT}`))
