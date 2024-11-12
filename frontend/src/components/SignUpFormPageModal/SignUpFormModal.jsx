import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/modal';
import * as sessionActions from '../../store/session';
import './signUpForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Add a loading state

  const isDisabled = !email || !username || !firstName || !lastName || password.length < 6 || password !== confirmPassword || isSubmitting;

  const modal = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const outsideClick = (e) => {
      if (modal.current && !modal.current.contains(e.target)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', outsideClick);

    return () => {
      document.removeEventListener('mousedown', outsideClick);
    };
  }, [closeModal]); // Cleanup effect on unmount or when closeModal changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      setIsSubmitting(true); // Set loading state to true when submitting

      try {
        await dispatch(sessionActions.signup({ email, username, firstName, lastName, password }));
        closeModal();
      } catch (res) {
        const data = await res.json();
        setErrors(data.errors || {});
      } finally {
        setIsSubmitting(false); // Set loading state to false after completion
      }
    } else {
      setErrors({ confirmPassword: "Passwords must match" });
    }
  };

  
  return (
    <div className="modal-container" ref={modal}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="error">{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="error">{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          </label>
        <button type="submit" disabled={isDisabled}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;

