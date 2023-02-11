import { useAuth } from 'hooks';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaHome } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { Link } from 'react-router-dom';
import FriendRequestsList from './FriendRequestsList';

export default function MobileNavBar() {
  const { userInfo } = useAuth();

  return (
    <div className="mobile-nav-bar-wrapper">
      <nav className="mobile-nav-bar">
        <Link to="/">
          <FaHome className="mobile-nav-bar__icon" aria-label="home" />
        </Link>
        <Link to={`/users/${userInfo?._id}`}>
          <BsFillPersonFill
            className="mobile-nav-bar__icon"
            aria-label="my profile"
          />
        </Link>

        <FriendRequestsList />

        {/* TODO: ADD BUTN ABRIR SETTINGS */}
        <IoMdSettings className="mobile-nav-bar__icon" />
      </nav>
    </div>
  );
}
