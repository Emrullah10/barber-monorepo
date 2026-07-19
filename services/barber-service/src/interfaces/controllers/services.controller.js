export const makeServicesController = ({ useCases }) => ({
  getAllServices: async (req, caller) => useCases.listAllServices(req, caller),
  createService: async (req, caller) => useCases.createService(req, caller),
  updateService: async (req, caller) => useCases.updateService(req, caller),
  deleteService: async (req, caller) => useCases.deleteService(req, caller),
});
