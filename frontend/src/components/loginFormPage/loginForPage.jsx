import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


const LoginFormPage = () => {
    const dispatch = useDispatch('');
    const [credential, setcredential]  = useState('');
    const  [password, setPassword]  = useState('');
    const [errors, setErrors] = useState({});
    const sessionUser = useSelector((state) => state.session.user);

    if (sessionUser) return <Navigate to="/" replace={true} />;

    const handleLogin = (e) => {
      e.preventDefault();
      setErrors({});
      return dispatch(sessionActions.loginUser({ credential, password })).catch(
        async (res) => {
          const data = await res.json();
          if (data?.errors) setErrors(data.errors);
        }
      );
    };

    return (
    <>
    <h1>Log In</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Username or Email
                    <input
                         type="text"
                         value={credential}
                         onChange={(e) => setcredential(e.target.value)}
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
                            {errors.credential && <p>{errors.credential}</p>}
                               <button type="submit">Log In</button>
                    </form>
                </>
            );
        };
                   

export default LoginFormPage;