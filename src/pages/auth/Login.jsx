import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Shield, ArrowRight, Chrome, Github, Twitter, Info, Eye, EyeOff } from 'lucide-react';
import OtpVerificationModal from '../../components/ui/OtpVerificationModal';
import AuthLayout from '../../components/auth/AuthLayout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    try {
      setError('');
      setLoading(true);

      const data = await login(email, password);
      
      if (data && data.requiresOtp) {
        setShowOtp(true);
        return; // Do not navigate yet
      }

      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message || 'Authorization failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(otpValue) {
    try {
      setError('');
      setLoading(true);

      await login(email, password, otpValue);
      setShowOtp(false);
      navigate('/home', { replace: true });
    } catch (err) {
      console.error('OTP Verification error:', err);
      setError(err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await googleSignIn();
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Google Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout 
      title="Welcome" 
      subtitle="Back" 
      quote="The more clearly we can focus our attention on the wonders and realities of the universe about us, the less taste we shall have for destruction."
      author="Rachel Carson"
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

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                Personnel Email
              </label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5"
                  placeholder="agent@wildsafe.gov"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex items-center justify-between px-5">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  Secure Password
                </label>
                <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">
                  Forgot?
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

          <div className="flex items-center gap-3 px-2">
             <input type="checkbox" id="remember" className="w-4 h-4 rounded-md border-2 border-slate-200 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
             <label htmlFor="remember" className="text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">Remember my terminal session</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-600 shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-4 group active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Decrypting Access...' : 'Authenticate Login'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />}
          </button>
        </form>

        <div className="space-y-6">
          <div className="flex items-center gap-5">
            <div className="flex-1 h-[1px] bg-slate-100" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 whitespace-nowrap">External Handshake</span>
            <div className="flex-1 h-[1px] bg-slate-100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleGoogleSignIn} 
              className="py-4 flex items-center justify-center gap-3 bg-white border-2 border-slate-50 rounded-[1.5rem] hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all active:scale-95 group"
            >
              <Chrome size={20} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-600 transition-colors">Google</span>
            </button>
            <button className="py-4 flex items-center justify-center gap-3 bg-white border-2 border-slate-50 rounded-[1.5rem] hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all active:scale-95 group">
              <Github size={20} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-600 transition-colors">Github</span>
            </button>
          </div>
        </div>

        <div className="pt-4 text-center">
          <p className="text-slate-400 font-bold text-sm">
            Not yet authorized? {' '}
            <Link to="/register" className="text-emerald-600 font-black uppercase tracking-[0.2em] hover:text-emerald-700 underline underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-500 transition-all text-xs">
              Establish Account
            </Link>
          </p>
        </div>
      </div>

      <OtpVerificationModal
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        email={email}
        loading={loading}
        onVerify={handleVerifyOtp}
        onResend={() => handleSubmit()}
        mode="login"
      />
    </AuthLayout>
  );
}
