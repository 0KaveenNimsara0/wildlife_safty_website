import { sessionToken } from '../config/app.js';
import { BASE_URL } from '../config/constants.js';
// Reconnect refreshes the persisted count, recovering missed events.
function openStream(token, onChange) {
 let stopped=false, controller, timer, delay=1000;
 async function connect() {
  if (!token || stopped) return;
  controller=new AbortController();
  try {
   const response=await fetch(`${BASE_URL}/notifications/stream`,{headers:{Authorization:`Bearer ${token}`},signal:controller.signal});
   if (response.status===401 || response.status===403) return;
   if (!response.ok || !response.body) throw new Error('Stream unavailable');
   delay=1000;
   const reader=response.body.getReader(), decoder=new TextDecoder();
   let buffer='';
   while(!stopped) {
    const {value,done}=await reader.read(); if(done) break;
    buffer+=decoder.decode(value,{stream:true});
    let split;
    while((split=buffer.indexOf('\n\n'))!==-1) {
     const event=buffer.slice(0,split);buffer=buffer.slice(split+2);
     if(event.startsWith('data:')) onChange();
    }
   }
  } catch { /* Retry with backoff; no parallel polling loop. */ }
  if(!stopped) { timer=setTimeout(connect,delay);delay=Math.min(delay*2,30000); }
 }
 connect();
 return ()=>{stopped=true;clearTimeout(timer);controller?.abort();};
}

// One authenticated connection per session, shared by every mounted consumer.
const streams = new Map();
export function subscribeNotifications(onChange) {
 const token = sessionToken();
 if (!token) return () => {};
 let stream = streams.get(token);
 if (!stream) {
  stream = { listeners: new Set(), stop: null };
  streams.set(token, stream);
  stream.stop = openStream(token, () => {
   for (const listener of stream.listeners) {
    try { Promise.resolve(listener()).catch(() => {}); } catch { /* Isolate consumers. */ }
   }
  });
 }
 const listener = () => onChange();
 stream.listeners.add(listener);
 let removed = false;
 return () => {
  if (removed) return;
  removed = true;
  stream.listeners.delete(listener);
  if (!stream.listeners.size) { stream.stop(); streams.delete(token); }
 };
}
