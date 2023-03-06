import { useAuth } from 'hooks';
import { useState } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { HiOutlineSearch } from 'react-icons/hi';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { SettingsModal } from 'features/account-settings';
import FriendRequestsList from './FriendRequestsList';
import SettingsDropdown from './SettingsDropdown';

export default function MobileNavBar() {
  const { userInfo } = useAuth();
  const [isModalSettingsOpen, setModalSettingsOpen] = useState(false);

  function handleOpenSettingsModal() {
    setModalSettingsOpen(true);
  }

  function handleCloseSettingsModal() {
    setModalSettingsOpen(false);
  }

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
        <Link to="/search">
          <HiOutlineSearch
            className="mobile-nav-bar__icon"
            aria-label="search users"
          />
        </Link>
        <FriendRequestsList />
        <SettingsDropdown onModalopen={() => handleOpenSettingsModal()} />
        {isModalSettingsOpen ? (
          <div>
            <SettingsModal onClose={() => handleCloseSettingsModal()} />
          </div>
        ) : null}
      </nav>
    </div>
  );
}
