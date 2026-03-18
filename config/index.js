import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

import slotRoutes from '../routes/slotRoutes.js';
import entryRoutes from '../routes/entryRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'Backend funcionando',
  });
});

app.use('/api/slots', slotRoutes);
app.use('/api/entries', entryRoutes);

const PORT = process.env.PORT || 4000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server corriendo en http://localhost:${PORT}`);
  });
}

startServer();


