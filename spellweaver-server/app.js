import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import spellsRoutes from './routes/spells.routes.js'
import spellcastsRoutes from './routes/spellcasts.routes.js';
import convRoutes from './routes/conversations.routes.js';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/spells', spellsRoutes);
app.use('/api/v1/spells', spellcastsRoutes); 
app.use('/api/v1/conversations', convRoutes);

export default app;
