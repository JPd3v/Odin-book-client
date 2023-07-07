import { useAuth } from 'hooks/index';
import { lazy } from 'react';
import { NewPostForm } from 'features/posts/index';

const PostList = lazy(() => import('features/posts/components/PostList'));
const RecommendedFriends = lazy(
  () => import('features/users/components/RecommendedFriends')
);
const WelcomeHero = lazy(
  () => import('features/ui/welcome-hero/components/WelcomeHero')
);

export default function Home() {
  const { userToken } = useAuth();

  return userToken ? (
    <main className="user-feed">
      <div className="feed-container">
        <NewPostForm />
        <PostList />
      </div>
      <RecommendedFriends />
    </main>
  ) : (
    <main className="welcome-hero">
      <WelcomeHero />
    </main>
  );
}
