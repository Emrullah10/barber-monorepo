import express from 'express';
import cors from 'cors';
import { handleErrors } from '@barber/errors';
import { makeGatewayGuard } from '@barber/middlewares';
import { buildContainer } from './container.js';
import { buildRestRoutes } from './routes/rest-routes.js';

export const boot = ({ appConfig, datasourceConfig, pool } = {}) => {
  const { pool: dbPool, controllers } = buildContainer({ appConfig, datasourceConfig, pool });

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    console.log(`[BACKEND] İstek Kabul Edildi: ${req.method} ${req.url}`);
    next();
  });

  app.use(makeGatewayGuard({ gatewaySecret: appConfig.gatewaySecret }));

  app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Barber API is up and running!' });
  });

  app.use('/api/v1', buildRestRoutes({ controllers, appConfig }));

  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'İstek attığınız adres (endpoint) bulunamadı.' });
  });

  app.use(handleErrors);

  return { app, pool: dbPool };
};
