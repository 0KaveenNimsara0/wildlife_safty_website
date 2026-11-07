import React from 'react';
import { Camera, Shield, Leaf, Heart } from 'lucide-react';
import logo from '../../assets/logo.png';
import sidebarImage from '../../assets/auth-sidebar1.png';

export default function AuthLayout({ children, title, subtitle, quote, author, role = 'user' }) {
  const roleColors = {
    user: 'text-emerald-600',
    admin: 'text-rose-600',
    medicalOfficer: 'text-emerald-600'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-5 sm:px-8 lg:px-12 py-8 relative bg-white z-10 shadow-[20px_0_60px_rgba(0,0,0,0.03)] focus-within:shadow-[20px_0_80px_rgba(0,0,0,0.05)] transition-all duration-700">
        
        {/* Mobile Header (Visible only on small screens) */}
        <div className="lg:hidden mb-6 flex items-center space-x-3 pointer-events-none opacity-50">
           <img src={logo} alt="Logo" className="w-8 h-8" />
           <span className="text-sm font-semibold tracking-tighter text-slate-900">WildLife Safety</span>
        </div>

        <div className="max-w-sm w-full mx-auto space-y-4 animate-slide-up">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600/60">Secure Access</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tighter leading-none">
                {title} <span className={roleColors[role] || roleColors.user}>{subtitle}</span>
              </h1>
              <p className="text-slate-500 font-medium text-sm pt-2 leading-relaxed italic">
                Protecting our wilderness through intelligent intervention.
              </p>
            </div>
          </div>

          <div className="relative">
            {children}
          </div>
        </div>
        
        {/* Footer info links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Protocol</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Term of Service</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">System Support</a>
        </div>
      </div>

      {/* Image Side (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col w-1/2 min-h-[680px] relative bg-slate-900 overflow-hidden group">
        {/* Main Background Image */}
        <img 
          src={sidebarImage} 
          alt="Wildlife Conservation" 
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-out opacity-80"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 bg-emerald-950/20 mix-blend-overlay" />

        {/* Content */}
        <div className="absolute top-12 left-12 flex items-center space-x-4">
           <div className="w-14 h-14 bg-white/10 backdrop-blur-3xl rounded-2xl flex items-center justify-center border border-white/20 shadow-sm">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain shadow-inner" />
           </div>
           <div className="flex flex-col">
              <span className="text-white text-xl font-semibold tracking-tighter italic">WildLife Safety</span>
              <span className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wide">Smart Protection Agency</span>
           </div>
        </div>

        <div className="relative border-l-2 border-emerald-500/50 pl-6 mt-auto mb-12 mx-10 space-y-4">
          <div className="flex gap-4 mb-2">
            <Shield className="text-emerald-500" size={24} />
            <Leaf className="text-emerald-500" size={24} />
            <Heart className="text-emerald-500" size={24} />
          </div>
          <h2 className="text-xl xl:text-2xl font-medium text-white leading-relaxed">
            "{quote || 'Every life in the wild is a treasure worth protecting.'}"
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-8 bg-emerald-500" />
            <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-xs">
              {author || 'Wildlife Guardian Protocol'}
            </p>
          </div>
        </div>

        {/* Floating Stats or Badges */}
        <div className="relative flex gap-3 mx-10 mb-8">
           {[
             { label: 'Verified Experts', value: '500+' },
             { label: 'Species Tracked', value: '1.2k' },
             { label: 'Safe Zones', value: '45' }
           ].map((stat, i) => (
             <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/5 p-4 rounded-2xl flex-1 animate-fade-in" style={{ animationDelay: `${i * 200}ms` }}>
                <div className="text-white font-semibold text-xl">{stat.value}</div>
                <div className="text-emerald-400 text-[8px] font-semibold uppercase tracking-widest leading-none mt-1">{stat.label}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
