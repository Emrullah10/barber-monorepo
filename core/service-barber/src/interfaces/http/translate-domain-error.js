import { CustomError } from '@barber/errors';

export const translateDomainError = (err) => {
  if (err instanceof CustomError || err.statusCode) {
    return { statusCode: err.statusCode || 400, message: err.message };
  }
  return { statusCode: 500, message: 'Sunucuda beklenmeyen bir hata oluştu.' };
};
