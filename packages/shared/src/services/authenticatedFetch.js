import { sessionRole, sessionToken } from '../config/app.js';
import { BASE_URL } from '../config/constants.js';
import { auth } from '../config/firebase.js';

// Attach credentials only to this API; never to third-party URLs or the ML server.
export async function authenticatedFetch(input, options = {}) {
  const url = new URL(input, window.location.origin);
  const base = new URL(BASE_URL, window.location.origin);
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname.replace(/\/$/, '') + '/')) return globalThis.fetch(input, options);
  const headers = new Headers(options.headers);
  if (!headers.has('Authorization')) {
    const token = sessionToken() || (sessionRole() === 'user' && auth.currentUser ? await auth.currentUser.getIdToken() : null);
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }
  return globalThis.fetch(input, { ...options, headers });
}
