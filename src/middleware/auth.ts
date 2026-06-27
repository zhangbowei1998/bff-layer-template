import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.js';
import { sendError } from '../utils/response.js';

function extractBearerToken(authorizationHeader?: string) {
  if (!authorizationHeader) {
    return null;
  }
  const [schema, token] = authorizationHeader.split(' ');
  if (schema !== 'Bearer' || !token) {
    return null;
  }
  return token;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractBearerToken(req.header('authorization'));

  if (!token || token !== env.BFF_AUTH_TOKEN) {
    sendError(res, req.requestId, 'UNAUTHORIZED', 'Missing or invalid bearer token', 401);
    return;
  }

  next();
}
