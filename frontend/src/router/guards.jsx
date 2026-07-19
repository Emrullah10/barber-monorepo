import { Navigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';

export const BARBER_TYPES = ['barber', 'manager_barber', 'admin'];
export const MANAGER_TYPES = ['manager_barber', 'admin'];
export const ADMIN_TYPES = ['admin'];

export function DefaultRedirect() {
  const { getDefaultPath } = useRoleGuard();
  return <Navigate to={getDefaultPath()} replace />;
}
