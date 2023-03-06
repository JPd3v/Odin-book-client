import { useAuth } from 'features/auth/index';
import { Navigate, Outlet } from 'react-router-dom';

export default function AuthGuard() {
  const { userToken } = useAuth();
  return userToken ? <Outlet /> : <Navigate to="/" />;
}
