// src/api/axiosInstance.js
import axios from 'axios';

// 백엔드 주소와 쿠키 전송 옵션을 설정합니다.
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 서버 주소
  withCredentials: true,           // 쿠키를 함께 전송하도록 설정
});

// 메모리에 저장할 access token 변수 (실제로는 Context나 Redux를 활용할 수 있음)
let accessToken = null;

// 외부에서 access token을 갱신하거나 조회할 수 있는 함수들
export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// 요청 인터셉터: access token이 있을 경우 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 에러 발생 시 refresh API 호출 후 원래 요청 재시도
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // 아직 재시도하지 않은 경우에만 refresh 시도
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // refresh 토큰은 httpOnly 쿠키로 관리되므로 별도 첨부 필요 없이 요청됨
        const refreshResponse = await axios.post(
          'http://localhost:8080/api/auth/refresh',
          {},
          { withCredentials: true }
        );
        const newAccessToken = refreshResponse.data.accessToken;
        // 새 토큰을 메모리에 저장
        setAccessToken(newAccessToken);
        // 원래 요청에 새 토큰을 첨부하고 재요청
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // refresh 실패 시 로그인 페이지로 이동하거나 추가 처리를 할 수 있습니다.
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
