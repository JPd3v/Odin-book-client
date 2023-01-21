import { Link } from 'react-router-dom';
import useRecommendedFriends from '../hooks/useRecommendedFriends';
import LoadingSpinner from './LoadingSpinner';

export default function RecommendedFriends() {
  const friends = useRecommendedFriends();
  return (
    <aside className="recommended-friends">
      <div className="recommended-friends__container">
        <p>Recommended friends </p>
        {friends?.data?.map((friend) => (
          <div key={friend._id} className="recommended-friends__card">
            <Link to={`users/${friend._id}`}>
              <img
                className="recommended-friends__card-profile-img"
                src={`${friend.profile_image.img}`}
                aria-label={`${friend.first_name} ${friend.last_name}`}
                alt=""
              />
            </Link>

            <p>
              <Link to={`users/${friend._id}`}>
                {`${friend.first_name} ${friend.last_name}`}
              </Link>
            </p>
          </div>
        ))}

        {friends.isError ? (
          <p className="recommended-friends__error">
            {friends.error.response.data.message}
          </p>
        ) : null}

        {friends.data?.length === 0 ? (
          <p>We currently have no recommended friends for you</p>
        ) : null}

        {friends.isLoading ? (
          <div className="recommended-friends__loading-spinner">
            <LoadingSpinner />
          </div>
        ) : null}
      </div>
    </aside>
  );
}
