export const makeBarberAvailabilityController = ({ useCases }) => ({
  getMyAvailability: async (req, caller) => useCases.getMyAvailability(req, caller),
  updateAvailability: async (req, caller) => useCases.updateAvailability(req, caller),
});
