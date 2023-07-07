import { ProfilePosts } from 'features/posts';
import UserProfile from 'features/users/components/UserProfile';

export default function Users() {
  return (
    <main className="user-page">
      <div className="user-page-wrapper">
        <UserProfile />
        <div className="profile-posts">
          <ProfilePosts />
        </div>
      </div>
    </main>
  );
}
