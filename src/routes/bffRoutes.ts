import { Router } from 'express';
import { z } from 'zod';

import { requireAuth } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { getUserProfileById } from '../services/userService.js';
import { sendError, sendSuccess } from '../utils/response.js';

const idSchema = z.coerce.number().int().positive();

export const bffRouter = Router();

bffRouter.get('/health', (req, res) => {
  sendSuccess(res, req.requestId, {
    service: 'bff-layer-template',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

bffRouter.get('/users/:id/profile', requireAuth, rateLimit, async (req, res, next) => {
  try {
    const userId = idSchema.parse(req.params.id);
    const data = await getUserProfileById(userId);

    if (!data) {
      sendError(res, req.requestId, 'USER_NOT_FOUND', `User ${userId} not found`, 404);
      return;
    }

    sendSuccess(res, req.requestId, data);
  } catch (error) {
    next(error);
  }
});
