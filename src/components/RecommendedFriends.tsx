import { Link } from 'react-router-dom';
import useRecommendedFriends from '../hooks/useRecommendedFriends';

export default function RecommendedFriends() {
  const friends = useRecommendedFriends();
  return (
    <aside className="recommended-friends">
      <div className="recommended-friends__container">
        <p>Recommended friends </p>

        {friends?.data?.map((friend) => (
          <div className="recommended-friends__card">
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
        {!friends.data?.length ? (
          <p>actually dont have recommended friends for you</p>
        ) : null}
      </div>
    </aside>
  );
}
