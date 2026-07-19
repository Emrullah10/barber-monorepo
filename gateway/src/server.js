import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // macOS AirPlay 5000 portunu işgal ettiği için 5001 yaptık.

// 1. Gateway, dış dünyadan (Mobil, Web) gelen ilk duraktır.
// O yüzden CORS güvenlik kapısını burada açıyoruz (Arka planda tek tek uğraşmamak için)
app.use(cors());

// --- BİZİM MİNİ SERVİS KEŞFİ (Service Discovery) YÖNLENDİRMELERİMİZ ---

// 2. Gateway tüm gelen istekleri doğrudan Backend'e (Mevcut url bozulmadan) yönlendirir.
app.use(
    createProxyMiddleware({
        target: 'http://localhost:5006', // Arka plandaki asıl sunucumuz (IAM Service)
        changeOrigin: true,

        // Gateway üzerinden geçen her işlemi konsola yazdıralım (Vale kimi içeri alıyor görelim)
        on: {
            proxyReq: (proxyReq, req, res) => {
                // Backend'in bizi tanıması için gizli damgamızı basıyoruz
                proxyReq.setHeader('x-gateway-secret', 'makro-enterprise-secret-key');
                console.log(`[GATEWAY 🟢] ${req.method} isteği içeri alındı -> ${req.url} (Hedef: Port 5006)`);
            },
            proxyRes: (proxyRes, req, res) => {
                console.log(`[GATEWAY 🔵] Backend sunucusundan cevap döndü -> Status: ${proxyRes.statusCode}`);
            },
            error: (err, req, res) => {
                console.error(`[GATEWAY 🔴] Backend'e Bağlanılamadı (HATA):`, err);
                res.status(502).json({ success: false, message: 'Backend şu an kapalı veya cevap veremiyor (Bad Gateway).' });
            }
        }
    })
);

// 3. Hiçbir yola uymazsa
app.use((req, res) => {
    res.status(404).json({ success: false, message: '[GATEWAY] Böyle bir servis adresi geçitte bulunamadı.' });
});

app.listen(PORT, () => {
    console.log(`🏰 Gateway (Geçit) Sunucusu Başarıyla Çalışıyor. Dış Kapı Numarası: ${PORT}`);
});
