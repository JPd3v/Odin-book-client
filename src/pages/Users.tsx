import { UserProfile } from 'components/profile/index';

export default function Users() {
  return (
    <main className="user-page">
      <div className="user-page-wrapper">
        <UserProfile />
        {/* NOTE : INSERT USER POSTS COMPONENT HERE */}
      </div>
    </main>
  );
}
