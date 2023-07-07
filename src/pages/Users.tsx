import { NewPostForm, ProfilePosts } from 'features/posts';
import UserProfile from 'features/users/components/UserProfile';
import { useAuth } from 'hooks';
import { useParams } from 'react-router-dom';

export default function Users() {
  const paramsId = useParams().id;
  const { userInfo } = useAuth();

  return (
    <main className="user-page">
      <div className="user-page-wrapper">
        <UserProfile />
        <div className="profile-posts">
          {userInfo?._id === paramsId ? <NewPostForm /> : null}
          <ProfilePosts />
        </div>
      </div>
    </main>
  );
}
