import { getRole } from '../app/roles';
import React, { useRef, useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShieldCheck, LogOut, Home, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import api from '../services/api';
import { subscribeNotifications } from '../services/notificationStream';
import { BASE_URL } from '../config/constants';
import NotificationDropdown from '../components/notifications/NotificationDropdown';

export default function DashboardLayout({ role = 'user', children }) {
 const auth = useAuth();
 const config = getRole(role);
 const location = useLocation();
 const navigate = useNavigate();
 const drawer = useRef(null);
 const [error,setError] = useState('');
 const [busy,setBusy] = useState(false);
 const [counts, setCounts] = useState({});
 useEffect(() => {
  let disposed=false, pending=false;
  const refresh=async()=>{
   if(pending) return; pending=true;
   try {const {data}=await api.get('/notifications/sidebar-counts'); if(!disposed && data.success) setCounts(data.counts);} catch {} finally {pending=false;}
  };
  refresh(); const unsubscribe=subscribeNotifications(refresh); const timer=setInterval(refresh,15000);
  return ()=>{disposed=true;unsubscribe();clearInterval(timer);};
 },[role,location.pathname]);
 const [unreadMessages, setUnreadMessages] = useState(0);
 useEffect(() => {
  if (!config.conversations) return;
  const controller = new AbortController();
  let pending = false;
  async function refresh() {
   if (pending || document.visibilityState === 'hidden') return;
   const token = localStorage.getItem(config.tokenKey);
   if (!token) { setUnreadMessages(0); return; }
   pending = true;
   try {
    const response = await fetch(`${BASE_URL}${config.conversations}`, {headers:{Authorization:`Bearer ${token}`}, signal:controller.signal});
    if (!response.ok) return;
    const data = await response.json();
    if (data.success && !controller.signal.aborted) setUnreadMessages(data.conversations.reduce((sum, item)=>sum + Math.max(0, Number(item.unreadCount) || 0),0));
   } catch { /* Keep the last known count during a temporary connection failure. */ }
   finally { pending = false; }
  }
  refresh();
  const timer = setInterval(refresh, 10000);
  window.addEventListener('chat-messages-read', refresh);
  document.addEventListener('visibilitychange', refresh);
  return () => { controller.abort(); clearInterval(timer); window.removeEventListener('chat-messages-read',refresh); document.removeEventListener('visibilitychange',refresh); };
 }, [config]);
 const root = config.root;
 const groups = config.navigation;
 const active = groups.flatMap(([,items])=>items).find(([,path])=>location.pathname === `${root}/${path}` || location.pathname.startsWith(`${root}/${path}/`));
 const title = active?.[0] || (role === 'user' ? 'Profile' : 'Overview');
 const roleName = config.label;
 async function signOut() {
  setBusy(true); setError('');
  try { await auth[config.logout](); navigate(config.login); }
  catch { setError('Could not sign out. Please try again.'); }
  finally { setBusy(false); }
 }
 function navigation(mobile = false) { return <div className="flex h-full flex-col">
  <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-200"><ShieldCheck className="text-emerald-700" size={28}/><div><Link to="/home" className="font-bold text-slate-900">WildLife Safety</Link><p className="text-xs text-slate-500">{roleName}</p></div>{mobile && <button aria-label="Close navigation" onClick={()=>drawer.current.close()} className="ml-auto p-2"><X size={20}/></button>}</div>
  <nav aria-label={`${roleName} navigation`} className="flex-1 overflow-y-auto px-4 py-6 space-y-7">{groups.map(([label,items])=><div key={label}><p className="px-3 mb-2 text-xs font-semibold text-slate-500">{label}</p><div className="space-y-1">{items.map(([name,path])=><NavLink key={path} to={`${root}/${path}`} onClick={()=>drawer.current?.close()} className={({isActive})=>`flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-100'}`}><span>{name}</span>{(path === 'chat' ? unreadMessages : counts[path]) > 0 ? <span aria-label={`${path === 'chat' ? unreadMessages : counts[path]} items needing attention`} className="ml-auto min-w-6 rounded-full bg-emerald-700 px-2 py-0.5 text-center text-xs font-semibold text-white">{(path === 'chat' ? unreadMessages : counts[path]) > 99 ? '99+' : (path === 'chat' ? unreadMessages : counts[path])}</span> : <ChevronRight size={14}/>}</NavLink>)}</div></div>)}</nav>
  <div className="border-t border-slate-200 p-4 space-y-3"><Link to={`${root}/profile`} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700">My profile</Link>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={busy} onClick={signOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-50"><LogOut size={18}/>{busy ? 'Signing out...' : 'Sign out'}</button></div>
 </div>; }
 return <div className="min-h-screen bg-slate-50 lg:flex">
  <aside className="hidden lg:block sticky top-0 h-screen w-64 shrink-0 border-r border-slate-200 bg-white">{navigation()}</aside>
  <dialog ref={drawer} aria-label="Workspace navigation" onClick={e=>{if(e.target===drawer.current) drawer.current.close();}} className="dashboard-drawer fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-72 max-w-[90vw] border-0 p-0 backdrop:bg-slate-900/40">{navigation(true)}</dialog>
  <div className="min-w-0 flex-1"><header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8"><div className="flex min-w-0 items-center gap-3"><button aria-label="Open workspace navigation" onClick={()=>drawer.current.showModal()} className="lg:hidden p-2 rounded-lg hover:bg-slate-100"><Menu size={22}/></button><span className="truncate text-sm font-semibold text-slate-800">{title}</span></div><div className="flex items-center gap-3"><Link to="/home" aria-label="Return to website" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"><Home size={18}/><span className="hidden sm:inline">Back to website</span></Link><NotificationDropdown role={role}/></div></header>
  <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children || <Outlet/>}</main></div>
 </div>;
}
