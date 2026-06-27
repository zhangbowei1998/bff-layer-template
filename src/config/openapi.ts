const bearerScheme = {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'Token'
};

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'BFF Layer Template API',
    version: '1.1.0',
    description: 'A production-ready BFF template with auth, rate limit, cache, and unified response envelope.'
  },
  servers: [
    {
      url: 'http://localhost:4000'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: bearerScheme
    }
  },
  paths: {
    '/api/bff/health': {
      get: {
        summary: 'Health check',
        responses: {
          200: {
            description: 'Service healthy'
          }
        }
      }
    },
    '/api/bff/users/{id}/profile': {
      get: {
        summary: 'Get aggregated user profile',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
              minimum: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'Aggregated profile'
          },
          401: {
            description: 'Unauthorized'
          },
          429: {
            description: 'Rate limited'
          }
        }
      }
    },
    '/api/bff/openapi.json': {
      get: {
        summary: 'OpenAPI JSON document',
        responses: {
          200: {
            description: 'OpenAPI JSON'
          }
        }
      }
    }
  }
} as const;
