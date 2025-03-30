import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 로그인 함수
  const login = async (username, password) => {
    try {
      await api.post('/auth/login', { username, password });
      // 로그인 후, 사용자 정보 가져오기 (예시: /auth/me 엔드포인트)
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      throw error;
    }
  };

  // 회원가입 함수
  const signup = async (username, password, nickname) => {
    try {
      await api.post('/auth/signup', { username, password, nickname });
      // 회원가입 성공 후 별도 처리(예: 로그인 페이지로 리다이렉트)
    } catch (error) {
      throw error;
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  // 컴포넌트 마운트 시 혹은 주기적으로 토큰 갱신 호출 (예: 10분마다)
  useEffect(() => {
    const refreshTokens = async () => {
      try {
        const { data } = await api.post('/auth/refresh');
        api.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
      } catch (error) {
        console.error('토큰 갱신 실패', error);
      }
    };

    // 토큰 만료 시간(예: 15분)에 맞춰 주기적으로 갱신 (여기서는 10분 주기)
    const interval = setInterval(refreshTokens, 10 * 60 * 1000);
    // 초기 토큰 갱신 호출
    refreshTokens();

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
