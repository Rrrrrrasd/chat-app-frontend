import api from '../api';

let refreshTimeoutId = null;

export function scheduleTokenRefresh(exp) {
  const delay = exp - Date.now() - 60 * 1000;

  if (refreshTimeoutId) clearTimeout(refreshTimeoutId);
  if (delay <= 0) return;

  refreshTimeoutId = setTimeout(async () => {
    try {
      const res = await api.post('/api/auth/refresh');
      const newExp = res.data.exp;
      if (newExp) {
        scheduleTokenRefresh(newExp);
      }
    } catch (err) {
      console.error('토큰 자동 갱신 실패');
      // TODO: 로그인 페이지 이동
    }
  }, delay);
}
