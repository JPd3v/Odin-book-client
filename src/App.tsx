import './App.css';
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import LoadingPage from './utils/LoadingPage';
import PageLayout from './pages/PageLayout';
import useRefreshUser from './hooks/useRefreshUser';

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
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route element={<PageLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/log-in" element={<LogIn />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
