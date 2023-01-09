import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import useAuth from '../hooks/useAuth';
import LoadingPage from '../utils/LoadingPage';

export default function PageLayout() {
  const { userToken } = useAuth();

  return userToken === undefined ? (
    <LoadingPage />
  ) : (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
