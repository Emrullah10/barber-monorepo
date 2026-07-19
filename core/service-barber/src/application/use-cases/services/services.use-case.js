import { CustomError } from '@barber/errors';

export const makeListAllServices = ({ servicesRepository }) => async (data, caller) => {
  const tenantId = data.query?.tenantId ? parseInt(data.query.tenantId) : caller.tenantId;
  const services = await servicesRepository.getAll(tenantId);
  return {
    success: true,
    message: 'Hizmetler başarıyla getirildi.',
    list: services,
  };
};

export const makeCreateService = ({ servicesRepository }) => async (data, caller) => {
  const { servicesName, servicesPrice, servicesDurationMin } = data.body;
  if (!servicesName || !servicesName.trim()) throw new CustomError('Hizmet adı boş olamaz.', 400);
  if (!servicesPrice || servicesPrice <= 0) throw new CustomError('Fiyat sıfırdan büyük olmalıdır.', 400);
  if (!servicesDurationMin || servicesDurationMin <= 0) throw new CustomError('Süre sıfırdan büyük olmalıdır.', 400);

  const created = await servicesRepository.create(
    { servicesName: servicesName.trim(), servicesPrice, servicesDurationMin, tenantId: caller.tenantId },
    caller.usersId,
  );
  return { success: true, message: 'Hizmet oluşturuldu.', item: created };
};

export const makeUpdateService = ({ servicesRepository }) => async (data, caller) => {
  const { body, params } = data;
  const updated = await servicesRepository.update(params.servicesId, body, caller.usersId);
  return { success: true, message: 'Hizmet güncellendi.', item: updated };
};

export const makeDeleteService = ({ servicesRepository }) => async (data, caller) => {
  const deleted = await servicesRepository.softDelete(data.params.servicesId, caller.usersId);
  if (!deleted) throw new CustomError('Hizmet bulunamadı.', 404);
  return { success: true, message: 'Hizmet silindi.' };
};
