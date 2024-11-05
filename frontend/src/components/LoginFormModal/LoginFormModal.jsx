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
    
      dispatch(sessionActions.loginUser({ credential, password }));
      closeModal();
    
      const data =  response.json();
      setErrors({ credential: "The provided credentials were invalid"  });
    
  };

const handleDemoLogin = () => {
  const demoCredentials = { credential: "Demo-lition", password: "password" };
  dispatch(sessionActions.loginUser(demoCredentials))
    
      closeModal();    
  
      const data = response.json();
      if (data && data.errors) {
        setErrors(data.errors); 
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


