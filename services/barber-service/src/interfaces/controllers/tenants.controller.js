export const makeTenantsController = ({ useCases }) => ({
  listTenants: async (req, caller) => useCases.listTenants(req, caller),
  getTenantBySlug: async (req, caller) => useCases.getTenantBySlug(req, caller),
  getTenantById: async (req, caller) => useCases.getTenantById(req, caller),
  createTenant: async (req, caller) => useCases.createTenant(req, caller),
  updateTenant: async (req, caller) => useCases.updateTenant(req, caller),
  getTenantBarbers: async (req, caller) => useCases.getTenantBarbers(req, caller),
  addBarber: async (req, caller) => useCases.addBarber(req, caller),
  removeBarber: async (req, caller) => useCases.removeBarber(req, caller),
  onboardShop: async (req, caller) => useCases.onboardShop(req, caller),
});
