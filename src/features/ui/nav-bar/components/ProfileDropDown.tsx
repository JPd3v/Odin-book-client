import { useState, useRef, useEffect } from 'react';
import { useAuth, useClickOutsideRef, useLogOut } from 'hooks/index';

import { Link } from 'react-router-dom';
import { SettingsModal } from 'features/account-settings';

export default function ProfileDropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const { userInfo } = useAuth();
  const logOut = useLogOut();

  const handleClickOutside = useClickOutsideRef(dropDownRef);

  function handleCloseSettings() {
    setIsSettingsOpen(false);
  }

  function handleOpenSettings() {
    setIsSettingsOpen(true);
  }

  function handleCloseDropDown() {
    setIsOpen(false);
  }

  useEffect(() => {
    return setIsOpen(false);
  }, [handleClickOutside]);

  return (
    <div className="profile-drop" ref={dropDownRef}>
      <button
        type="button"
        className="profile-drop-down__button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img
          src={`${userInfo?.profile_image}`}
          alt="user profile"
          className="profile-drop-down-button__img"
        />
      </button>
      {isOpen ? (
        <div>
          <ul className="profile-drop-down__list">
            <li>
              <Link
                to={`/users/${userInfo?._id}`}
                className="profile-drop-down__profile-link"
                onClick={() => handleCloseDropDown()}
              >
                <p>{`${userInfo?.first_name} ${userInfo?.last_name}`}</p>
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="profile-drop-down__settings"
                onClick={() => handleOpenSettings()}
              >
                Account settings
              </button>
            </li>
            <li>
              <button
                type="button"
                className="profile-drop-down__log-out"
                onClick={() => logOut.mutate()}
              >
                Log out
              </button>
            </li>
          </ul>
          {isSettingsOpen ? (
            <SettingsModal onClose={() => handleCloseSettings()} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
