import { UserProfile } from 'components/profile/index';
import { ProfilePosts } from 'components/profile-posts/index';

export default function Users() {
  return (
    <main className="user-page">
      <div className="user-page-wrapper">
        <UserProfile />
        <ProfilePosts />
      </div>
    </main>
  );
}
