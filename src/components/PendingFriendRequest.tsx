import { useRef, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

interface IProps {
  onAccept: () => void;
  onCancel: () => void;
}

export default function PendingFriendRequest({ onAccept, onCancel }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  function handleToggleDropdown() {
    setIsOpen((prev) => !prev);
  }

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
