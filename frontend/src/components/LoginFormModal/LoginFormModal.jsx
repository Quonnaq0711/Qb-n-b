import { useState, useRef, useEffect } from 'react'; 
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // For handling loading state

  const isDisabled = !credential || !password || isSubmitting;

  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const outsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
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
    setErrors({});
    setIsSubmitting(true); // Start loading state
    
    try {
      const response = await dispatch(sessionActions.loginUser({ credential, password }));
      if (response.ok) {
        closeModal();
      } else {
        const data = await response.json();
        if (data.error) {
          setErrors({ credential: "The provided credentials were invalid" });
        }
      }
    } catch (err) {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false); // End loading state
    }
  };

  const handleDemoLogin = async () => {
    const demoCredentials = { credential: "Demo-lition", password: "password" };
    setIsSubmitting(true); // Start loading state
    
    try {
      const response = await dispatch(sessionActions.loginUser(demoCredentials));
      if (response.ok) {
        closeModal();
      } else {
        const data = await response.json();
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (err) {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false); // End loading state
    }
  };

  return (
    <div className="modal-container" ref={modalRef}>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            disabled={isSubmitting} // Disable input during submitting
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting} // Disable input during submitting
          />
        </label>
        {errors.credential && <p className="error">{errors.credential}</p>}
        {errors.general && <p className="error">{errors.general}</p>}
        <button type="submit" disabled={isDisabled}>
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>
      <button onClick={handleDemoLogin} className="demo-button" disabled={isSubmitting}>
        {isSubmitting ? "Logging in as Demo..." : "Log in as Demo User"}
      </button>
    </div>
  );
}

export default LoginFormModal;




