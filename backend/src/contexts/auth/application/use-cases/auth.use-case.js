import jwt from 'jsonwebtoken';
import usersRepository from '../../../../contexts/users/infrastructure/persistence/users.repository.js';
import { query } from '../../../../infrastructure/persistence/persistence-utils.js';
import { CustomError } from '../../../../shared/utils/custom-error.js';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'super_gizli_berber_anahtari';

// Kullanıcının bağlı olduğu tenant bilgisini getir (berber/manager için)
const getTenantInfo = async (usersId) => {
  const text = `
    SELECT tu.tenant_id, tu.role_in_tenant, t.tenant_slug, t.tenant_name
    FROM iam.tenant_users tu
    JOIN iam.tenants t ON t.tenant_id = tu.tenant_id
    WHERE tu.users_id = $1 AND tu.is_active = true AND t.tenant_is_active = true
    LIMIT 1;
  `;
  const { rows } = await query(text, [usersId]);
  return rows[0] || null;
};

export const login = async (data, caller) => {
  const { body } = data;

  if (!body.usersEmail || !body.usersPassword) {
    throw new CustomError('Email ve şifre zorunludur.', 400);
  }

  const user = await usersRepository.getByEmail(body.usersEmail);
  if (!user) {
    throw new CustomError('Kullanıcı bulunamadı veya şifre hatalı.', 401);
  }

  const isMatch = body.usersPassword === user.usersPassword;
  if (!isMatch) {
    throw new CustomError('Kullanıcı bulunamadı veya şifre hatalı.', 401);
  }

  // Berber/manager ise tenant bilgisini al
  const tenantInfo = await getTenantInfo(user.usersId);

  // JWT'ye rol + tip + tenant bilgisini ekle
  const token = jwt.sign(
    {
      userId: user.usersId,
      role: user.usersRole,
      userTypeCode: user.userTypeCode ?? null,
      tenantId: tenantInfo?.tenant_id ?? null,
      tenantSlug: tenantInfo?.tenant_slug ?? null,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    success: true,
    message: 'Giriş başarılı.',
    token: token,
    user: {
      usersId: user.usersId,
      usersName: user.usersName,
      usersRole: user.usersRole,
      userTypeCode: user.userTypeCode ?? null,
      userTypeName: user.userTypeName ?? null,
      tenantId: tenantInfo?.tenant_id ?? null,
      tenantSlug: tenantInfo?.tenant_slug ?? null,
      tenantName: tenantInfo?.tenant_name ?? null,
    }
  };
};

export const register = async (data, caller) => {
  const { body } = data;

  if (!body.usersName || !body.usersEmail || !body.usersPassword) {
    throw new CustomError('Ad, email ve şifre zorunludur.', 400);
  }

  const existing = await usersRepository.getByEmail(body.usersEmail);
  if (existing) {
    throw new CustomError('Bu email adresi zaten kullanımda.', 409);
  }

  const newUser = await usersRepository.create({
    usersName: body.usersName,
    usersEmail: body.usersEmail,
    usersPassword: body.usersPassword,
    usersRole: 'barber',
    userTypeId: 1, // customer
  }, { userId: 'self-register' });

  if (!newUser) {
    throw new CustomError('Kayıt sırasında bir hata oluştu.', 500);
  }

  // Oluşturulan kullanıcıyı tekrar çek (user_types JOIN'li)
  const user = await usersRepository.getByEmail(body.usersEmail);

  const token = jwt.sign(
    {
      userId: user.usersId,
      role: user.usersRole,
      userTypeCode: user.userTypeCode ?? null,
      tenantId: null,
      tenantSlug: null,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    success: true,
    message: 'Kayıt başarılı.',
    token,
    user: {
      usersId: user.usersId,
      usersName: user.usersName,
      usersRole: user.usersRole,
      userTypeCode: user.userTypeCode ?? null,
      userTypeName: user.userTypeName ?? null,
      tenantId: null,
      tenantSlug: null,
      tenantName: null,
    },
  };
};

export default { login, register };
