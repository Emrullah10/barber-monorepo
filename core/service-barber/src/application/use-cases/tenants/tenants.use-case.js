import { CustomError } from '@barber/errors';

export const makeListTenants = ({ tenantsRepository }) => async (data, caller) => {
  const tenants = await tenantsRepository.getAll();
  return { success: true, message: 'Dükkanlar getirildi.', list: tenants };
};

export const makeGetTenantBySlug = ({ tenantsRepository }) => async (data, caller) => {
  const { slug } = data.params;
  const tenant = await tenantsRepository.getBySlug(slug);
  if (!tenant) throw new CustomError('Dükkan bulunamadı.', 404);
  const barbers = await tenantsRepository.getBarbersByTenantId(tenant.tenantId);
  return { success: true, message: 'Dükkan bilgisi getirildi.', item: { ...tenant, barbers } };
};

export const makeGetTenantById = ({ tenantsRepository }) => async (data, caller) => {
  const { tenantId } = data.params;
  const tenant = await tenantsRepository.getById(parseInt(tenantId));
  if (!tenant) throw new CustomError('Dükkan bulunamadı.', 404);
  return { success: true, message: 'Dükkan bilgisi getirildi.', item: tenant };
};

export const makeCreateTenant = ({ tenantsRepository }) => async (data, caller) => {
  const { body } = data;
  if (!body.tenantName || !body.tenantSlug) {
    throw new CustomError('Dükkan adı ve slug zorunludur.', 400);
  }
  const existing = await tenantsRepository.getBySlug(body.tenantSlug);
  if (existing) throw new CustomError('Bu slug zaten kullanılıyor.', 409);

  const tenant = await tenantsRepository.create({ ...body, ownerUserId: body.ownerUserId || caller.usersId });

  if (tenant) {
    await tenantsRepository.addBarberToTenant(tenant.tenantId, tenant.ownerUserId, 'owner');
  }

  return { success: true, message: 'Dükkan oluşturuldu.', item: tenant };
};

export const makeUpdateTenant = ({ tenantsRepository }) => async (data, caller) => {
  const { params, body } = data;
  const tenantId = parseInt(params.tenantId);

  if (caller.userTypeCode !== 'admin' && caller.tenantId !== tenantId) {
    throw new CustomError('Bu dükkânı güncelleme yetkiniz yok.', 403);
  }

  const updated = await tenantsRepository.update(tenantId, body);
  return { success: true, message: 'Dükkan güncellendi.', item: updated };
};

export const makeGetTenantBarbers = ({ tenantsRepository }) => async (data, caller) => {
  const tenantId = parseInt(data.params.tenantId);
  const barbers = await tenantsRepository.getBarbersByTenantId(tenantId);
  return { success: true, message: 'Dükkan berberleri getirildi.', list: barbers };
};

export const makeAddBarber = ({ tenantsRepository }) => async (data, caller) => {
  const tenantId = parseInt(data.params.tenantId);
  const { usersId, roleInTenant } = data.body;

  if (caller.userTypeCode !== 'admin' && caller.tenantId !== tenantId) {
    throw new CustomError('Bu dükkâna berber ekleme yetkiniz yok.', 403);
  }

  const result = await tenantsRepository.addBarberToTenant(tenantId, usersId, roleInTenant || 'barber');
  return { success: true, message: 'Berber dükkana eklendi.', item: result };
};

export const makeRemoveBarber = ({ tenantsRepository }) => async (data, caller) => {
  const tenantId = parseInt(data.params.tenantId);
  const usersId = parseInt(data.params.usersId);

  if (caller.userTypeCode !== 'admin' && caller.tenantId !== tenantId) {
    throw new CustomError('Bu dükkândan berber çıkarma yetkiniz yok.', 403);
  }

  const result = await tenantsRepository.removeBarberFromTenant(tenantId, usersId);
  return { success: true, message: 'Berber dükkandan çıkarıldı.', item: result };
};

export const makeOnboardShop = ({ tenantsRepository, usersRepository }) => async (data, caller) => {
  const { body } = data;
  if (!body.tenantName || !body.tenantSlug) {
    throw new CustomError('Dükkan adı ve slug zorunludur.', 400);
  }

  const existing = await tenantsRepository.getBySlug(body.tenantSlug);
  if (existing) throw new CustomError('Bu slug zaten kullanılıyor.', 409);

  const tenant = await tenantsRepository.create({
    ...body,
    ownerUserId: caller.usersId,
  });

  if (!tenant) throw new CustomError('Dükkan oluşturulamadı.', 500);

  await usersRepository.updateUserType(caller.usersId, 'manager_barber');
  await tenantsRepository.addBarberToTenant(tenant.tenantId, caller.usersId, 'manager_barber');

  return {
    success: true,
    message: 'Dükkan oluşturuldu ve hesabınız yükseltildi.',
    item: tenant,
  };
};
