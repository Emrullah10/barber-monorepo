import appointmentsRepository from '../../infrastructure/persistence/appointments.repository.js';
import { CustomError } from '../../../../shared/utils/custom-error.js';

export const createAppointment = async (data, caller) => {
  const { body } = data;

  if (!body.servicesId || !body.appointmentDate || !body.appointmentTime) {
    throw new CustomError('Hizmet, tarih ve saat zorunludur.', 400);
  }

  const appointment = await appointmentsRepository.create({
    usersId: caller.usersId,
    barberId: body.barberId || null,
    servicesId: body.servicesId,
    appointmentDate: body.appointmentDate,
    appointmentTime: body.appointmentTime,
    tenantId: body.tenantId || caller.tenantId,
  });

  return { success: true, message: 'Randevu başarıyla oluşturuldu.', item: appointment };
};

export const listMyAppointments = async (data, caller) => {
  const appointments = await appointmentsRepository.getByUserId(caller.usersId);
  return { success: true, message: 'Randevular getirildi.', list: appointments };
};

export const listBarberAppointments = async (data, caller) => {
  // Berber kendi randevularını görür; admin/manager_barber hepsini görebilir
  const isManager = ['admin', 'manager_barber'].includes(caller.userTypeCode);
  const targetBarberId = isManager && data.query?.barberId
    ? data.query.barberId
    : caller.usersId;

  const appointments = await appointmentsRepository.getByBarberId(targetBarberId);
  return { success: true, message: 'Berber randevuları getirildi.', list: appointments };
};

export const listAllAppointments = async (data, caller) => {
  if (!['admin', 'manager_barber'].includes(caller.userTypeCode)) {
    throw new CustomError('Bu işlem için yetkiniz bulunmuyor.', 403);
  }
  const appointments = await appointmentsRepository.getAll(caller.tenantId);
  return { success: true, message: 'Tüm randevular getirildi.', list: appointments };
};

export const changeStatus = async (data, caller) => {
  const { body, params } = data;
  const { appointmentsId } = params;
  const { status } = body;

  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new CustomError('Geçersiz randevu durumu.', 400);
  }

  const updated = await appointmentsRepository.updateStatus(appointmentsId, status, caller.usersId);
  if (!updated) throw new CustomError('Randevu bulunamadı.', 404);

  return { success: true, message: 'Randevu durumu güncellendi.', item: updated };
};

export default { createAppointment, listMyAppointments, listBarberAppointments, listAllAppointments, changeStatus };
