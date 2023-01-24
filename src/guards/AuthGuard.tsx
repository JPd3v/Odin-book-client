import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../hooks/index';

export default function AuthGuard() {
  const { userToken } = useAuth();
  return userToken ? <Outlet /> : <Navigate to="/" />;
}
