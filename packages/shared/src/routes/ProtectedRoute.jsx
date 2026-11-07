import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getRole } from '../app/roles.js';
import { sessionToken } from '../config/app.js';
import { BASE_URL } from '../config/constants.js';
const routePermissions = [
 ['/admin/users','users.manage'], ['/admin/medical-officers','medical.manage'], ['/admin/articles','articles.review'], ['/admin/audit-logs','audit.read'], ['/admin/contact-tickets','contact.manage'], ['/admin/predictions','predictions.review'],
 ['/medical-officer/predictions','predictions.review'], ['/medical-officer/articles','articles.author']
];
export default function ProtectedRoute({ role = 'user' }) {
 const { pathname } = useLocation();
 const token = sessionToken();
 const key = `${role}:${token}:${pathname}`;
 const [result,setResult] = useState(null);
 useEffect(() => {
  if (!token) return;
  const controller = new AbortController();
  fetch(`${BASE_URL}/session`, { headers:{Authorization:`Bearer ${token}`}, signal:controller.signal }).then(async response => {
   if (response.status === 401 || response.status === 403) { setResult({key, denied:true}); return; }
   if (!response.ok) throw new Error('Session verification unavailable');
   const { principal } = await response.json();
   const permission = role === 'admin' ? 'admin.access' : role === 'medical' ? 'medical.access' : 'profile.self';
   const required = routePermissions.find(([prefix]) => pathname === prefix || pathname.startsWith(prefix + '/'))?.[1];
   const permitted = principal.permissions.includes(permission) && (!required || principal.permissions.includes(required)) && (role !== 'user' || principal.accountType === 'user');
   setResult({ key, denied:!permitted });
  }).catch(error => { if (!controller.signal.aborted) setResult({key,error:error.message}); });
  return () => controller.abort();
 },[key,token,role,pathname]);
 if (!token || (result?.key === key && result.denied)) return <Navigate to={getRole(role).login} replace state={{from:pathname}}/>;
 if (result?.key !== key) return <p role="status" className="p-8">Verifying access…</p>;
 if (result.error) return <p role="alert" className="p-8">Unable to verify access. Please reload and try again.</p>;
 return <Outlet/>;
}
