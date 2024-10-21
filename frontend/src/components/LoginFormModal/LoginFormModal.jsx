import { useState, useEffect } from 'react'; 
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
// import { useModal } from '../../context/modal';
import './LoginForm.css';

function LoginFormModal({ closeModal }) {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  // const { closeModal } = useModal();

  const isDisabled = !credential || !password

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.loginUser({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors({ credential: "The provided credentials were invalid" });
        }
      });
  };

  const handleDemoLogin = () => {
    const demoCredentials = { credential: "Demo-lition", password: "password" }; // Replace with actual demo user credentials
    dispatch(sessionActions.loginUser(demoCredentials))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors({ credential: "The provided credentials were invalid" });
        }
      });
  };

  useEffect(() => {
    const handleCloseModal = () => {
    setCredential("")
    setErrors({});    
  };
    return () => {
      handleCloseModal();
    };
  }, [closeModal]);

  return (
    <>
      <div className="modal-container">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username or Email
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.credential && (
            <p>{errors.credential}</p>
          )}
          <button type="submit" disabled={isDisabled}>Log In</button>
        </form>
        <button onClick={handleDemoLogin} className="demo-button">
          Log in as Demo User
        </button>
      </div>
    </>
  );
}

export default LoginFormModal;
