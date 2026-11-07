// Keep URL checks independent of browser state so both transports use one policy.
export function isApiUrl(target, apiBase, origin) {
  const url = new URL(target, origin);
  const base = new URL(apiBase, origin);
  const prefix = base.pathname.replace(/\/$/, '');
  return url.origin === base.origin && (url.pathname === prefix || url.pathname.startsWith(prefix + '/'));
}

// Axios combines a base path with leading-slash paths but treats //host as absolute.
export function axiosTarget(url = '', baseURL) {
  if (/^([a-z][a-z\d+.-]*:)?\/\//i.test(url)) return new URL(url, baseURL).href;
  return new URL(baseURL.replace(/\/$/, '') + '/' + url.replace(/^\/+/, '')).href;
}
