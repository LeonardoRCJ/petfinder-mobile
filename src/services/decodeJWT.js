function decodeJWT(token) {
  if (!token) return null;
  const payload = token.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = atob(base64);
  return JSON.parse(decoded);
}

export default decodeJWT;