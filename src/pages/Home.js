// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const Home = () => {
  const [nickname, setNickname] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // /api/auth/me 엔드포인트를 호출하여 사용자 정보를 가져옵니다.
        const response = await axiosInstance.get('/api/auth/me');
        setNickname(response.data.nickname);
      } catch (error) {
        console.error('사용자 정보를 가져오지 못했습니다.', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      <h1>Home 페이지</h1>
      {nickname ? <p>안녕하세요, {nickname}님!</p> : <p>로그인이 필요합니다.</p>}
    </div>
  );
};

export default Home;
