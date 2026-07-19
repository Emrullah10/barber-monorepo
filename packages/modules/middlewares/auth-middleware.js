import jwt from 'jsonwebtoken';
import { CustomError } from '@barber/errors';

export const makeRequireAuth = ({ jwtSecret }) => (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError('Geçersiz veya eksik giriş bileti (Token). Lütfen tekrar giriş yapın.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);

    req.headers['userid'] = decoded.userId;
    req.headers['userrole'] = decoded.role;
    req.headers['usertypecode'] = decoded.userTypeCode ?? '';
    req.headers['tenantid'] = decoded.tenantId ?? '';
    req.headers['tenantslug'] = decoded.tenantSlug ?? '';

    next();
  } catch (error) {
    next(new CustomError('Oturumunuzun süresi dolmuş veya geçersiz.', 401));
  }
};

export const requireType = (...allowedTypeCodes) => (req, res, next) => {
  const typeCode = req.headers['usertypecode'];
  if (!allowedTypeCodes.includes(typeCode)) {
    return next(new CustomError('Bu işlem için yetkiniz bulunmuyor.', 403));
  }
  next();
};
