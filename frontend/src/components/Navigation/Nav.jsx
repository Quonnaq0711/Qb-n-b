import { NavLink } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignUpFormPageModal';
import logo from "../../Assets/Design2.png";
import { FaUserCircle } from 'react-icons/fa';
import { useState } from 'react';
import './Nav.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

return (
  <nav className="navbar">
    
      <div className="logo">
        <NavLink to="/" aria-label="Home">
          <img src={logo} alt="Qb-n-b"/>
        </NavLink>
    </div>
    <div>
      <NavLink to='/' className='h1-title'>QB-N-B</NavLink>
    </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className="nav-link">Home</NavLink>
        </li>
        {isLoaded && (
          <>
            {sessionUser ? (
              <>
                <li>
                  <NavLink to="/spots" className="nav-link">Create a New Spot</NavLink>
                </li>
                <li>
                  <ProfileButton user={sessionUser} />
                </li>
              </>
            ) : (
              <li className="menu">
                <button aria-label="Menu" className="menu-button" onClick={toggleDropdown}>
                <FaUserCircle />
                </button>
                {dropdownOpen && (
                  <ul className="dropdown">
                    <li>
                      <OpenModalButton
                        buttonText="Log In"
                        modalComponent={<LoginFormModal />}
                        aria-label="Log In"
                      />
                    </li>
                    <li>
                      <OpenModalButton
                        buttonText="Sign Up"
                        modalComponent={<SignupFormModal />}
                        aria-label="Sign Up"
                      />
                    </li>                   
                  </ul>
                )}
              </li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;




