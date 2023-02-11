import { useClickOutsideRef } from 'hooks';
import { useEffect, useRef, useState } from 'react';
import { IoMdNotifications } from 'react-icons/io';
import FriendRequest from './FriendRequest';

export default function FriendRequestsList() {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);
  const handleClickOutside = useClickOutsideRef(dropDownRef);

  useEffect(() => {
    return setIsOpen(false);
  }, [handleClickOutside]);

  function handleCloseDropdown() {
    setIsOpen(false);
  }

  return (
    <div ref={dropDownRef} className="mobile-nav-bar__notifications">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mobile-nav-bar__notifications-open"
        aria-label="friend requests"
      >
        <IoMdNotifications className="mobile-nav-bar__icon" />
      </button>

      {isOpen ? (
        <FriendRequest onLinkClick={() => handleCloseDropdown()} />
      ) : null}
    </div>
  );
}
