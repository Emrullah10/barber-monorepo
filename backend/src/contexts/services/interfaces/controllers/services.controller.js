import servicesUseCase from '../../application/use-cases/services.use-case.js';

export const getAllServices = async (req, caller) => {
  return await servicesUseCase.listAllServices(req, caller);
};

export const createService = async (req, caller) => {
  return await servicesUseCase.createService(req, caller);
};

export const updateService = async (req, caller) => {
  return await servicesUseCase.updateService(req, caller);
};

export const deleteService = async (req, caller) => {
  return await servicesUseCase.deleteService(req, caller);
};

export default { getAllServices, createService, updateService, deleteService };
