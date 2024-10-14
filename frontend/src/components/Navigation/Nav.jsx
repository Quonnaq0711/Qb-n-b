import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignUpFormPageModal';
import './Nav.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul>
      <li>
        <NavLink to="/" className="nav-link">Home</NavLink>
      </li>
      {isLoaded && (
        <>
          {sessionUser ? (
            <li key="profile">
              <ProfileButton user={sessionUser} />
            </li>
          ) : (
            <>
              <li key="login">
                <OpenModalButton
                  buttonText="Log In"
                  modalComponent={<LoginFormModal />}
                  aria-label="Log In"
                />
              </li>
              <li key="signup">
                <OpenModalButton
                  buttonText="Sign Up"
                  modalComponent={<SignupFormModal />}
                  aria-label="Sign Up"
                />
              </li>
            </>
          )}
        </>
      )}
    </ul>
  );
}

export default Navigation;
