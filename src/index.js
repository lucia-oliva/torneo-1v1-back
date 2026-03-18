import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

import slotRoutes from '../routes/slotRoutes.js';
import entryRoutes from '../routes/entryRoutes.js';

dotenv.config();
await connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'Backend funcionando',
  });
});

app.use('/api/slots', slotRoutes);
app.use('/api/entries', entryRoutes);

export default app;

if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server corriendo en http://localhost:${PORT}`);
  });
}