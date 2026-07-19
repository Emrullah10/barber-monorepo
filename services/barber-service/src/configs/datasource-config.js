import { requireEnv, optionalEnv } from '@barber/config';

export const datasourceConfig = {
  user: requireEnv('DB_USER'),
  password: optionalEnv('DB_PASSWORD', ''),
  host: requireEnv('DB_HOST'),
  database: requireEnv('DB_NAME'),
  port: optionalEnv('DB_PORT', '5432'),
};
