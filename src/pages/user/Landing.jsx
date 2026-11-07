import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, BookOpen, Phone, MapPin, Users, MessageCircle, ArrowRight } from 'lucide-react';
const paths = [
 {title:'Identify a snake',text:'Upload a photo and explore identification results.',to:'/identify',icon:Camera},
 {title:'Safety resources',text:'Browse articles and explore the wildlife directory.',to:'/learning',icon:BookOpen},
 {title:'Wildlife map',text:'Explore mapped wildlife information in one place.',to:'/map',icon:MapPin},
 {title:'Community',text:'Share sightings and learn from other people’s experiences.',to:'/communityFeed',icon:Users},
 {title:'Talk to a medical officer',text:'Sign in to start or continue a support conversation.',to:'/chat',icon:MessageCircle},
];
export default function Landing(){return <div className="space-y-10 pb-6">
 <section className="rounded-3xl bg-emerald-950 px-6 py-12 sm:p-12 text-white"><p className="text-sm font-semibold text-emerald-200">WildLife Safety · Sri Lanka</p><h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl leading-tight">Know your wildlife.<br/>Find the help you need.</h1><p className="mt-5 max-w-xl text-base leading-relaxed text-emerald-100">Identify a snake, explore safety resources, and connect with your community,all in one place.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/identify" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-emerald-900"><Camera size={19}/>Identify a snake</Link><Link to="/emergency" className="inline-flex items-center gap-2 rounded-xl border border-emerald-400 px-5 py-3 font-semibold text-white"><Phone size={19}/>Emergency help</Link></div></section>
 <section><h2 className="text-2xl text-slate-900">What would you like to do?</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{paths.map(({title,text,to,icon:Icon})=><Link key={to} to={to} className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-emerald-400 transition-colors"><Icon size={24} className="text-emerald-700"/><h3 className="mt-4 text-lg">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">Explore <ArrowRight size={16}/></span></Link>)}</div></section>
 <section className="flex flex-wrap justify-between gap-4 rounded-2xl border border-slate-200 p-6"><div><h2 className="text-lg">Need help using WildLife Safety?</h2><p className="mt-1 text-sm text-slate-600">Send a question or feedback to our team.</p></div><Link className="btn-secondary self-center" to="/contact">Contact us</Link></section>
 </div>}
