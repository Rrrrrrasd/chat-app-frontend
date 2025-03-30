import jwtDecode from 'jwt-decode';

export function getTokenExpiration(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000;
  } catch {
    return null;
  }
}
