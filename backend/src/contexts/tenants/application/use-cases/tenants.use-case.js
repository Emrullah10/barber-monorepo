import tenantsRepository from '../../infrastructure/persistence/tenants.repository.js';
import usersRepository from '../../../users/infrastructure/persistence/users.repository.js';
import { CustomError } from '../../../../shared/utils/custom-error.js';

export const listTenants = async (data, caller) => {
  const tenants = await tenantsRepository.getAll();
  return { success: true, message: 'Dükkanlar getirildi.', list: tenants };
};

export const getTenantBySlug = async (data, caller) => {
  const { slug } = data.params;
  const tenant = await tenantsRepository.getBySlug(slug);
  if (!tenant) throw new CustomError('Dükkan bulunamadı.', 404);
  const barbers = await tenantsRepository.getBarbersByTenantId(tenant.tenantId);
  return { success: true, message: 'Dükkan bilgisi getirildi.', item: { ...tenant, barbers } };
};

export const getTenantById = async (data, caller) => {
  const { tenantId } = data.params;
  const tenant = await tenantsRepository.getById(parseInt(tenantId));
  if (!tenant) throw new CustomError('Dükkan bulunamadı.', 404);
  return { success: true, message: 'Dükkan bilgisi getirildi.', item: tenant };
};

export const createTenant = async (data, caller) => {
  const { body } = data;
  if (!body.tenantName || !body.tenantSlug) {
    throw new CustomError('Dükkan adı ve slug zorunludur.', 400);
  }
  const existing = await tenantsRepository.getBySlug(body.tenantSlug);
  if (existing) throw new CustomError('Bu slug zaten kullanılıyor.', 409);

  const tenant = await tenantsRepository.create({ ...body, ownerUserId: body.ownerUserId || caller.usersId });

  // Owner'ı tenant_users'a ekle
  if (tenant) {
    await tenantsRepository.addBarberToTenant(tenant.tenantId, tenant.ownerUserId, 'owner');
  }

  return { success: true, message: 'Dükkan oluşturuldu.', item: tenant };
};

export const updateTenant = async (data, caller) => {
  const { params, body } = data;
  const tenantId = parseInt(params.tenantId);

  // Sadece owner veya admin güncelleyebilir
  if (caller.userTypeCode !== 'admin' && caller.tenantId !== tenantId) {
    throw new CustomError('Bu dükkânı güncelleme yetkiniz yok.', 403);
  }

  const updated = await tenantsRepository.update(tenantId, body);
  return { success: true, message: 'Dükkan güncellendi.', item: updated };
};

export const getTenantBarbers = async (data, caller) => {
  const tenantId = parseInt(data.params.tenantId);
  const barbers = await tenantsRepository.getBarbersByTenantId(tenantId);
  return { success: true, message: 'Dükkan berberleri getirildi.', list: barbers };
};

export const addBarber = async (data, caller) => {
  const tenantId = parseInt(data.params.tenantId);
  const { usersId, roleInTenant } = data.body;

  if (caller.userTypeCode !== 'admin' && caller.tenantId !== tenantId) {
    throw new CustomError('Bu dükkâna berber ekleme yetkiniz yok.', 403);
  }

  const result = await tenantsRepository.addBarberToTenant(tenantId, usersId, roleInTenant || 'barber');
  return { success: true, message: 'Berber dükkana eklendi.', item: result };
};

export const removeBarber = async (data, caller) => {
  const tenantId = parseInt(data.params.tenantId);
  const usersId = parseInt(data.params.usersId);

  if (caller.userTypeCode !== 'admin' && caller.tenantId !== tenantId) {
    throw new CustomError('Bu dükkândan berber çıkarma yetkiniz yok.', 403);
  }

  const result = await tenantsRepository.removeBarberFromTenant(tenantId, usersId);
  return { success: true, message: 'Berber dükkandan çıkarıldı.', item: result };
};

export const onboardShop = async (data, caller) => {
  const { body } = data;
  if (!body.tenantName || !body.tenantSlug) {
    throw new CustomError('Dükkan adı ve slug zorunludur.', 400);
  }

  const existing = await tenantsRepository.getBySlug(body.tenantSlug);
  if (existing) throw new CustomError('Bu slug zaten kullanılıyor.', 409);

  // 1. Tenant oluştur
  const tenant = await tenantsRepository.create({
    ...body,
    ownerUserId: caller.usersId,
  });

  if (!tenant) throw new CustomError('Dükkan oluşturulamadı.', 500);

  // 2. Kullanıcıyı manager_barber yap
  await usersRepository.updateUserType(caller.usersId, 'manager_barber');

  // 3. Kullanıcıyı tenant_users'a manager_barber olarak ekle
  await tenantsRepository.addBarberToTenant(tenant.tenantId, caller.usersId, 'manager_barber');

  return {
    success: true,
    message: 'Dükkan oluşturuldu ve hesabınız yükseltildi.',
    item: tenant,
  };
};

export default { listTenants, getTenantBySlug, getTenantById, createTenant, updateTenant, getTenantBarbers, addBarber, removeBarber, onboardShop };
