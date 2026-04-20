import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, AlertCircle, Mail, Lock, Fingerprint, ArrowRight, Info, Eye, EyeOff } from 'lucide-react';
import { BASE_URL } from '../../config/constants';
import OtpVerificationModal from '../../components/ui/OtpVerificationModal';
import AuthLayout from '../../components/auth/AuthLayout';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <AuthLayout 
      title="Admin" 
      subtitle="Terminal" 
      quote="Management is doing things right; leadership is doing the right things."
      author="Peter Drucker"
      role="admin"
    >
      <div className="space-y-8 animate-fade-in-up">
        {error && (
          <div className="flex items-start gap-4 p-5 bg-rose-50 border border-rose-100 rounded-3xl text-rose-700 animate-shake">
            <Info className="flex-shrink-0 mt-0.5" size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
              {error}
            </span>
          </div>
        )}

        <form className="space-y-8" onSubmit={handleLoginSubmit}>
          <div className="space-y-5">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                Command Uplink ID
              </label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5"
                  placeholder="IDENTITY@WILDSAFE.SYS"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex items-center justify-between mx-5">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  Access Pass-Cipher
                </label>
                <Link to="/admin/forgot-password" title="Initiate Recovery" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">
                  Recovery
                </Link>
              </div>
               <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-16 pr-14 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5 tracking-[0.3em]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-600 shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-4 group active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Authorizing Uplink...' : 'Initiate Terminal Link'}
            {!loading && <Fingerprint size={18} className="group-hover:scale-110 transition-transform duration-500" />}
          </button>
        </form>

        <div className="pt-4 text-center">
          <p className="text-slate-400 font-bold text-sm">
            Unregistered node? {' '}
            <Link to="/admin/register" className="text-emerald-600 font-black uppercase tracking-[0.2em] hover:text-emerald-700 underline underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-500 transition-all text-xs">
              Establish Clearance
            </Link>
          </p>
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
    </AuthLayout>
  );
}
