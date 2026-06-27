import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../app.js';

describe('bff routes', () => {
  it('returns health status', async () => {
    const app = createApp();
    const response = await request(app).get('/api/bff/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
    expect(typeof response.body.requestId).toBe('string');
  });

  it('rejects unauthorized profile request', async () => {
    const app = createApp();
    const response = await request(app).get('/api/bff/users/1/profile');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('returns OpenAPI json document', async () => {
    const app = createApp();
    const response = await request(app).get('/api/bff/openapi.json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.openapi).toBe('3.0.3');
  });
});
