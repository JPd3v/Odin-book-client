import { Link } from 'react-router-dom';
import type { IUser } from 'types/index';

interface IProps {
  friend: IUser;
  // eslint-disable-next-line react/require-default-props
  clickHandler?: () => void;
}

export default function UserCard({ friend, clickHandler }: IProps) {
  const { _id, first_name, last_name, profile_image } = friend;
  return (
    <div className="user-card">
      <Link to={`/users/${_id}`}>
        <img
          src={`${profile_image.img}`}
          alt={`${first_name} ${last_name}`}
          className="user-card-img"
        />
      </Link>
      {clickHandler ? (
        <p>
          <Link
            to={`/users/${_id}`}
            onClick={clickHandler}
          >{`${first_name} ${last_name}`}</Link>
        </p>
      ) : (
        <p>
          <Link to={`/users/${_id}`}>{`${first_name} ${last_name}`}</Link>
        </p>
      )}
    </div>
  );
}
