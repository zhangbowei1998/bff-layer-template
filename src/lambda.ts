import type { APIGatewayProxyEventV2, Callback, Context } from 'aws-lambda';
import { configure as serverlessExpress } from '@codegenie/serverless-express';

import { createApp } from './app.js';

const app = createApp();
const server = serverlessExpress({ app });

export function handler(
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback
) {
  return server(event, context, callback);
}
