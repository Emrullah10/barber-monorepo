import usersRepository from '../../infrastructure/persistence/users.repository.js';
import { CustomError } from '../../../../shared/utils/custom-error.js';

export const listAllUsers = async (data, caller) => {
  // İş Mantığı: Burada yetki kontrolü veya veri manipülasyonu yapılabilir.
  const users = await usersRepository.getAll();
  return {
    success: true,
    message: 'Kullanıcılar başarıyla getirildi.',
    list: users
  };
};

export const registerUser = async (data, caller) => {
  const { body } = data;

  // 1. Validasyon
  if (!body.usersEmail || !body.usersPassword) {
    throw new CustomError('Email ve şifre zorunludur.', 400);
  }

  // 2. Email kontrolü
  const existingUser = await usersRepository.getByEmail(body.usersEmail);
  if (existingUser) {
    throw new CustomError('Bu email adresi zaten kullanımda.', 400);
  }

  // 3. Veritabanına kayıt (Şifre hash'leme auth context'inde de olabilir ama şimdilik düz paslıyoruz)
  const newUser = await usersRepository.create(body, caller);

  return {
    success: true,
    message: 'Kullanıcı başarıyla oluşturuldu.',
    item: newUser
  };
};

export const listBarbers = async (data, caller) => {
  const barbers = await usersRepository.getByRole('barber');
  return {
    success: true,
    message: 'Berberler başarıyla getirildi.',
    list: barbers
  };
};

export const getBarberById = async (data, caller) => {
  const id = data.params?.id;
  if (!id) throw new CustomError('ID zorunludur.', 400);
  const user = await usersRepository.getById(id);
  if (!user) throw new CustomError('Kullanıcı bulunamadı.', 404);
  return { success: true, message: 'Kullanıcı getirildi.', data: user };
};

export const updateProfile = async (data, caller) => {
  const { body } = data;
  const usersId = caller?.usersId;
  if (!usersId) throw new CustomError('Kimlik doğrulama gerekli.', 401);
  const updated = await usersRepository.updateProfile(usersId, body);
  return { success: true, message: 'Profil güncellendi.', data: updated };
};

export const changeUserType = async (data, caller) => {
  const id = data.params?.id;
  const { userTypeCode } = data.body ?? {};
  if (!id || !userTypeCode) throw new CustomError('ID ve userTypeCode zorunludur.', 400);
  const updated = await usersRepository.updateUserType(id, userTypeCode);
  if (!updated) throw new CustomError('Kullanıcı bulunamadı veya tip geçersiz.', 404);
  return { success: true, message: 'Kullanıcı tipi güncellendi.', data: updated };
};

export default {
  listAllUsers,
  registerUser,
  listBarbers,
  getBarberById,
  updateProfile,
  changeUserType,
};
