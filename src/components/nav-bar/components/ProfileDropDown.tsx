import { useState, useRef, useEffect } from 'react';
import { useAuth, useClickOutsideRef, useLogOut } from 'hooks/index';
import { SettingsModal } from 'components/account-settings';

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
              <p>{`${userInfo?.first_name} ${userInfo?.last_name}`}</p>
            </li>
            <li>
              <button
                type="button"
                className="profile-drop-down__settings"
                onClick={() => setIsSettingsOpen(true)}
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
          {isSettingsOpen ? <SettingsModal /> : null}
        </div>
      ) : null}
    </div>
  );
}
