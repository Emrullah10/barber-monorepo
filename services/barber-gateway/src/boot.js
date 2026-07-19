import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';

const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin.' },
});

export const boot = ({ gatewayConfig }) => {
  const app = express();

  app.use(cors());

  app.use(['/api/v1/login', '/api/v1/register'], strictAuthLimiter);

  app.use(
    createProxyMiddleware({
      target: gatewayConfig.backendUrl,
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq, req) => {
          proxyReq.setHeader('x-gateway-secret', gatewayConfig.gatewaySecret);
          console.log(`[GATEWAY] ${req.method} isteği içeri alındı -> ${req.url}`);
        },
        proxyRes: (proxyRes) => {
          console.log(`[GATEWAY] Backend sunucusundan cevap döndü -> Status: ${proxyRes.statusCode}`);
        },
        error: (err, req, res) => {
          console.error('[GATEWAY] Backend\'e bağlanılamadı:', err);
          res.status(502).json({ success: false, message: 'Backend şu an kapalı veya cevap veremiyor (Bad Gateway).' });
        },
      },
    }),
  );

  app.use((req, res) => {
    res.status(404).json({ success: false, message: '[GATEWAY] Böyle bir servis adresi geçitte bulunamadı.' });
  });

  return { app };
};
