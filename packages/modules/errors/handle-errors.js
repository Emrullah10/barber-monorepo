import { CustomError } from './custom-error.js';

export const handleErrors = (err, req, res, next) => {
  if (err instanceof CustomError || err.statusCode) {
    console.warn(`[BACKEND] İş mantığı hatası -> ${err.message}`);
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
    });
  }

  console.error(`[BACKEND] Kritik sistem hatası -> ${err.message}`, err);
  return res.status(500).json({
    success: false,
    message: 'Sunucuda beklenmeyen bir hata oluştu.',
  });
};
