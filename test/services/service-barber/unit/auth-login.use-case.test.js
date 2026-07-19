import { jest } from '@jest/globals';
import { makeLogin } from '@barber/core-service-barber/src/application/use-cases/auth/auth.use-case.js';
import { CustomError } from '@barber/errors';

const buildLogin = ({ user, tenantMembership = null, compareResult = true } = {}) => {
  const usersRepository = {
    getByEmail: jest.fn().mockResolvedValue(user),
  };
  const tenantMembershipRepository = {
    getActiveMembership: jest.fn().mockResolvedValue(tenantMembership),
  };
  const hasher = {
    compare: jest.fn().mockResolvedValue(compareResult),
  };
  const jwt = {
    sign: jest.fn().mockReturnValue('fake-jwt-token'),
  };

  const login = makeLogin({
    usersRepository,
    tenantMembershipRepository,
    hasher,
    jwt,
    jwtSecret: 'test-secret',
  });

  return { login, usersRepository, tenantMembershipRepository, hasher, jwt };
};

describe('makeLogin', () => {
  it('throws 400 when email or password missing', async () => {
    const { login } = buildLogin();
    await expect(login({ body: { usersEmail: 'a@a.com' } }, {})).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it('throws 401 when user does not exist', async () => {
    const { login } = buildLogin({ user: null });
    await expect(
      login({ body: { usersEmail: 'nope@a.com', usersPassword: 'x' } }, {}),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('throws 401 when password does not match', async () => {
    const { login } = buildLogin({
      user: { usersId: 1, usersPassword: 'hash', usersEmail: 'a@a.com' },
      compareResult: false,
    });
    await expect(
      login({ body: { usersEmail: 'a@a.com', usersPassword: 'wrong' } }, {}),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('returns a token and tenant info on success', async () => {
    const { login } = buildLogin({
      user: {
        usersId: 1,
        usersName: 'Test',
        usersEmail: 'a@a.com',
        usersPassword: 'hash',
        usersRole: 'barber',
        userTypeCode: 'barber',
        userTypeName: 'Berber',
      },
      tenantMembership: { tenant_id: 5, tenant_slug: 'test-shop', tenant_name: 'Test Shop' },
    });

    const result = await login({ body: { usersEmail: 'a@a.com', usersPassword: 'correct' } }, {});

    expect(result.success).toBe(true);
    expect(result.token).toBe('fake-jwt-token');
    expect(result.user.tenantId).toBe(5);
    expect(result.user.tenantSlug).toBe('test-shop');
  });

  it('propagates CustomError instances unchanged', async () => {
    const { login } = buildLogin();
    try {
      await login({ body: {} }, {});
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
    }
  });
});
