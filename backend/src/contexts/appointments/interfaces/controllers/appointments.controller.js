import appointmentsUseCase from '../../application/use-cases/appointments.use-case.js';

export const createAppointment = async (req, caller) =>
  appointmentsUseCase.createAppointment(req, caller);

export const getMyAppointments = async (req, caller) =>
  appointmentsUseCase.listMyAppointments(req, caller);

export const getBarberAppointments = async (req, caller) =>
  appointmentsUseCase.listBarberAppointments(req, caller);

export const getAllAppointments = async (req, caller) =>
  appointmentsUseCase.listAllAppointments(req, caller);

export const patchAppointmentStatus = async (req, caller) =>
  appointmentsUseCase.changeStatus(req, caller);

export default {
  createAppointment,
  getMyAppointments,
  getBarberAppointments,
  getAllAppointments,
  patchAppointmentStatus,
};
