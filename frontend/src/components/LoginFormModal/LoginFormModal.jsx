import { useState } from 'react'; 
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

  const isDisabled = !credential || !password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const response = await dispatch(sessionActions.loginUser({ credential, password }));
      if (response.ok) {
        closeModal();
      } else {
        const data = await response.json();
        setErrors({ credential: "The provided credentials were invalid" });
      }
    } catch (err) {
      setErrors({ credential: "An error occurred. Please try again." });
    }
  };

  const handleDemoLogin = async () => {
    const demoCredentials = { credential: "Demo-lition", password: "password" };
    try {
      const response = await dispatch(sessionActions.loginUser(demoCredentials));
      if (response.ok) {
        closeModal();
      } else {
        const data = await response.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (err) {
      setErrors({ credential: "An error occurred. Please try again." });
    }
  };

  return (
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
        {errors.credential && <p className="error">{errors.credential}</p>}
        <button type="submit" disabled={isDisabled}>Log In</button>
      </form>
      <button onClick={handleDemoLogin} className="demo-button">Log in as Demo User</button>
    </div>
  );
}

export default LoginFormModal;



