import WelcomeHero from '../components/WelcomeHero';
import UserFeed from '../components/UserFeed';
import useAuth from '../hooks/useAuth';

export default function Home() {
  const { userToken } = useAuth();

  return <main>{userToken ? <UserFeed /> : <WelcomeHero />}</main>;
}
