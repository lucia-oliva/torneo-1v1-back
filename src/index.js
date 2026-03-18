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
  'https://torneo-1v1-app.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

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