import { useRef, useState, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import useClickOutsideRef from '../hooks/useClickOutsideRef';

interface IProps {
  onAccept: () => void;
  onCancel: () => void;
}

export default function PendingFriendRequestDropdown({
  onAccept,
  onCancel,
}: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = useClickOutsideRef(dropdownRef);

  function handleToggleDropdown() {
    setIsOpen((prev) => !prev);
  }

  useEffect(() => {
    setIsOpen(false);
  }, [handleClickOutside]);

  return (
    <div ref={dropdownRef} className="user-profile__pending-dropdown">
      <button
        type="button"
        onClick={handleToggleDropdown}
        className="user-profile__pending-dropdown-open"
      >
        Pending request
        <IoIosArrowDown />
      </button>

      {isOpen ? (
        <div className="user-profile__pending-dropdown-content">
          <button type="button" onClick={onAccept}>
            Accept friend request
          </button>
          <button type="button" onClick={onCancel}>
            Decline friend request
          </button>
        </div>
      ) : null}
    </div>
  );
}
