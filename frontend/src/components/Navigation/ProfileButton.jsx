import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignUpFormPageModal';
import { useNavigate } from 'react-router-dom';
import './ProfileButton.css';
 

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logoutUser()).then(() => {
      setShowMenu(false); 
      navigate('/');
    });
  };

  const handleManageSpotsClick = () => {
    navigate("/user"); // Navigate to the manage spots page
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="user-menu" ref={ulRef}>
      <button onClick={toggleMenu} className="user-menu-button">
        <FaUserCircle /> User Menu
      </button>
      {showMenu && (
        <ul className={ulClassName}>
          {user ? (
            <>
              <li className='userId'>Hello, {user.firstName}</li>
              <li>{user.email}</li>
              <li>
              <button onClick={handleManageSpotsClick} className="nav-link">
                    Manage Spots
                  </button>
                <button onClick={logout} className="logout-button">Log Out</button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={() => setShowMenu(false)}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={() => setShowMenu(false)}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
