import type { NextFunction, Request, Response } from 'express';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';

import { sendError } from '../utils/response.js';

export function notFoundHandler(req: Request, res: Response) {
  sendError(res, req.requestId, 'NOT_FOUND', `Route not found: ${req.method} ${req.path}`, 404);
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  if (err instanceof ZodError) {
    sendError(res, req.requestId, 'BAD_REQUEST', 'Invalid request params', 400, err.issues);
    return;
  }

  if (err instanceof AxiosError) {
    sendError(res, req.requestId, 'BAD_GATEWAY', 'Upstream service request failed', 502);
    return;
  }

  sendError(res, req.requestId, 'INTERNAL_SERVER_ERROR', 'Unexpected server error', 500);
}
