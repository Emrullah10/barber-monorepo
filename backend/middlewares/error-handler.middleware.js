import { CustomError } from "../src/shared/utils/custom-error.js";

/*
  Global Hata Yakalayıcı:
  Express.js'te 4 parametreli (err, req, res, next) her fonksiyon otomatik olarak
  "Hata Yakalayıcı (Error Middleware)" kabul edilir.
*/
export const errorHandler = (err, req, res, next) => {
  // 1. Durum: Hata bizim bilerek fırlattığımız CustomError mu? (Örn: "Şifre yanlış")
  if (err instanceof CustomError || err.statusCode) {
    console.warn(`[BACKEND 🟠] İŞ MANTIĞI HATASI -> ${err.message}`);
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
    });
  }

  // 2. Durum: Sistem çöktü! Beklenmeyen veya kodsal bir hata (Örn: Veritabanı düştü)
  console.error(`[BACKEND 🔴] KRİTİK SİSTEM HATASI -> ${err.message}`, err);

  // Dış dünyaya teknik detay verilmez (Güvenlik). Sadece 500 dönülür.
  return res.status(500).json({
    success: false,
    message: "Sunucuda beklenmeyen bir hata oluştu.",
  });
};
