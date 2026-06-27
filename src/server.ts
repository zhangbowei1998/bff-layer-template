import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`BFF server is running at http://localhost:${env.PORT}`);
});

function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Start graceful shutdown...`);

  server.close((error) => {
    if (error) {
      console.error('Failed to close HTTP server', error);
      process.exit(1);
    }
    console.log('HTTP server closed successfully');
    process.exit(0);
  });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
