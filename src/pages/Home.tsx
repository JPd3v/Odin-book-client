import { UserFeed, RecommendedFriends } from 'components/feed/index';
import { useAuth } from 'hooks/index';
import { WelcomeHero } from 'components/welcome-hero/index';

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
