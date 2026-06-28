import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.VITE_API_URL || ''
  ].filter(Boolean),
  credentials: true
}));

import path from 'path';

app.use(express.json());
// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// Auth routes
app.all('/api/auth/*', toNodeHandler(auth));

import kajianRoutes from './routes/kajian.routes';
import donationsRoutes from './routes/donations.routes';
import financeRoutes from './routes/finance.routes';
import servicesRoutes from './routes/services.routes';
import ibadahRoutes from './routes/ibadah.routes';
import settingsRoutes from './routes/settings.routes';
import facilitiesRoutes from './routes/facilities.routes';
import { articlesRouter } from './routes/articles.routes';

// API Routes
app.use('/api/kajian', kajianRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/ibadah', ibadahRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/articles', articlesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
