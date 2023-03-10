import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useState } from 'react';
import { useMountTransition, useAuth } from 'hooks/index';
import { SearchBar } from 'features/search/index';
import FriendsRequestsDropdown from './FriendsRequestsDropdown';
import HamburgerMenu from './HamburgerMenu';
import ProfileDropDown from './ProfileDropDown';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const hasTransitionedIn = useMountTransition(isOpen, 300);

  const { userToken } = useAuth();

  function openCloseMenu() {
    setIsOpen((prev) => !prev);
  }

  return (
    <header className="nav-bar-wrapper">
      <nav className="nav-bar">
        <div>
          <Link to="/">
            <h1>Odin Book</h1>
          </Link>
        </div>

        {userToken ? <SearchBar /> : null}

        <div className="nav-bar__right-side">
          <ul className="nav-bar__list">
            {!userToken ? (
              <>
                <li>
                  <Link to="/sign-up">Sign up</Link>
                </li>
                <li>
                  <Link to="/log-in">Log in</Link>
                </li>
              </>
            ) : null}
            <li className="nav-bar__user-ui">
              {userToken ? (
                <>
                  <FriendsRequestsDropdown /> <ProfileDropDown />
                </>
              ) : null}
            </li>
          </ul>
        </div>

        {!isOpen && !hasTransitionedIn && !userToken ? (
          <button
            type="button"
            aria-label="open navigation menu"
            className="nav-bar__hamburger-button"
            onClick={openCloseMenu}
          >
            <GiHamburgerMenu />
          </button>
        ) : null}

        {isOpen || hasTransitionedIn ? (
          <HamburgerMenu
            isOpen={isOpen}
            hasTransitionedIn={hasTransitionedIn}
            handleClick={() => openCloseMenu()}
          />
        ) : null}
      </nav>
    </header>
  );
}
