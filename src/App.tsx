import './App.css';
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { LoadingPage } from './components/common/index';
import { useRefreshUser } from './hooks/index';
import { AuthGuard, RestrictedIfLogedIn } from './guards/index';
import { PageLayout } from './layout/index';

const Home = lazy(() => import('./pages/Home'));
const SignUp = lazy(() => import('./pages/SignUp'));
const LogIn = lazy(() => import('./pages/LogIn'));
const User = lazy(() => import('./pages/Users'));
const IndividualPost = lazy(() => import('./pages/IndividualPost'));
const Search = lazy(() => import('./pages/Search'));
const PageNotFound404 = lazy(() => import('./pages/PageNotFound404'));

function App() {
  const refreshUser = useRefreshUser();

  useEffect(() => {
    refreshUser.mutate();

    const refreshInterval = setInterval(() => {
      refreshUser.mutate();
    }, 1000 * 60 * 10);

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <div className="App">
      <Suspense
        fallback={
          <>
            <PageLayout />
            <LoadingPage />
          </>
        }
      >
        <Routes>
          <Route element={<PageLayout />}>
            <Route path="/" element={<Home />} />
            <Route element={<AuthGuard />}>
              <Route path="/users" element={<User />}>
                <Route index element={<User />} />
                <Route path=":id" element={<User />} />
              </Route>
              <Route path="/posts" element={<IndividualPost />}>
                <Route index element={<IndividualPost />} />
                <Route path=":id" element={<IndividualPost />} />
              </Route>
              <Route path="/search" element={<Search />} />
            </Route>
            <Route element={<RestrictedIfLogedIn />}>
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/log-in" element={<LogIn />} />
            </Route>
            <Route path="*" element={<PageNotFound404 />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
