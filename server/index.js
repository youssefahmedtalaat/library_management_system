import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import crypto from 'crypto';
import { env } from './config/env.js';
import { checkDbConnection, query } from './config/db.js';
import { initializeDatabase } from './db/initDb.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { successResponse } from './utils/response.js';

// Route modules
import authRoutes from './modules/auth/auth.routes.js';
import catalogRoutes from './modules/catalog/catalog.routes.js';
import circulationRoutes from './modules/circulation/circulation.routes.js';
import membersRoutes from './modules/members/members.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';

const app = express();

// Request identifier middleware
app.use((req, _res, next) => {
  req.requestId = req.headers['x-request-id'] || crypto.randomUUID();
  next();
});

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// API v1 root health check
app.get('/api/v1/health', async (_req, res) => {
  const dbConnected = await checkDbConnection();
  return successResponse(res, {
    status: 'healthy',
    database: dbConnected ? 'connected' : 'disconnected',
    environment: env.nodeEnv,
    version: '1.0.0'
  });
});

// Mount modular API v1 routes as per specification
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books', catalogRoutes);
app.use('/api/v1', circulationRoutes);
app.use('/api/v1/members', membersRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ai', aiRoutes);

// Centralized error handling
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    const isConnected = await checkDbConnection();
    if (!isConnected) {
      console.log('⚡ MySQL not yet initialized or connecting. Running auto-initialization...');
      await initializeDatabase();
    } else {
      // Check if tables have been seeded
      const tables = await query("SHOW TABLES LIKE 'books'");
      if (tables.length === 0) {
        console.log('⚡ Running initial database schema & seeds...');
        await initializeDatabase();
      }
    }

    app.listen(env.port, '0.0.0.0', () => {
      console.log(`\n======================================================`);
      console.log(`🚀 Smart Library LMS Backend Server Running!`);
      console.log(`📡 URL: http://localhost:${env.port}`);
      console.log(`🩺 Health: http://localhost:${env.port}/api/v1/health`);
      console.log(`📚 API Base: http://localhost:${env.port}/api/v1`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
