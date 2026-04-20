import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, AlertCircle, Mail, Lock, Fingerprint } from 'lucide-react';
import { BASE_URL } from '../../config/constants';
import OtpVerificationModal from '../../components/ui/OtpVerificationModal';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e, otpValue = null) => {
    if (e) e.preventDefault();
    try {
      setError('');
      setLoading(true);

      const bodyData = otpValue ? { email, password, otp: otpValue } : { email, password };
      
      const response = await fetch(`${BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Access Denied: Invalid Credentials');
      }

      if (data.requiresOtp) {
        setShowOtp(true);
        return;
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminData', JSON.stringify(data.admin));

      setShowOtp(false);
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.message || 'System Authentication Failure');
      console.error('Admin login error:', error);
      setShowOtp(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Immersive Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] -ml-64 -mb-64" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10 space-y-4 animate-fade-in">
          <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 mb-2">
            <Shield className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
            WildSafe <span className="text-emerald-500 not-italic">Admin</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Secure Terminal Link</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden relative group">
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-24 -translate-y-full group-hover:translate-y-[500%] transition-transform duration-[3s] ease-linear pointer-events-none opacity-20" />
          
          {error && (
            <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-4 rounded-2xl mb-8 animate-shake">
              <AlertCircle size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Command Uplink ID</label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-500 group-focus-within/field:text-emerald-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all uppercase tracking-wide"
                  placeholder="IDENTITY@WILDSAFE.SYS"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Pass-Cipher</label>
                <Link to="/admin/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400">Forgot Cipher?</Link>
              </div>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-500 group-focus-within/field:text-emerald-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all uppercase tracking-[0.4em]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all disabled:opacity-50 group/btn overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              {loading ? (
                 <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Authorizing...</span>
                 </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Fingerprint size={16} />
                  <span>Initiate Login Sequence</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Unregistered Command Node?{' '}
              <button
                onClick={() => navigate('/admin/register')}
                className="text-emerald-500 hover:text-emerald-400 transition-colors ml-2"
              >
                Register Intel
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center animate-pulse">
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em]">Classified Access Only • AES-256 Encrypted</p>
        </div>
      </div>

      <OtpVerificationModal
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        email={email}
        loading={loading}
        onVerify={(otp) => handleLoginSubmit(null, otp)}
        onResend={() => handleLoginSubmit(null)}
        mode="login"
      />
    </div>
  );
}
