import { useState, useRef, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useClickOutsideRef from '../hooks/useClickOutsideRef';
import useLogOut from '../hooks/useLogOut';

export default function ProfileDropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const { userInfo } = useAuth();
  const logOut = useLogOut();

  const handleClickOutside = useClickOutsideRef(dropDownRef);

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
            <li>Account settings</li>
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
        </div>
      ) : null}
    </div>
  );
}
