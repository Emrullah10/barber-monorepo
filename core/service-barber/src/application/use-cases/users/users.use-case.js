import { CustomError } from '@barber/errors';

export const makeListAllUsers = ({ usersRepository }) => async (data, caller) => {
  const users = await usersRepository.getAll();
  return {
    success: true,
    message: 'Kullanıcılar başarıyla getirildi.',
    list: users,
  };
};

export const makeRegisterUser = ({ usersRepository, hasher }) => async (data, caller) => {
  const { body } = data;

  if (!body.usersEmail || !body.usersPassword) {
    throw new CustomError('Email ve şifre zorunludur.', 400);
  }

  const existingUser = await usersRepository.getByEmail(body.usersEmail);
  if (existingUser) {
    throw new CustomError('Bu email adresi zaten kullanımda.', 400);
  }

  const passwordHash = await hasher.hash(body.usersPassword);
  const newUser = await usersRepository.create({ ...body, usersPassword: passwordHash }, caller);

  return {
    success: true,
    message: 'Kullanıcı başarıyla oluşturuldu.',
    item: newUser,
  };
};

export const makeListBarbers = ({ usersRepository }) => async (data, caller) => {
  const barbers = await usersRepository.getByRole('barber');
  return {
    success: true,
    message: 'Berberler başarıyla getirildi.',
    list: barbers,
  };
};

export const makeGetBarberById = ({ usersRepository }) => async (data, caller) => {
  const id = data.params?.id;
  if (!id) throw new CustomError('ID zorunludur.', 400);
  const user = await usersRepository.getById(id);
  if (!user) throw new CustomError('Kullanıcı bulunamadı.', 404);
  return { success: true, message: 'Kullanıcı getirildi.', data: user };
};

export const makeUpdateProfile = ({ usersRepository }) => async (data, caller) => {
  const { body } = data;
  const usersId = caller?.usersId;
  if (!usersId) throw new CustomError('Kimlik doğrulama gerekli.', 401);
  const updated = await usersRepository.updateProfile(usersId, body);
  return { success: true, message: 'Profil güncellendi.', data: updated };
};

export const makeChangeUserType = ({ usersRepository }) => async (data, caller) => {
  const id = data.params?.id;
  const { userTypeCode } = data.body ?? {};
  if (!id || !userTypeCode) throw new CustomError('ID ve userTypeCode zorunludur.', 400);
  const updated = await usersRepository.updateUserType(id, userTypeCode);
  if (!updated) throw new CustomError('Kullanıcı bulunamadı veya tip geçersiz.', 404);
  return { success: true, message: 'Kullanıcı tipi güncellendi.', data: updated };
};
