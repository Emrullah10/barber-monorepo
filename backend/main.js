import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import restRoutes from './routes/rest-routes.js';  // Rotaları import ettik!

dotenv.config();

const app = express();

// 1. Gelen İstekleri Karşılama Ayarları (Global Middlewares)
app.use(cors()); // Farklı portlardan gelen isteklere izin ver (Web/Mobil)
app.use(express.json()); // Gelen JSON verilerini(body) JS objesine çevir

// 1.5. Gelen İstekleri Detaylı Logla (Debug Console'da akışı anlamak için)
app.use((req, res, next) => {
  console.log(`[BACKEND 🟢] İstek Kabul Edildi: ${req.method} ${req.url} | Gateway Mührü: ${req.headers['x-gateway-secret'] ? 'Var ✅' : 'Yok ❌'}`);
  next();
});

// 2. Mükemmel Güvenlik: İstek Gateway'den (Vale'den) mi geliyor yoksa kaçak mı?
app.use((req, res, next) => {
  // Postman veya Frontend direkt port 5005'e girmeye çalışırsa bunu engelle!
  const isFromGateway = req.headers['x-gateway-secret'] === 'makro-enterprise-secret-key';

  if (!isFromGateway) {
    return res.status(403).json({
      success: false,
      message: 'Yetkisiz Erişim! Bu sunucuya doğrudan bağlanılamaz. Lütfen API Gateway üzerinden geçin.'
    });
  }
  next();
});

// 3. Sistemin Ayakta Mı Kontrolü (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Barber API is up and running!' });
});

// 3. API Rotalarımızı (Routes) Buraya Bağladık
app.use('/api/v1', restRoutes);

// 4. EĞER HİÇBİR ROUTE EŞLEŞMEZSE (404 Bulunamadı)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'İstek attığınız adres (endpoint) bulunamadı.' });
});

// 5. GLOBAL HATA YAKALAYICI (En sonda olmalı!)
app.use(errorHandler);

export default app;

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
    console.log(`[BACKEND 🚀] Sunucu port ${PORT} üzerinde çalışıyor.`);
});

