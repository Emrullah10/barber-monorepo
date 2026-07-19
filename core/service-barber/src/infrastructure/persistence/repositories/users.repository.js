import { createScript } from '../schemas/db-script-helper.js';
import { dbDtoToObject } from '../schemas/object-to-db-dto.js';
import schemas from '../schemas/schema-models.js';

const mapUserWithType = (row) => {
  const user = dbDtoToObject(schemas.users.users, row);
  user.userTypeCode = row.user_types_code ?? null;
  user.userTypeName = row.user_types_name ?? null;
  return user;
};

export const makeUsersRepository = ({ query }) => ({
  getAll: async () => {
    const text = `
      SELECT u.*, ut.user_types_code, ut.user_types_name
      FROM iam.users u
      LEFT JOIN iam.user_types ut ON u.user_type_code = ut.user_types_code
      ORDER BY u.users_id DESC;
    `;
    const { rows } = await query(text);
    return rows.map(mapUserWithType);
  },

  create: async (userData, caller) => {
    const { script, data } = createScript(
      schemas.users.table.tableNameWithSchema,
      userData,
      schemas.users.users,
      caller,
    );
    const { rows } = await query(script, data);
    return rows[0] ? dbDtoToObject(schemas.users.users, rows[0]) : null;
  },

  getByEmail: async (email) => {
    const text = `
      SELECT u.*, ut.user_types_code, ut.user_types_name
      FROM iam.users u
      LEFT JOIN iam.user_types ut ON u.user_type_code = ut.user_types_code
      WHERE u.users_email = $1;
    `;
    const { rows } = await query(text, [email]);
    return rows[0] ? mapUserWithType(rows[0]) : null;
  },

  getByRole: async (role) => {
    const text = `
      SELECT u.*, ut.user_types_code, ut.user_types_name,
             t.tenant_id AS barber_tenant_id, t.tenant_slug AS barber_tenant_slug, t.tenant_name AS barber_tenant_name
      FROM iam.users u
      LEFT JOIN iam.user_types ut ON u.user_type_code = ut.user_types_code
      LEFT JOIN iam.tenant_users tu ON u.users_id = tu.users_id
      LEFT JOIN iam.tenants t ON tu.tenant_id = t.tenant_id AND t.tenant_is_active = true
      WHERE u.users_role = $1
      ORDER BY u.users_id ASC;
    `;
    const { rows } = await query(text, [role]);
    return rows.map((row) => {
      const user = mapUserWithType(row);
      user.tenantId = row.barber_tenant_id ?? null;
      user.tenantSlug = row.barber_tenant_slug ?? null;
      user.tenantName = row.barber_tenant_name ?? null;
      return user;
    });
  },

  getById: async (id) => {
    const text = `
      SELECT u.*, ut.user_types_code, ut.user_types_name
      FROM iam.users u
      LEFT JOIN iam.user_types ut ON u.user_type_code = ut.user_types_code
      WHERE u.users_id = $1;
    `;
    const { rows } = await query(text, [id]);
    return rows[0] ? mapUserWithType(rows[0]) : null;
  },

  updateProfile: async (usersId, profileData) => {
    const fields = [];
    const values = [];
    let idx = 1;

    if (profileData.usersSpecialty !== undefined) {
      fields.push(`users_specialty = $${idx++}`);
      values.push(profileData.usersSpecialty);
    }
    if (profileData.usersBio !== undefined) {
      fields.push(`users_bio = $${idx++}`);
      values.push(profileData.usersBio);
    }
    if (profileData.usersPhotoUrl !== undefined) {
      fields.push(`users_photo_url = $${idx++}`);
      values.push(profileData.usersPhotoUrl);
    }
    if (profileData.usersName !== undefined) {
      fields.push(`users_name = $${idx++}`);
      values.push(profileData.usersName);
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = NOW()`);
    values.push(usersId);

    const text = `UPDATE iam.users SET ${fields.join(', ')} WHERE users_id = $${idx} RETURNING *;`;
    const { rows } = await query(text, values);
    return rows[0] ? dbDtoToObject(schemas.users.users, rows[0]) : null;
  },

  updateUserType: async (usersId, userTypeCode) => {
    const text = `
      UPDATE iam.users u
      SET user_type_code = ut.user_types_code, updated_at = NOW()
      FROM iam.user_types ut
      WHERE ut.user_types_code = $1 AND u.users_id = $2
      RETURNING u.*;
    `;
    const { rows } = await query(text, [userTypeCode, usersId]);
    return rows[0] ? dbDtoToObject(schemas.users.users, rows[0]) : null;
  },

  updatePasswordHash: async (usersId, passwordHash) => {
    const text = `UPDATE iam.users SET users_password = $1, updated_at = NOW() WHERE users_id = $2 RETURNING *;`;
    const { rows } = await query(text, [passwordHash, usersId]);
    return rows[0] ? dbDtoToObject(schemas.users.users, rows[0]) : null;
  },
});
