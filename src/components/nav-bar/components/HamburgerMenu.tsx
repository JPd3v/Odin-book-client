import { AiOutlineClose } from 'react-icons/ai';
import ReactFocusLock from 'react-focus-lock';
import { Link } from 'react-router-dom';
import { useLogOut, useAuth } from 'hooks/index';

interface IHamburgerMenu {
  isOpen: boolean;
  hasTransitionedIn: boolean;
  handleClick: () => void;
}

export default function HamburgerMenu({
  isOpen,
  hasTransitionedIn,
  handleClick,
}: IHamburgerMenu) {
  const logOut = useLogOut();
  const { userToken } = useAuth();

  return (
    <ReactFocusLock>
      <div
        className={`hamburger-menu ${
          isOpen && hasTransitionedIn ? 'hamburger-menu--open' : ''
        }`}
      >
        <div
          className={`hamburger-menu__content ${
            isOpen && hasTransitionedIn ? 'hamburger-menu__content--open' : ''
          }`}
        >
          <Link to="/" onClick={() => handleClick()}>
            <h1 className="hamburger-menu__title">Odin Book</h1>
          </Link>
          <ul className="hamburger-menu__list">
            <li>
              <Link to="/sign-up" onClick={() => handleClick()}>
                Sign up
              </Link>
            </li>
            <li>
              <Link to="/log-in" onClick={() => handleClick()}>
                Log in
              </Link>
            </li>
          </ul>
          <button
            type="button"
            aria-label="close navigation menu"
            className="hamburger-menu__close-button"
            onClick={() => handleClick()}
          >
            <AiOutlineClose />
          </button>

          {userToken ? (
            <button
              type="button"
              className="hamburger-menu__log-out"
              onClick={() => logOut.mutate()}
            >
              Log out
            </button>
          ) : null}
        </div>
      </div>
    </ReactFocusLock>
  );
}
