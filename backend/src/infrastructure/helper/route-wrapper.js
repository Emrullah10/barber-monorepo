import { getCaller } from '../../shared/utils/general.js';

/**
 * Route Case Wrapper (Makro Pattern)
 * Bu yapı, Makro projesindeki 'base' fonksiyonu ile birebir aynıdır.
 */

const base = async (
  req,
  res,
  next,
  callerName,
  serviceFunction,
  isPublic = false,
) => {
  try {
    if (typeof serviceFunction !== 'function') {
      throw new Error('Invalid service function provided');
    }

    // 1. Caller bilgisini al
    const caller = getCaller(req.headers, isPublic);

    // 2. Servis/Controller fonksiyonunu çalıştır
    // Makro pattern'inde req ve caller nesneleri doğrudan iletilir
    const response = await serviceFunction(req, caller);

    // 3. Yanıtı dön
    res.status(200).json(response);
  } catch (error) {
    // Merkezi hata yönetimine gönder
    // Makro'daki errorContext yapısını simüle ediyoruz
    error.callerName = callerName;
    error.path = req.path;
    error.method = req.method;
    next(error);
  }
};

export const routeResponse = base;
