import './App.css';
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import PageLayout from './pages/PageLayout';
import useRefreshUser from './hooks/useRefreshUser';
import AuthGuard from './guards/AuthGuard';
import RestrictedIfLogedIn from './guards/RestrictedIfLogedIn';
import Users from './pages/Users';
import IndividualPost from './pages/IndividualPost';
import PageNotFound404 from './pages/PageNotFound404';

const Home = lazy(() => import('./pages/Home'));
const SignUp = lazy(() => import('./pages/SignUp'));
const LogIn = lazy(() => import('./pages/LogIn'));

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
      <Suspense fallback={<p>loading.. place holder</p>}>
        <Routes>
          <Route element={<PageLayout />}>
            <Route path="/" element={<Home />} />
            <Route element={<AuthGuard />}>
              <Route path="/users" element={<Users />}>
                <Route index element={<Users />} />
                <Route path=":id" element={<Users />} />
              </Route>
              <Route path="/posts" element={<IndividualPost />}>
                <Route index element={<IndividualPost />} />
                <Route path=":id" element={<IndividualPost />} />
              </Route>
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
