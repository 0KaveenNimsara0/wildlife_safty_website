import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../../../packages/shared/src/context/auth-context.js';
import { BASE_URL } from '../../../../packages/shared/src/config/constants.js';
export function AdminAuthProvider({ children }) {
 const location = useLocation();
 const token = localStorage.getItem('adminToken');
 const [activeUser, setUser] = useState(null);
 const [verifiedToken, setVerifiedToken] = useState(null);
 const [error, setError] = useState('');
 const adminLogout = useCallback(async () => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminData'); setUser(null); setVerifiedToken(null); }, []);
 const refreshUser = useCallback(async (signal) => {
  if (!token) { setUser(null); setVerifiedToken(null); return; }
  const response = await fetch(`${BASE_URL}/session`, { headers: { Authorization: `Bearer ${token}` }, signal });
  if (response.status === 401 || response.status === 403) { await adminLogout(); return; }
  if (!response.ok) throw new Error('Unable to verify admin session. Please retry.');
  const { user, principal } = await response.json();
  if (!principal.permissions.includes('admin.access')) { await adminLogout(); return; }
  const normalized = { ...user, uid: user.uid || user.id, displayName: user.name, role: 'admin', permissions: principal.permissions, accountRole: principal.roles[0] };
  setUser(normalized); setVerifiedToken(token); setError(''); return normalized;
 }, [token, adminLogout]);
 useEffect(() => { const controller = new AbortController(); refreshUser(controller.signal).catch(e => { if (!controller.signal.aborted) setError(e.message); }); return () => controller.abort(); }, [refreshUser, location.pathname]);
 const loading = !!token && token !== verifiedToken;
 return <AuthContext.Provider value={{ activeUser, currentUser: activeUser, adminLogout, refreshUser, loading }}>
 {loading ? <div role="status" className="p-8">{error || 'Verifying admin session…'}{error && <button onClick={() => window.location.reload()}>Retry</button>}</div> : children}
 </AuthContext.Provider>;
}
