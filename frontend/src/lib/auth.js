import { jwtDecode } from "jwt-decode";

export function saveToken(token) {
  localStorage.setItem("authToken", token);
}
export function getToken() {
  return localStorage.getItem("authToken");
}
export function clearToken() {
  localStorage.removeItem("authToken");
}
export function parseToken() {
  const t = getToken();
  if (!t) return null;
  try { return jwtDecode(t); } catch { return null; }
}
export function isExpired() {
  const p = parseToken();
  if (!p || !p.exp) return true;
  return p.exp * 1000 < Date.now();
}
export function authHeader() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
