import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Shield, ArrowRight, Chrome, Github, Twitter, CheckCircle, Info, Eye, EyeOff } from 'lucide-react';
import OtpVerificationModal from '../../components/ui/OtpVerificationModal';
import AuthLayout from '../../components/auth/AuthLayout';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signup, sendRegistrationOtp } = useAuth();
  const navigate = useNavigate();

  async function handleSendOtp(e) {
    if (e) e.preventDefault();
    if (password !== passwordConfirm) return setError('Encryption mismatch: Passwords do not align.');
    
    try {
      setError('');
      setOtpSending(true);
      await sendRegistrationOtp(email);
      setShowOtp(true);
    } catch (err) {
      console.error('OTP Send error:', err);
      setError(err.message || 'Failed to send verification code.');
    } finally {
      setOtpSending(false);
    }
  }

  async function handleVerifyOtp(otpValue) {
    try {
      setError('');
      setLoading(true);
      
      // Use MongoDB registration with OTP
      await signup(email, password, name, otpValue);
      
      setShowOtp(false);
      navigate('/login', { state: { message: 'Personnel record established successfully. You may now access the terminal.' } });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Check code or try again.');
      setShowOtp(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout 
      title="Join the" 
      subtitle="Network" 
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

        <form className="space-y-6" onSubmit={handleSendOtp}>
          <div className="space-y-5">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                Personnel Name
              </label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                Secure Email
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                  Cipher
                </label>
                 <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5 tracking-[0.2em]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                  Validate
                </label>
                 <div className="relative group">
                  <CheckCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full pl-14 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5 tracking-[0.2em]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={otpSending || loading}
            className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-600 shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-4 group active:scale-[0.98] disabled:opacity-50"
          >
            {otpSending ? 'Initiating Handshake...' : 'Establish Clearance'}
            {!otpSending && <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />}
          </button>
        </form>

        <div className="space-y-6">
          <div className="flex items-center gap-5">
            <div className="flex-1 h-[1px] bg-slate-100" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 whitespace-nowrap">External Handshake</span>
            <div className="flex-1 h-[1px] bg-slate-100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="py-4 flex items-center justify-center gap-3 bg-white border-2 border-slate-50 rounded-[1.5rem] hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all active:scale-95 group">
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
            Already have clearance? {' '}
            <Link to="/login" className="text-emerald-600 font-black uppercase tracking-[0.2em] hover:text-emerald-700 underline underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-500 transition-all text-xs">
              Initiate Login
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
        onResend={() => handleSendOtp()}
        mode="register"
      />
    </AuthLayout>
  );
}
