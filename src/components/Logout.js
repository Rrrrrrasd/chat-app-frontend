// src/components/Logout.js
import React from 'react';
import axios from 'axios';
import { setAccessToken } from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출 (쿠키 삭제)
      await axios.post(
        'http://localhost:8080/api/auth/logout',
        {},
        { withCredentials: true }
      );
      // 클라이언트에 저장된 토큰 초기화
      setAccessToken(null);
      // 로그아웃 후 로그인 페이지(또는 홈 페이지)로 리다이렉트
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃에 실패했습니다.');
    }
  };

  return <button onClick={handleLogout}>로그아웃</button>;
};

export default Logout;
