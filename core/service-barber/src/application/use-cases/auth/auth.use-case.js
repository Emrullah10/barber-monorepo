import { CustomError } from '@barber/errors';

export const makeLogin = ({ usersRepository, tenantMembershipRepository, hasher, jwt, jwtSecret }) =>
  async (data, caller) => {
    const { body } = data;

    if (!body.usersEmail || !body.usersPassword) {
      throw new CustomError('Email ve şifre zorunludur.', 400);
    }

    const user = await usersRepository.getByEmail(body.usersEmail);
    if (!user) {
      throw new CustomError('Kullanıcı bulunamadı veya şifre hatalı.', 401);
    }

    const isMatch = await hasher.compare(body.usersPassword, user.usersPassword);
    if (!isMatch) {
      throw new CustomError('Kullanıcı bulunamadı veya şifre hatalı.', 401);
    }

    const tenantInfo = await tenantMembershipRepository.getActiveMembership(user.usersId);

    const token = jwt.sign(
      {
        userId: user.usersId,
        role: user.usersRole,
        userTypeCode: user.userTypeCode ?? null,
        tenantId: tenantInfo?.tenant_id ?? null,
        tenantSlug: tenantInfo?.tenant_slug ?? null,
      },
      jwtSecret,
      { expiresIn: '24h' },
    );

    return {
      success: true,
      message: 'Giriş başarılı.',
      token,
      user: {
        usersId: user.usersId,
        usersName: user.usersName,
        usersRole: user.usersRole,
        userTypeCode: user.userTypeCode ?? null,
        userTypeName: user.userTypeName ?? null,
        tenantId: tenantInfo?.tenant_id ?? null,
        tenantSlug: tenantInfo?.tenant_slug ?? null,
        tenantName: tenantInfo?.tenant_name ?? null,
      },
    };
  };

export const makeRegister = ({ usersRepository, hasher, jwt, jwtSecret }) => async (data, caller) => {
  const { body } = data;

  if (!body.usersName || !body.usersEmail || !body.usersPassword) {
    throw new CustomError('Ad, email ve şifre zorunludur.', 400);
  }

  const existing = await usersRepository.getByEmail(body.usersEmail);
  if (existing) {
    throw new CustomError('Bu email adresi zaten kullanımda.', 409);
  }

  const passwordHash = await hasher.hash(body.usersPassword);

  const newUser = await usersRepository.create(
    {
      usersName: body.usersName,
      usersEmail: body.usersEmail,
      usersPassword: passwordHash,
      usersRole: 'barber',
      userTypeId: 1,
    },
    { userId: 'self-register' },
  );

  if (!newUser) {
    throw new CustomError('Kayıt sırasında bir hata oluştu.', 500);
  }

  const user = await usersRepository.getByEmail(body.usersEmail);

  const token = jwt.sign(
    {
      userId: user.usersId,
      role: user.usersRole,
      userTypeCode: user.userTypeCode ?? null,
      tenantId: null,
      tenantSlug: null,
    },
    jwtSecret,
    { expiresIn: '24h' },
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
