import { Outlet } from 'react-router-dom';
import { NavBar } from 'components/nav-bar/index';
import { useAuth } from 'hooks/index';
import { LoadingPage } from 'components/common/index';

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
