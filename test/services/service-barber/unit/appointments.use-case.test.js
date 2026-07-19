import { jest } from '@jest/globals';
import {
  makeCreateAppointment,
  makeChangeAppointmentStatus,
  makeListAllAppointments,
} from '@barber/core-service-barber/src/application/use-cases/appointments/appointments.use-case.js';

describe('makeCreateAppointment', () => {
  it('throws 400 when required fields are missing', async () => {
    const appointmentsRepository = { create: jest.fn() };
    const createAppointment = makeCreateAppointment({ appointmentsRepository });

    await expect(
      createAppointment({ body: {} }, { usersId: 1 }),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(appointmentsRepository.create).not.toHaveBeenCalled();
  });

  it('creates an appointment with caller context', async () => {
    const appointmentsRepository = {
      create: jest.fn().mockResolvedValue({ appointmentsId: 10 }),
    };
    const createAppointment = makeCreateAppointment({ appointmentsRepository });

    const result = await createAppointment(
      { body: { servicesId: 1, appointmentDate: '2026-01-01', appointmentTime: '10:00' } },
      { usersId: 42, tenantId: 7 },
    );

    expect(result.success).toBe(true);
    expect(appointmentsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ usersId: 42, tenantId: 7, servicesId: 1 }),
    );
  });
});

describe('makeChangeAppointmentStatus', () => {
  it('rejects invalid status values', async () => {
    const appointmentsRepository = { updateStatus: jest.fn() };
    const changeStatus = makeChangeAppointmentStatus({ appointmentsRepository });

    await expect(
      changeStatus({ body: { status: 'not-a-real-status' }, params: { appointmentsId: 1 } }, { usersId: 1 }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('throws 404 when appointment not found', async () => {
    const appointmentsRepository = { updateStatus: jest.fn().mockResolvedValue(null) };
    const changeStatus = makeChangeAppointmentStatus({ appointmentsRepository });

    await expect(
      changeStatus({ body: { status: 'confirmed' }, params: { appointmentsId: 999 } }, { usersId: 1 }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe('makeListAllAppointments', () => {
  it('rejects callers without manager/admin type', async () => {
    const appointmentsRepository = { getAll: jest.fn() };
    const listAll = makeListAllAppointments({ appointmentsRepository });

    await expect(
      listAll({}, { userTypeCode: 'barber' }),
    ).rejects.toMatchObject({ statusCode: 403 });
    expect(appointmentsRepository.getAll).not.toHaveBeenCalled();
  });

  it('allows manager_barber and admin callers', async () => {
    const appointmentsRepository = { getAll: jest.fn().mockResolvedValue([]) };
    const listAll = makeListAllAppointments({ appointmentsRepository });

    const result = await listAll({}, { userTypeCode: 'admin', tenantId: 3 });
    expect(result.success).toBe(true);
    expect(appointmentsRepository.getAll).toHaveBeenCalledWith(3);
  });
});
