import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getRole } from '../app/roles';

export default function ProtectedRoute({role}) {
 const {currentUser,activeUser}=useAuth();
 const location=useLocation();
 if(!role) return (currentUser || activeUser) ? <Outlet/> : <Navigate to="/login" replace state={{from:location.pathname}}/>;
 const config=getRole(role);
 const permitted=activeUser && config.identityRoles.includes(activeUser.role);
 return permitted ? <Outlet/> : <Navigate to={config.login} replace state={{from:location.pathname}}/>;
}
