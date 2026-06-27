import express from 'express';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestContext } from './middleware/requestContext.js';
import { requestLogger } from './middleware/requestLogger.js';
import { bffRouter } from './routes/bffRoutes.js';
import { docsRouter } from './routes/docsRoutes.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestContext);
  app.use(requestLogger);
  app.use('/api/bff', bffRouter);
  app.use('/api/bff', docsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
