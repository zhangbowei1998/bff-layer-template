import { Router } from 'express';

import { openApiDocument } from '../config/openapi.js';
import { sendSuccess } from '../utils/response.js';

export const docsRouter = Router();

docsRouter.get('/openapi.json', (req, res) => {
  sendSuccess(res, req.requestId, openApiDocument);
});

docsRouter.get('/docs', (req, res) => {
  void req;
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BFF OpenAPI Docs</title>
    <style>body { margin: 0; }</style>
  </head>
  <body>
    <redoc spec-url="/api/bff/openapi.json"></redoc>
    <script src="https://cdn.jsdelivr.net/npm/redoc@2.4.0/bundles/redoc.standalone.js"></script>
  </body>
</html>`;

  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.status(200).send(html);
});
