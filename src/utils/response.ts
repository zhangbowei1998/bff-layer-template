import type { Response } from 'express';

import type { ApiError, ApiSuccess } from '../types/api.js';

export function sendSuccess<T>(res: Response, requestId: string, data: T, statusCode = 200) {
  const payload: ApiSuccess<T> = {
    success: true,
    requestId,
    data
  };
  res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  requestId: string,
  code: string,
  message: string,
  statusCode: number,
  details?: unknown
) {
  const payload: ApiError = {
    success: false,
    requestId,
    error: {
      code,
      message,
      details
    }
  };
  res.status(statusCode).json(payload);
}
