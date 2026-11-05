import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { notificationApi } from '../../services/api';
import { subscribeNotifications } from '../../services/notificationStream';

export default function NotificationToasts() {
 const {activeUser}=useAuth();
 const [toasts,setToasts]=useState([]);
 const navigate=useNavigate();
 useEffect(()=>{
  setToasts([]);
  if(!activeUser) return;
  let stopped=false, pending=false, initialized=false;
  const seen=new Set(), timers=[];
  const refresh=async()=>{
   if(pending) return; pending=true;
   try {
    const {data}=await notificationApi.getNotifications();
    if(stopped || !data.success) return;
    const fresh=data.notifications.filter(n=>!seen.has(n._id) && !n.isRead);
    data.notifications.forEach(n=>seen.add(n._id));
    if(initialized) fresh.slice(0,3).forEach(n=>{
     setToasts(old=>[...old,n].slice(-3));
     timers.push(setTimeout(()=>setToasts(old=>old.filter(t=>t._id!==n._id)),8000));
    });
    initialized=true;
   } catch {} finally {pending=false;}
  };
  refresh(); const unsubscribe=subscribeNotifications(refresh);
  return ()=>{stopped=true;unsubscribe();timers.forEach(clearTimeout);};
 },[activeUser?.uid,activeUser?.role]);
 const open=()=>navigate(activeUser?.role==='admin'?'/admin/notifications':activeUser?.role==='medicalOfficer'?'/medical-officer/notifications':'/dashboard/notifications');
 return <div aria-live="polite" aria-relevant="additions" className="fixed bottom-4 right-4 z-[150] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">{toasts.map(n=><div key={n._id} className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-lg"><Bell size={20} className="shrink-0 text-emerald-700"/><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">New notification</p><p className="mt-1 text-sm text-slate-600 break-words">{n.message}</p><button onClick={()=>{open();setToasts(old=>old.filter(t=>t._id!==n._id));}} className="mt-2 text-sm font-semibold text-emerald-700">View notifications</button></div><button aria-label="Dismiss notification" onClick={()=>setToasts(old=>old.filter(t=>t._id!==n._id))} className="p-1 text-slate-500"><X size={18}/></button></div>)}</div>;
}
