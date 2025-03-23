// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { setAccessToken } from '../api/axiosInstance';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // 로그인 요청: 로그인 API가 쿠키에 토큰을 저장해 줍니다.
      await axios.post(
        'http://localhost:8080/api/auth/login',
        { username, password },
        { withCredentials: true }
      );
      // 로그인 성공 후, refresh API를 호출해 access token을 받아옵니다.
      const refreshResponse = await axios.post(
        'http://localhost:8080/api/auth/refresh',
        {},
        { withCredentials: true }
      );
      // 받아온 access token을 메모리에 저장합니다.
      setAccessToken(refreshResponse.data.accessToken);
      alert('로그인 성공!');
    } catch (error) {
      console.error(error);
      alert('로그인 실패!');
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <div>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
};

export default Login;
