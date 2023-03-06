import { useClickOutsideRef, useLogOut } from 'hooks';
import { useEffect, useRef, useState } from 'react';
import { IoMdSettings } from 'react-icons/io';

interface Iprops {
  onModalopen: () => void;
}

export default function SettingsDropdown({ onModalopen }: Iprops) {
  const [isOpen, setIsOpen] = useState(false);
  const logOut = useLogOut();
  const dropDownRef = useRef(null);
  const handleClickOutside = useClickOutsideRef(dropDownRef);

  useEffect(() => {
    return setIsOpen(false);
  }, [handleClickOutside]);

  return (
    <div ref={dropDownRef} className="mobile-nav-bar__settings">
      <button
        type="button"
        className="mobile-nav-bar__setting-open"
        aria-label="settings"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <IoMdSettings className="mobile-nav-bar__icon" />
      </button>

      {isOpen ? (
        <div className="mobile-nav-bar__settings-content">
          <button
            type="button"
            className="mobile-nav-bar__settings-log-out"
            onClick={() => logOut.mutate()}
          >
            Log out
          </button>
          <button
            type="button"
            className="mobile-nav-bar__settings-open-modal"
            onClick={() => onModalopen()}
          >
            Account settings
          </button>
        </div>
      ) : null}
    </div>
  );
}
