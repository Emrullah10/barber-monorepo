import availabilityUseCase from '../../application/use-cases/barber_availability.use-case.js';

export const getMyAvailability = async (req, caller) =>
  availabilityUseCase.getMyAvailability(req, caller);

export const updateAvailability = async (req, caller) =>
  availabilityUseCase.updateAvailability(req, caller);

export default { getMyAvailability, updateAvailability };
