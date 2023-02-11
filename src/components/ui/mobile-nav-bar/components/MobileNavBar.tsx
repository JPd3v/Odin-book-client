import { SettingsModal } from 'components/account-settings';
import { useAuth } from 'hooks';
import { useState } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
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
