import { requireEnv, optionalEnv } from '@barber/config';

export const appConfig = {
  port: optionalEnv('PORT', '5006'),
  jwtSecret: requireEnv('JWT_SECRET'),
  gatewaySecret: requireEnv('GATEWAY_SECRET'),
};
