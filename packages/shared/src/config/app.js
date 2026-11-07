export const APP_KIND = import.meta.env.VITE_APP_KIND || 'main';
export const MAIN_APP_URL = import.meta.env.VITE_MAIN_APP_URL || 'http://localhost:5173';
export const ADMIN_APP_URL = import.meta.env.VITE_ADMIN_APP_URL || 'http://localhost:5174';
export function sessionRole(pathname = window.location.pathname) {
 return APP_KIND === 'admin' ? 'admin' : (pathname.startsWith('/medical-officer') || localStorage.getItem('mainSessionRole') === 'medical') ? 'medical' : 'user';
}
export function sessionToken(storage = localStorage) {
 return storage.getItem({admin:'adminToken',medical:'medicalOfficerToken',user:'userToken'}[sessionRole()]);
}
