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
      await dispatch(sessionActions.loginUser({ credential, password }));
      closeModal();
    } catch (res) {
      const data = await res.json();
      setErrors({ credential: data.errors ? data.errors[0] : "Login failed" });
    }
  };

  const handleDemoLogin = async () => {
    const demoCredentials = { credential: "Demo-lition", password: "password" };
    
    try {
      await dispatch(sessionActions.loginUser(demoCredentials));
      closeModal();
    } catch (res) {
      const data = await res.json();
      setErrors({ credential: data.errors ? data.errors[0] : "Login failed" });
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
