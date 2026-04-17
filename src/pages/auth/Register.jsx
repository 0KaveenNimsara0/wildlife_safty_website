import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Shield, ArrowRight, Chrome, Github, Twitter, CheckCircle } from 'lucide-react';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, sendEmailVerification } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== passwordConfirm) return setError('Encryption mismatch: Passwords do not align.');
    try {
      setError('');
      setLoading(true);
      
      // Use MongoDB registration
      await signup(email, password, name);
      
      setError('');
      alert('Personnel record established successfully. You may now access the terminal.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Personnel record could not be established.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] animate-pulse delay-700" />

      <div className="max-w-md w-full space-y-8 relative">
        <div className="text-center space-y-2">
          <div className="mx-auto w-24 h-24 relative group">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-[28px] blur-2xl group-hover:bg-emerald-500/30 transition-all duration-500" />
            <div className="relative bg-white rounded-[28px] shadow-2xl shadow-emerald-500/10 flex items-center justify-center p-4 border border-slate-100 rotate-3 group-hover:rotate-0 transition-all duration-500 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent" />
               <img 
                 src="/src/assets/logo.png" 
                 alt="WildLife Safety Logo" 
                 className="w-full h-full object-contain relative z-10"
               />
            </div>
          </div>
          <h2 className="mt-6 text-4xl font-black text-slate-900 tracking-tighter">
            Sector <span className="text-emerald-600">Enlistment</span>
          </h2>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
            Establish your identity record
          </p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] shadow-2xl border-white/40 ring-1 ring-slate-900/5">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-700 text-xs font-black uppercase tracking-widest text-center animate-shake">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Full Identity Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Authorized Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                    placeholder="agent@wildsafe.gov"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Security Key</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Verify Key</label>
                <div className="relative group">
                  <CheckCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input
                    type="password"
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                    placeholder="Repeat key"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-600 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 group active:scale-95"
            >
              {loading ? 'Initializing...' : 'Enlist Personnel'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 whitespace-nowrap">Collaborative Sync</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[Chrome, Github, Twitter].map((Icon, i) => (
                <button key={i} className="py-3 flex items-center justify-center bg-white border-2 border-slate-50 rounded-xl text-slate-400 hover:border-emerald-200 hover:text-emerald-600 hover:shadow-lg transition-all active:scale-95">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 font-medium text-sm">
          Already cleared? {' '}
          <Link to="/login" className="text-emerald-600 font-black uppercase tracking-widest hover:underline text-xs">
            Access Terminal
          </Link>
        </p>
      </div>
    </div>
  );
}
