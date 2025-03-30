import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 로그인 요청: 성공하면 백엔드에서 HttpOnly 쿠키에 토큰이 저장됨
      await api.post('/api/auth/login', { username, password });
      navigate('/');
    } catch (err) {
      setError('로그인 실패. 사용자명과 비밀번호를 확인하세요.');
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>사용자명: </label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            required />
        </div>
        <div>
          <label>비밀번호: </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required />
        </div>
        {error && <p style={{color:'red'}}>{error}</p>}
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;
