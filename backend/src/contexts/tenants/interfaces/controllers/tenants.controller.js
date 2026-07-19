import tenantsUseCase from '../../application/use-cases/tenants.use-case.js';

export const listTenants = async (req, caller) => {
  return await tenantsUseCase.listTenants(req, caller);
};

export const getTenantBySlug = async (req, caller) => {
  return await tenantsUseCase.getTenantBySlug(req, caller);
};

export const getTenantById = async (req, caller) => {
  return await tenantsUseCase.getTenantById(req, caller);
};

export const createTenant = async (req, caller) => {
  return await tenantsUseCase.createTenant(req, caller);
};

export const updateTenant = async (req, caller) => {
  return await tenantsUseCase.updateTenant(req, caller);
};

export const getTenantBarbers = async (req, caller) => {
  return await tenantsUseCase.getTenantBarbers(req, caller);
};

export const addBarber = async (req, caller) => {
  return await tenantsUseCase.addBarber(req, caller);
};

export const removeBarber = async (req, caller) => {
  return await tenantsUseCase.removeBarber(req, caller);
};

export const onboardShop = async (req, caller) => {
  return await tenantsUseCase.onboardShop(req, caller);
};

export default { listTenants, getTenantBySlug, getTenantById, createTenant, updateTenant, getTenantBarbers, addBarber, removeBarber, onboardShop };
