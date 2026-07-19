import { Navigate, Outlet } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';

export function RoleGuard({ allowedTypes, children }) {
  const { isLoggedIn, typeCode, getDefaultPath } = useRoleGuard();

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (allowedTypes && !allowedTypes.includes(typeCode)) {
    return <Navigate to={getDefaultPath()} replace />;
  }

  return children ?? <Outlet />;
}
