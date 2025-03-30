import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

let isRefreshing = false;
let refreshTimeoutId = null;

// ⏱️ 자동 갱신 예약
function scheduleTokenRefresh(exp) {
  const expiresIn = exp * 1000 - Date.now();
  const refreshBefore = 60 * 1000;
  const delay = Math.max(0, expiresIn - refreshBefore);

  if (refreshTimeoutId) clearTimeout(refreshTimeoutId);

  refreshTimeoutId = setTimeout(async () => {
    try {
      const res = await api.post('/api/auth/refresh');
      if (res.data?.exp) {
        scheduleTokenRefresh(res.data.exp);
      }
    } catch (err) {
      console.error('자동 토큰 갱신 실패', err);
    }
  }, delay);
}

// 🟢 초기 인증 확인 및 토큰 갱신 예약
export async function initAuth() {
  try {
    const res = await api.get('/api/auth/me');
    // exp가 없을 경우 무시됨 → 백엔드에서 exp도 함께 내려주는게 좋음
    if (res.data?.exp) {
      scheduleTokenRefresh(res.data.exp);
    }
    return true;
  } catch {
    return false;
  }
}

// 🔁 응답 인터셉터
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (originalRequest.url.includes('/api/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResponse = await api.post('/api/auth/refresh');
          isRefreshing = false;

          if (refreshResponse.data?.exp) {
            scheduleTokenRefresh(refreshResponse.data.exp);
          }

          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
