import jwtDecode from 'jwt-decode';
export function saveToken(token) { localStorage.setItem('authToken', token); }
export function getToken() { return localStorage.getItem('authToken'); }
export function clearToken() { localStorage.removeItem('authToken'); }
export function getUser() { const t = getToken(); if (!t) return null; try { return jwtDecode(t); } catch { return null; } }