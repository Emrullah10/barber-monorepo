import { useAuthStore } from '@/store/authStore';

const ROLE_HIERARCHY = {
  admin: 4,
  manager_barber: 3,
  barber: 2,
  customer: 1,
  public: 0,
};

export const useRoleGuard = () => {
  const { isLoggedIn, user } = useAuthStore();
  const typeCode = user?.userTypeCode ?? null;

  const is = (code) => typeCode === code;
  const isAdmin = () => is('admin');
  const isManagerBarber = () => is('manager_barber');
  const isAnyBarber = () => ['barber', 'manager_barber'].includes(typeCode);
  const isCustomer = () => is('customer');
  const hasMinRole = (minCode) =>
    (ROLE_HIERARCHY[typeCode] ?? 0) >= (ROLE_HIERARCHY[minCode] ?? 0);

  const getDefaultPath = () => {
    if (!isLoggedIn) return '/login';
    if (is('admin')) return '/admin/users';
    if (isAnyBarber()) return '/barber/dashboard';
    return '/my-appointments';
  };

  return { isLoggedIn, user, typeCode, is, isAdmin, isManagerBarber, isAnyBarber, isCustomer, hasMinRole, getDefaultPath };
};
