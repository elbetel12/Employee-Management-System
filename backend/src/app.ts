import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import { config } from './config/env';
import { connectDB } from './config/database';
import { logger } from './config/logger';
import { httpLogger } from './middleware/httpLogger';
import { errorHandler } from './middleware/errorHandler';
import router from './router';

const app = express();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(mongoSanitize()); // Block NoSQL injection
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
  }),
);

// ─── Body parsing & utilities ─────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(httpLogger);

// ─── Static uploads ───────────────────────────────────────────────────────────
app.use('/uploads', express.static(config.upload.path));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', env: config.env, ts: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1', router);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function bootstrap(): Promise<void> {
  await connectDB();

  const server = app.listen(config.port, () => {
    logger.info(`🚀 Server running on http://localhost:${config.port} [${config.env}]`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    logger.warn(`${signal} received — shutting down gracefully`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
