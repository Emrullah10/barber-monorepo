import { query } from '../../../../infrastructure/persistence/persistence-utils.js';
import { dbDtoToObject } from '../../../../infrastructure/helper/object-to-db-dto.js';
import schemas from '../../../../../definitions/schema-models.js';

export const getByBarberId = async (barberId) => {
  const text = `
    SELECT * FROM iam.barber_availability
    WHERE barber_id = $1
    ORDER BY day_of_week ASC;
  `;
  const { rows } = await query(text, [barberId]);
  return rows.map(row => dbDtoToObject(schemas.barberAvailability.barberAvailability, row));
};

export const upsert = async (barberId, dayOfWeek, startTime, endTime, isActive, callerId, tenantId = null) => {
  const text = `
    INSERT INTO iam.barber_availability
      (barber_id, day_of_week, start_time, end_time, is_active, tenant_id, insert_user_id, insert_datetime)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    ON CONFLICT (barber_id, day_of_week)
    DO UPDATE SET
      start_time = EXCLUDED.start_time,
      end_time = EXCLUDED.end_time,
      is_active = EXCLUDED.is_active,
      update_user_id = $7,
      update_datetime = NOW()
    RETURNING *;
  `;
  const { rows } = await query(text, [barberId, dayOfWeek, startTime, endTime, isActive, tenantId, callerId]);
  return rows[0] ? dbDtoToObject(schemas.barberAvailability.barberAvailability, rows[0]) : null;
};

export default { getByBarberId, upsert };
