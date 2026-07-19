export const makeTenantMembershipRepository = ({ query }) => ({
  getActiveMembership: async (usersId) => {
    const text = `
      SELECT tu.tenant_id, tu.role_in_tenant, t.tenant_slug, t.tenant_name
      FROM iam.tenant_users tu
      JOIN iam.tenants t ON t.tenant_id = tu.tenant_id
      WHERE tu.users_id = $1 AND tu.is_active = true AND t.tenant_is_active = true
      LIMIT 1;
    `;
    const { rows } = await query(text, [usersId]);
    return rows[0] || null;
  },
});
