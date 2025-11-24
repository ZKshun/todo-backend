// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';

import { port, mongoUri } from './config/config';
import openapiSpec from './docs/openapi';

import createAuthRouter from './routes/auth';
import authMiddleware from './middleware/auth';
import todosRouter from './routes/todos';
import adminRouter from './routes/admin';
import projectsRouter from './routes/projects';
import settingsRouter from './routes/settings';
import errorHandler from './middleware/errorHandler';
import activityRouter from './routes/activity';

const app = express();

app.use(express.json());

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.use('/auth', createAuthRouter());
    app.use('/todos', authMiddleware, todosRouter);
    app.use('/admin', adminRouter);
    app.use('/projects', projectsRouter);
    app.use('/settings', settingsRouter);
    app.use('/activity', activityRouter);

    app.use(errorHandler);

    // 监听 0.0.0.0 而不是 localhost，使容器内服务可以被外部访问
    app.listen(port,'0.0.0.0', () => {
      console.log(`Server running at http://0.0.0.0:${port}`);
      console.log(`Swagger UI at http://0.0.0.0:${port}/docs`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
