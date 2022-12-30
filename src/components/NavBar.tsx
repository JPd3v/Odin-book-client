import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useState } from 'react';
import useMountTransition from '../hooks/useMountTransition';
import HamburgerMenu from './HamburgerMenu';
import useAuth from '../hooks/useAuth';
import ProfileDropDown from './ProfileDropDown';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const hasTransitionedIn = useMountTransition(isOpen, 300);

  const { userToken } = useAuth();

  function openCloseMenu() {
    setIsOpen((prev) => !prev);
  }

  return (
    <nav className="nav-bar">
      <div>
        <Link to="/">
          <h1>Odin Book</h1>
        </Link>
      </div>
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
          <li>{userToken ? <ProfileDropDown /> : null}</li>
        </ul>
      </div>

      {!isOpen && !hasTransitionedIn ? (
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
  );
}
