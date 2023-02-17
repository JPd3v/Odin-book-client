import { useAuth } from 'hooks/index';
import { lazy } from 'react';

const UserFeed = lazy(() => import('components/feed/components/UserFeed'));
const RecommendedFriends = lazy(
  () => import('components/feed/components/RecommendedFriends')
);
const WelcomeHero = lazy(
  () => import('components/welcome-hero/components/WelcomeHero')
);

export default function Home() {
  const { userToken } = useAuth();

  return userToken ? (
    <main className="user-feed">
      <UserFeed />
      <RecommendedFriends />
    </main>
  ) : (
    <main className="welcome-hero">
      <WelcomeHero />
    </main>
  );
}
