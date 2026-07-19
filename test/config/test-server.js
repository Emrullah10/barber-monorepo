import { boot } from '../../services/barber-service/src/boot.js';

export const buildTestApp = ({ pool }) => {
  const appConfig = {
    port: '0',
    jwtSecret: 'test-jwt-secret',
    gatewaySecret: 'test-gateway-secret',
  };

  const { app } = boot({ appConfig, pool });
  return { app, gatewaySecret: appConfig.gatewaySecret };
};
