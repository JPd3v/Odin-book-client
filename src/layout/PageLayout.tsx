import { Outlet } from 'react-router-dom';
import { useAuth } from 'hooks/index';
import { LoadingPage } from 'components/common/index';
import { MobileNavBar, NavBar } from 'components/ui';

export default function PageLayout() {
  const { userToken } = useAuth();

  return userToken === undefined ? (
    <LoadingPage />
  ) : (
    <>
      <NavBar />
      <Outlet />
      <MobileNavBar />
    </>
  );
}
