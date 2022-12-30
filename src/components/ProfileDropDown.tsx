import { useState, useRef, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useLogOut from '../hooks/useLogOut';

export default function ProfileDropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const { userInfo } = useAuth();
  const logOut = useLogOut();

  useEffect(() => {
    function handleClickOutside({ target }: MouseEvent) {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(target as Node) &&
        !buttonRef.current?.contains(target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropDownRef, buttonRef]);

  return (
    <>
      <button
        type="button"
        className="profile-drop-down__button"
        onClick={() => setIsOpen((prev) => !prev)}
        ref={buttonRef as unknown as React.RefObject<HTMLButtonElement>}
      >
        <img
          src={`${userInfo?.profile_image}`}
          alt="user profile"
          className="profile-drop-down-button__img"
        />
      </button>
      {isOpen ? (
        <ul
          className="profile-drop-down__list"
          ref={dropDownRef as unknown as React.RefObject<HTMLUListElement>}
        >
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
      ) : null}
    </>
  );
}
