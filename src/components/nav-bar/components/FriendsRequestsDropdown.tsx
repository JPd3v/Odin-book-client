import FriendRequests from 'components/nav-bar/components/FriendRequests';
import { useClickOutsideRef } from 'hooks';
import { useEffect, useRef, useState } from 'react';
import { IoMdNotifications } from 'react-icons/io';

export default function FriendsRequestsDropdown() {
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
    <div ref={dropDownRef} className="friends-requests-drop-down">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="friends-requests-drop-down__open"
        aria-label="friend requests"
      >
        <IoMdNotifications />
      </button>

      {isOpen ? (
        <FriendRequests onLinkClick={() => handleCloseDropdown()} />
      ) : null}
    </div>
  );
}
