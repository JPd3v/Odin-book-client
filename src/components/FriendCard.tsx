import { Link } from 'react-router-dom';
import type { IFriends } from '../hooks/useUserProfile';

interface IProps {
  friend: IFriends;
}

export default function FriendCard({ friend }: IProps) {
  const { _id, first_name, last_name, profile_image } = friend;
  return (
    <div className="user-friends__friend">
      <Link to={`/users/${_id}`}>
        <img
          src={`${profile_image.img}`}
          alt={`${first_name} ${last_name}`}
          className="user-friend__friend-img"
        />
      </Link>

      <Link to={`/users/${_id}`}>{`${first_name} ${last_name}`}</Link>
    </div>
  );
}
