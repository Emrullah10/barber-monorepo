import { query } from '../../../../infrastructure/persistence/persistence-utils.js';
import { dbDtoToObject } from '../../../../infrastructure/helper/object-to-db-dto.js';
import schemas from '../../../../../definitions/schema-models.js';

const mapRow = (row) => {
  const appt = dbDtoToObject(schemas.appointments.appointments, row);
  appt.serviceName = row.services_name ?? null;
  appt.servicePrice = row.services_price ?? null;
  appt.customerName = row.customer_name ?? null;
  appt.barberName = row.barber_name ?? null;
  return appt;
};

const BASE_QUERY = `
  SELECT
    a.*,
    s.services_name,
    s.services_price,
    cu.users_name AS customer_name,
    bu.users_name AS barber_name
  FROM iam.appointments a
  LEFT JOIN iam.services s ON a.services_id = s.services_id
  LEFT JOIN iam.users cu ON a.users_id = cu.users_id
  LEFT JOIN iam.users bu ON a.barber_id = bu.users_id
`;

export const create = async ({ usersId, barberId, servicesId, appointmentDate, appointmentTime, tenantId }) => {
  const text = `
    INSERT INTO iam.appointments
      (users_id, barber_id, services_id, appointment_date, appointment_time, appointment_status, tenant_id, insert_datetime)
    VALUES ($1, $2, $3, $4, $5, 'pending', $6, NOW())
    RETURNING *;
  `;
  const { rows } = await query(text, [usersId, barberId || null, servicesId, appointmentDate, appointmentTime, tenantId || null]);
  return rows[0] ? dbDtoToObject(schemas.appointments.appointments, rows[0]) : null;
};

export const getByUserId = async (usersId) => {
  const text = `${BASE_QUERY} WHERE a.users_id = $1 ORDER BY a.appointment_date DESC, a.appointment_time DESC;`;
  const { rows } = await query(text, [usersId]);
  return rows.map(mapRow);
};

export const getByBarberId = async (barberId) => {
  const text = `${BASE_QUERY} WHERE a.barber_id = $1 ORDER BY a.appointment_date DESC, a.appointment_time DESC;`;
  const { rows } = await query(text, [barberId]);
  return rows.map(mapRow);
};

export const getAll = async (tenantId = null) => {
  let text = BASE_QUERY;
  const values = [];
  if (tenantId) {
    text += ` WHERE a.tenant_id = $1`;
    values.push(tenantId);
  }
  text += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC;`;
  const { rows } = await query(text, values);
  return rows.map(mapRow);
};

export const updateStatus = async (appointmentsId, status, callerId) => {
  const text = `
    UPDATE iam.appointments
    SET appointment_status = $1, update_datetime = NOW(), update_user_id = $2
    WHERE appointments_id = $3
    RETURNING *;
  `;
  const { rows } = await query(text, [status, callerId, appointmentsId]);
  return rows[0] ? dbDtoToObject(schemas.appointments.appointments, rows[0]) : null;
};

export default { create, getByUserId, getByBarberId, getAll, updateStatus };
