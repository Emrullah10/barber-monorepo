import { requireEnv, optionalEnv } from '@barber/config';

export const gatewayConfig = {
  port: optionalEnv('PORT', '5001'),
  backendUrl: requireEnv('BACKEND_URL'),
  gatewaySecret: requireEnv('GATEWAY_SECRET'),
};
