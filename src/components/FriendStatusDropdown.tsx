import { useEffect, useRef, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import useClickOutsideRef from '../hooks/useClickOutsideRef';

interface IProps {
  onDelete: () => void;
}

export default function FriendStatusDropdown({ onDelete }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handleClickOutside = useClickOutsideRef(dropdownRef);

  function handleClick() {
    onDelete();
    setIsOpen(false);
  }

  useEffect(() => {
    setIsOpen(false);
  }, [handleClickOutside]);

  return (
    <div ref={dropdownRef} className="user-profile__friend-dropdown">
      <button
        type="button"
        aria-label="This user is your Friend"
        onClick={() => setIsOpen((prev) => !prev)}
        className="user-profile__friend-dropdown-open"
      >
        Friend
        <IoIosArrowDown />
      </button>
      {isOpen ? (
        <div className="user-profile__friend-dropdown-content">
          <button
            type="button"
            onClick={handleClick}
            className="user-profile__friend-dropdown-delete"
          >
            Delete friend
          </button>
        </div>
      ) : null}
    </div>
  );
}
