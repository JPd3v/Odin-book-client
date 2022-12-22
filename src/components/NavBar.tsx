import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';
import ReactFocusLock from 'react-focus-lock';
import { useState } from 'react';
import useMountTransition from '../hooks/useMountTransition';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const hasTransitionedIn = useMountTransition(isOpen, 300);

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
          <li>
            <Link to="/sign-up">Sign up</Link>
          </li>
          <li>
            <Link to="/log-in">Log in</Link>
          </li>
        </ul>
      </div>
      <button
        type="button"
        aria-label="open navigation menu"
        className={`nav-bar__hamburger-button ${isOpen ? 'hidden' : ''}`}
        onClick={openCloseMenu}
      >
        <GiHamburgerMenu />
      </button>

      {isOpen || hasTransitionedIn ? (
        <ReactFocusLock>
          <div
            className={`hamburger-menu ${
              isOpen && hasTransitionedIn ? 'hamburger-menu--open' : ''
            }`}
          >
            <div
              className={`hamburger-menu__content ${
                isOpen && hasTransitionedIn
                  ? 'hamburger-menu__content--open'
                  : ''
              }`}
            >
              <Link to="/" onClick={() => openCloseMenu()}>
                <h1>Odin Book</h1>
              </Link>
              <ul className="hamburger-menu__list">
                <li>
                  <Link to="/sign-up" onClick={() => openCloseMenu()}>
                    Sign up
                  </Link>
                </li>
                <li>
                  <Link to="/log-in" onClick={() => openCloseMenu()}>
                    Log in
                  </Link>
                </li>
              </ul>
              <button
                type="button"
                aria-label="close navigation menu"
                className="hamburger-menu__close-button"
                onClick={() => openCloseMenu()}
              >
                <AiOutlineClose />
              </button>
            </div>
          </div>
        </ReactFocusLock>
      ) : null}
    </nav>
  );
}
