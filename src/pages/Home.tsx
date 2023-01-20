import WelcomeHero from '../components/WelcomeHero';
import UserFeed from '../components/UserFeed';
import useAuth from '../hooks/useAuth';
import RecommendedFriends from '../components/RecommendedFriends';

export default function Home() {
  const { userToken } = useAuth();

  return userToken ? (
    <main className="user-feed">
      <UserFeed />
      <RecommendedFriends />
    </main>
  ) : (
    <main>
      <WelcomeHero />
    </main>
  );
}
