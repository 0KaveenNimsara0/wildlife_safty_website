import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { Link } from 'react-router-dom';
import { Mail, RefreshCw, Shield, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Recovery instructions transmitted. Check your secure inbox.');
    } catch (err) {
      setError('System failure: Recovery protocol could not be initiated.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
      
      <div className="max-w-md w-full space-y-8 relative">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-200 rotate-3">
            <RefreshCw size={32} />
          </div>
          <h2 className="mt-6 text-4xl font-black text-slate-900 tracking-tighter">
            Access <span className="text-emerald-600">Recovery</span>
          </h2>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
            Initiate credential reset protocol
          </p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] shadow-2xl border-white/40 ring-1 ring-slate-900/5">
          {message ? (
            <div className="space-y-8 py-4 text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                <CheckCircle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Protocol Initiated</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{message}</p>
              </div>
              <Link to="/login" className="btn-primary py-4 px-8 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Return to Terminal
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-700 text-xs font-black uppercase tracking-widest text-center animate-shake">
                  {error}
                </div>
              )}
              
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-600 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 group active:scale-95"
              >
                {loading ? 'Transmitting...' : 'Request Override'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="pt-4 text-center">
                <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 flex items-center justify-center gap-2">
                  <ArrowLeft size={12} /> Abort Recovery
                </Link>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-slate-500 font-medium text-sm">
          Need new clearance? {' '}
          <Link to="/register" className="text-emerald-600 font-black uppercase tracking-widest hover:underline text-xs" title="register" id="register">
            Apply for Membership
          </Link>
        </p>
      </div>
    </div>
  );
}