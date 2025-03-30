import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 회원가입 요청
      await api.post('/api/auth/signup', { username, password, nickname });
      navigate('/login');
    } catch (err) {
      setError('회원가입 실패. 입력 정보를 확인하세요.');
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSignup}>
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
        <div>
          <label>닉네임: </label>
          <input 
            type="text" 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)}
            required />
        </div>
        {error && <p style={{color:'red'}}>{error}</p>}
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default Signup;
