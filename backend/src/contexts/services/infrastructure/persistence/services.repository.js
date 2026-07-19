import { query } from '../../../../infrastructure/persistence/persistence-utils.js';
import { dbDtoToObject } from '../../../../infrastructure/helper/object-to-db-dto.js';
import schemas from '../../../../../definitions/schema-models.js';

export const create = async ({ servicesName, servicesPrice, servicesDurationMin, tenantId }, callerId) => {
  const text = `INSERT INTO iam.services (services_name, services_price, services_duration_min, tenant_id, services_is_active, insert_user_id, insert_datetime, update_user_id, update_datetime)
    VALUES ($1, $2, $3, $4, true, $5, NOW(), $5, NOW()) RETURNING *;`;
  const values = [servicesName, servicesPrice, servicesDurationMin, tenantId, callerId];
  const { rows } = await query(text, values);
  return rows[0] ? dbDtoToObject(schemas.services.services, rows[0]) : null;
};

export const softDelete = async (servicesId, callerId) => {
  const text = `UPDATE iam.services SET services_is_active = false, update_user_id = $1, update_datetime = NOW() WHERE services_id = $2 RETURNING *;`;
  const { rows } = await query(text, [callerId, servicesId]);
  return rows[0] ? dbDtoToObject(schemas.services.services, rows[0]) : null;
};

export const getAll = async (tenantId = null) => {
  const values = [];
  let tenantFilter = '';
  if (tenantId) {
    tenantFilter = ' AND s.tenant_id = $1';
    values.push(tenantId);
  }
  const text = `
    SELECT s.*, t.tenant_slug, t.tenant_name
    FROM ${schemas.services.table.tableNameWithSchema} s
    LEFT JOIN iam.tenants t ON s.tenant_id = t.tenant_id
    WHERE s.services_is_active = true${tenantFilter}
    ORDER BY s.services_id ASC;
  `;
  const { rows } = await query(text, values);
  return rows.map(row => {
    const service = dbDtoToObject(schemas.services.services, row);
    service.tenantSlug = row.tenant_slug ?? null;
    service.tenantName = row.tenant_name ?? null;
    return service;
  });
};

export const update = async (servicesId, { servicesName, servicesPrice, servicesDurationMin, servicesIsActive }, callerId) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (servicesName !== undefined) { fields.push(`services_name = $${idx++}`); values.push(servicesName); }
  if (servicesPrice !== undefined) { fields.push(`services_price = $${idx++}`); values.push(servicesPrice); }
  if (servicesDurationMin !== undefined) { fields.push(`services_duration_min = $${idx++}`); values.push(servicesDurationMin); }
  if (servicesIsActive !== undefined) { fields.push(`services_is_active = $${idx++}`); values.push(servicesIsActive); }

  if (fields.length === 0) return null;
  fields.push(`update_user_id = $${idx++}`, `update_datetime = NOW()`);
  values.push(callerId, servicesId);

  const text = `UPDATE iam.services SET ${fields.join(', ')} WHERE services_id = $${idx} RETURNING *;`;
  const { rows } = await query(text, values);
  return rows[0] ? dbDtoToObject(schemas.services.services, rows[0]) : null;
};

export default { create, softDelete, getAll, update };
