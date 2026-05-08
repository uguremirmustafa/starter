import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth.ts';
import { useCurrentUser } from '../hooks/auth/useCurrentUser';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const { isLoading } = useCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return null; // spinner while rehydrating
  }

  return <Outlet />;
}
