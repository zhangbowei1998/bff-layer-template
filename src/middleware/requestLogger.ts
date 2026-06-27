import type { NextFunction, Request, Response } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startAt = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startAt;
    const logPayload = {
      level: 'info',
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      timestamp: new Date().toISOString()
    };

    console.log(JSON.stringify(logPayload));
  });

  next();
}
