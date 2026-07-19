import servicesRepository from '../../infrastructure/persistence/services.repository.js';

export const listAllServices = async (data, caller) => {
  const tenantId = data.query?.tenantId ? parseInt(data.query.tenantId) : caller.tenantId;
  const services = await servicesRepository.getAll(tenantId);
  return {
    success: true,
    message: 'Hizmetler başarıyla getirildi.',
    list: services
  };
};

export const createService = async (data, caller) => {
  const { servicesName, servicesPrice, servicesDurationMin } = data.body;
  if (!servicesName || !servicesName.trim()) throw new Error('Hizmet adı boş olamaz.');
  if (!servicesPrice || servicesPrice <= 0) throw new Error('Fiyat sıfırdan büyük olmalıdır.');
  if (!servicesDurationMin || servicesDurationMin <= 0) throw new Error('Süre sıfırdan büyük olmalıdır.');

  const created = await servicesRepository.create(
    { servicesName: servicesName.trim(), servicesPrice, servicesDurationMin, tenantId: caller.tenantId },
    caller.usersId
  );
  return { success: true, message: 'Hizmet oluşturuldu.', item: created };
};

export const updateService = async (data, caller) => {
  const { body, params } = data;
  const updated = await servicesRepository.update(params.servicesId, body, caller.usersId);
  return { success: true, message: 'Hizmet güncellendi.', item: updated };
};

export const deleteService = async (data, caller) => {
  const deleted = await servicesRepository.softDelete(data.params.servicesId, caller.usersId);
  if (!deleted) throw new Error('Hizmet bulunamadı.');
  return { success: true, message: 'Hizmet silindi.' };
};

export default { listAllServices, createService, updateService, deleteService };
