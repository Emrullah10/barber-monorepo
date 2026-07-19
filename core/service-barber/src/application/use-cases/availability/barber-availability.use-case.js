import { CustomError } from '@barber/errors';

export const makeGetMyAvailability = ({ barberAvailabilityRepository }) => async (data, caller) => {
  const barberId = caller.usersId;
  const availability = await barberAvailabilityRepository.getByBarberId(barberId);
  return { success: true, message: 'Müsaitlik takvimi getirildi.', list: availability };
};

export const makeUpdateAvailability = ({ barberAvailabilityRepository }) => async (data, caller) => {
  const { body } = data;

  if (!body.slots || !Array.isArray(body.slots)) {
    throw new CustomError('Geçersiz müsaitlik verisi.', 400);
  }

  const results = [];
  for (const slot of body.slots) {
    const { dayOfWeek, startTime, endTime, isActive } = slot;
    if (!dayOfWeek || dayOfWeek < 1 || dayOfWeek > 7) continue;
    const result = await barberAvailabilityRepository.upsert(
      caller.usersId, dayOfWeek, startTime || '09:00', endTime || '18:00',
      isActive !== false, caller.usersId, caller.tenantId,
    );
    if (result) results.push(result);
  }

  return { success: true, message: 'Müsaitlik takvimi güncellendi.', list: results };
};
