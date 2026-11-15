import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import examRoutes from './routes/exams.js';
import resourceRoutes from './routes/resources.js';
import coachRoutes from './routes/coaches.js';
import { getSupabaseStatus, supabaseAdmin } from './supabaseClient.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);
allowedOrigins.add('http://localhost:5173');
allowedOrigins.add('http://127.0.0.1:5173');

app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.has(origin));
  },
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  const status = getSupabaseStatus();
  let database = 'not-configured';

  if (supabaseAdmin) {
    const { error } = await supabaseAdmin.from('learning_resources').select('id').limit(1);
    database = error ? 'error' : 'connected';
  }

  res.json({ ok: true, message: 'PathMind API is running', supabase: { ...status, database } });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/coaches', coachRoutes);

if (!process.env.VERCEL) {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'), (err) => {
      if (err) next();
    });
  });
}

app.use((error, _req, res, _next) => {
  console.error('API request failed:', error);
  res.status(500).json({ error: 'The request could not be completed. Please try again.' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`PathMind API running on http://localhost:${PORT}`);
  });
}

export default app;
