// src/pages/Dashboard.js
import React from 'react';
import axiosInstance from '../api/axiosInstance';

const Dashboard = () => {
  const fetchProtectedData = async () => {
    try {
      // axiosInstance는 자동으로 access token을 헤더에 첨부합니다.
      const response = await axiosInstance.get('/api/protected'); // 예시 API
      console.log('보호 데이터:', response.data);
    } catch (error) {
      console.error('보호 데이터 요청 실패', error);
    }
  };

  return (
    <div>
      <h1>Dashboard 페이지</h1>
      <button onClick={fetchProtectedData}>보호 데이터 가져오기</button>
    </div>
  );
};

export default Dashboard;
