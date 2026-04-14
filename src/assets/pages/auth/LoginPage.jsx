import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Shield, ArrowRight, Chrome, Github, Twitter } from 'lucide-react';

export default function LoginPage({ setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      // Restore specific credential check
      if (email === 'mithun' && password === 'mithun@07') {
        setPage(null);
        navigate('/dashboard', { replace: true });
        return;
      }

      await login(email, password);
      setPage(null); // Reset authPage state to show main app
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message || 'Authorization failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await googleSignIn();
      setPage(null); // Reset authPage state to show main app
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Google Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] animate-pulse delay-700" />

      <div className="max-w-md w-full space-y-8 relative">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-200 rotate-3">
            <Shield size={32} />
          </div>
          <h2 className="mt-6 text-4xl font-black text-slate-900 tracking-tighter">
            Sector <span className="text-emerald-600">Access</span>
          </h2>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
            Identity verification required
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
                <div className="flex items-center justify-between ml-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Key</label>
                  <Link to="/forgot-password/reset-password" class="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700">Lost Key?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-600 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 group active:scale-95"
            >
              {loading ? 'Authorizing...' : 'Establish Connection'}
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
              <button onClick={handleGoogleSignIn} className="py-3 flex items-center justify-center bg-white border-2 border-slate-50 rounded-xl text-slate-400 hover:border-emerald-200 hover:text-emerald-600 hover:shadow-lg transition-all active:scale-95">
                <Chrome size={18} />
              </button>
              <button className="py-3 flex items-center justify-center bg-white border-2 border-slate-50 rounded-xl text-slate-400 hover:border-emerald-200 hover:text-emerald-600 hover:shadow-lg transition-all active:scale-95">
                <Github size={18} />
              </button>
              <button className="py-3 flex items-center justify-center bg-white border-2 border-slate-50 rounded-xl text-slate-400 hover:border-emerald-200 hover:text-emerald-600 hover:shadow-lg transition-all active:scale-95">
                <Twitter size={18} />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 font-medium text-sm">
          No active clearance? {' '}
          <Link to="/register" className="text-emerald-600 font-black uppercase tracking-widest hover:underline text-xs">
            Apply for Membership
          </Link>
        </p>
      </div>
    </div>
  );
}