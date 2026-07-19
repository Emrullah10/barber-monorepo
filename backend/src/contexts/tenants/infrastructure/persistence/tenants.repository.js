import { query } from '../../../../infrastructure/persistence/persistence-utils.js';
import { dbDtoToObject } from '../../../../infrastructure/helper/object-to-db-dto.js';
import schemas from '../../../../../definitions/schema-models.js';

const mapTenant = (row) => dbDtoToObject(schemas.tenants.tenants, row);

export const getAll = async () => {
  const text = `SELECT * FROM iam.tenants WHERE tenant_is_active = true ORDER BY tenant_id ASC;`;
  const { rows } = await query(text);
  return rows.map(mapTenant);
};

export const getById = async (tenantId) => {
  const text = `SELECT * FROM iam.tenants WHERE tenant_id = $1;`;
  const { rows } = await query(text, [tenantId]);
  return rows[0] ? mapTenant(rows[0]) : null;
};

export const getBySlug = async (slug) => {
  const text = `SELECT * FROM iam.tenants WHERE tenant_slug = $1 AND tenant_is_active = true;`;
  const { rows } = await query(text, [slug]);
  return rows[0] ? mapTenant(rows[0]) : null;
};

export const create = async ({ tenantName, tenantSlug, tenantPhone, tenantEmail, tenantAddress, tenantCity, tenantPhotoUrl, ownerUserId }) => {
  const text = `
    INSERT INTO iam.tenants
      (tenant_code, tenant_name, tenant_slug, tenant_phone, tenant_email, tenant_address, tenant_city, tenant_photo_url, tenant_is_active, owner_user_id, created_at)
    VALUES (FLOOR(RANDOM() * 9000000000 + 1000000000)::bigint, $1, $2, $3, $4, $5, $6, $7, true, $8, NOW())
    RETURNING *;
  `;
  const { rows } = await query(text, [tenantName, tenantSlug, tenantPhone || null, tenantEmail || null, tenantAddress || null, tenantCity || null, tenantPhotoUrl || null, ownerUserId || null]);
  return rows[0] ? mapTenant(rows[0]) : null;
};

export const update = async (tenantId, data) => {
  const fields = [];
  const values = [];
  let idx = 1;

  const allowed = ['tenantName', 'tenantPhone', 'tenantEmail', 'tenantAddress', 'tenantCity', 'tenantPhotoUrl', 'tenantLatitude', 'tenantLongitude', 'tenantIsActive'];
  const colMap = {
    tenantName: 'tenant_name', tenantPhone: 'tenant_phone', tenantEmail: 'tenant_email',
    tenantAddress: 'tenant_address', tenantCity: 'tenant_city', tenantPhotoUrl: 'tenant_photo_url',
    tenantLatitude: 'tenant_latitude', tenantLongitude: 'tenant_longitude',
    tenantIsActive: 'tenant_is_active',
  };

  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${colMap[key]} = $${idx++}`);
      values.push(data[key]);
    }
  }
  if (fields.length === 0) return null;

  fields.push(`updated_at = NOW()`);
  values.push(tenantId);

  const text = `UPDATE iam.tenants SET ${fields.join(', ')} WHERE tenant_id = $${idx} RETURNING *;`;
  const { rows } = await query(text, values);
  return rows[0] ? mapTenant(rows[0]) : null;
};

// Tenant'a bağlı berberler
export const getBarbersByTenantId = async (tenantId) => {
  const text = `
    SELECT u.users_id, u.users_name, u.users_email, u.users_specialty, u.users_photo_url, tu.role_in_tenant, tu.is_active
    FROM iam.tenant_users tu
    JOIN iam.users u ON u.users_id = tu.users_id
    WHERE tu.tenant_id = $1
    ORDER BY tu.role_in_tenant DESC, u.users_name ASC;
  `;
  const { rows } = await query(text, [tenantId]);
  return rows.map(r => ({
    usersId: r.users_id,
    usersName: r.users_name,
    usersEmail: r.users_email,
    usersSpecialty: r.users_specialty,
    usersPhotoUrl: r.users_photo_url,
    roleInTenant: r.role_in_tenant,
    isActive: r.is_active,
  }));
};

// Berberi tenant'a ekle
export const addBarberToTenant = async (tenantId, usersId, roleInTenant = 'barber') => {
  const text = `
    INSERT INTO iam.tenant_users (tenant_id, users_id, role_in_tenant, is_active, joined_at)
    VALUES ($1, $2, $3, true, NOW())
    ON CONFLICT (tenant_id, users_id) DO UPDATE SET role_in_tenant = $3, is_active = true
    RETURNING *;
  `;
  const { rows } = await query(text, [tenantId, usersId, roleInTenant]);
  return rows[0] || null;
};

// Berberi tenant'tan çıkar
export const removeBarberFromTenant = async (tenantId, usersId) => {
  const text = `UPDATE iam.tenant_users SET is_active = false WHERE tenant_id = $1 AND users_id = $2 RETURNING *;`;
  const { rows } = await query(text, [tenantId, usersId]);
  return rows[0] || null;
};

export default { getAll, getById, getBySlug, create, update, getBarbersByTenantId, addBarberToTenant, removeBarberFromTenant };
