import express from 'express'; import cors from 'cors'; import bodyParser from 'body-parser';
import auth from './routes/auth.js'; import orders from './routes/orders.js'; import { db } from './db/index.js';
const app = express(); app.use(cors()); app.use(bodyParser.json());
app.get('/',(_req,res)=>res.send('TheBenjiBag Backend v2')); app.use('/api/auth', auth); app.use('/api/orders', orders);
const PORT = process.env.PORT || 10000; app.listen(PORT, ()=>console.log('Backend listening on '+PORT));