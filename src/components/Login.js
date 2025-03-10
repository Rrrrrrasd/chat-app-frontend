
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { loading, error, accessToken } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(credentials));
    if (result.meta.requestStatus === 'fulfilled') {
      alert('로그인 성공!');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {accessToken ? (
        <p>Logged in! Your token is: {accessToken}</p>
      ) : (
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text"
              id="username"
              name="username"
              placeholder="아이디 입력"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호 입력"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          {error && <p className="error">Error: {error}</p>}
          <div className="signup-link">
            <span>Don't have an account?</span>
            <Link to="/signup">
              <button type="button" className="signup-button">Sign Up</button>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
