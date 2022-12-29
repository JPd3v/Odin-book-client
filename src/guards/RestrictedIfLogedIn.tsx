import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function RestrictedIfLogedIn() {
  const { userToken } = useAuth();
  return userToken ? <Navigate to="/" /> : <Outlet />;
}
