import { PostList, useProfilePosts } from 'features/posts';
import UserProfile from 'features/users/components/UserProfile';
import { useParams } from 'react-router-dom';

export default function Users() {
  const params = useParams();
  const userId = params.id as string;
  const QUERY_KEY = `user posts, ${userId}`;
  const posts = useProfilePosts(QUERY_KEY, userId);

  return (
    <main className="user-page">
      <div className="user-page-wrapper">
        <UserProfile />
        <div className="profile-posts">
          <PostList postsQuery={() => posts} queryKey={QUERY_KEY} />
        </div>
      </div>
    </main>
  );
}
