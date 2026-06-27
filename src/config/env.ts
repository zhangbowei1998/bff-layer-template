import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  UPSTREAM_BASE_URL: z.string().url().default('https://jsonplaceholder.typicode.com'),
  REQUEST_TIMEOUT_MS: z.coerce.number().positive().default(5000),
  BFF_AUTH_TOKEN: z.string().default('dev-bff-token'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(30),
  CACHE_TTL_MS: z.coerce.number().int().positive().default(30_000)
});

export const env = envSchema.parse(process.env);
