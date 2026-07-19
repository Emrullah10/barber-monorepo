import availabilityRepository from '../../infrastructure/persistence/barber_availability.repository.js';
import { CustomError } from '../../../../shared/utils/custom-error.js';

export const getMyAvailability = async (data, caller) => {
  const barberId = caller.usersId;
  const availability = await availabilityRepository.getByBarberId(barberId);
  return { success: true, message: 'Müsaitlik takvimi getirildi.', list: availability };
};

export const updateAvailability = async (data, caller) => {
  const { body } = data;

  if (!body.slots || !Array.isArray(body.slots)) {
    throw new CustomError('Geçersiz müsaitlik verisi.', 400);
  }

  const results = [];
  for (const slot of body.slots) {
    const { dayOfWeek, startTime, endTime, isActive } = slot;
    if (!dayOfWeek || dayOfWeek < 1 || dayOfWeek > 7) continue;
    const result = await availabilityRepository.upsert(
      caller.usersId, dayOfWeek, startTime || '09:00', endTime || '18:00',
      isActive !== false, caller.usersId, caller.tenantId
    );
    if (result) results.push(result);
  }

  return { success: true, message: 'Müsaitlik takvimi güncellendi.', list: results };
};

export default { getMyAvailability, updateAvailability };
