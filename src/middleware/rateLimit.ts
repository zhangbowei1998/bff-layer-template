import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.js';
import { sendError } from '../utils/response.js';

type RateRecord = {
  count: number;
  resetAt: number;
};

const requestCounters = new Map<string, RateRecord>();

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const key = `${req.ip ?? 'unknown'}:${req.path}`;
  const now = Date.now();

  const current = requestCounters.get(key);
  if (!current || current.resetAt <= now) {
    requestCounters.set(key, {
      count: 1,
      resetAt: now + env.RATE_LIMIT_WINDOW_MS
    });
    next();
    return;
  }

  current.count += 1;
  requestCounters.set(key, current);

  if (current.count > env.RATE_LIMIT_MAX) {
    sendError(
      res,
      req.requestId,
      'TOO_MANY_REQUESTS',
      'Rate limit exceeded. Please retry later.',
      429,
      { retryAfterMs: current.resetAt - now }
    );
    return;
  }

  next();
}
