export const getCaller = (headers, isPublic = false) => {
  if (isPublic) {
    return {
      usersId: null,
      usersRole: 'public',
      userTypeCode: null,
      ip: headers['x-forwarded-for'] || 'unknown',
    };
  }

  const usersId = headers['userid'];
  const usersRole = headers['userrole'];
  const userTypeCode = headers['usertypecode'] || null;
  const tenantId = headers['tenantid'];
  const tenantSlug = headers['tenantslug'] || null;

  return {
    usersId: usersId ? parseInt(usersId) : null,
    usersRole: usersRole || 'unknown',
    userTypeCode: userTypeCode || null,
    tenantId: tenantId ? parseInt(tenantId) : null,
    tenantSlug: tenantSlug || null,
    ip: headers['x-forwarded-for'] || 'unknown',
  };
};
