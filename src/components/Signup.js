
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import  './Signup.css';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    nickname: '',
  });
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const result = await dispatch(signupUser(form));
    if (result.meta.requestStatus === 'fulfilled') {
      alert('회원가입 성공!');
      navigate('/login');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} className="signup-form">
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text"
            id="username"
            name="username"
            placeholder="아이디 입력"
            value={form.username}
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
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="nickname">Nickname</label>
          <input 
            type="text"
            id="nickname"
            name="nickname"
            placeholder="닉네임 입력"
            value={form.nickname}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="signupp-button" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        {error && <p className="error">Error: {error}</p>}
        <div className="login-link">
          <span>Already have an account?</span>
          <Link to="/login">
            <button type="button" className="login-button">Log In</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
