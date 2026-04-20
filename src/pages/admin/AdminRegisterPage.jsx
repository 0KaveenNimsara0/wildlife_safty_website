import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, User, Mail, Lock, UserPlus, Fingerprint } from 'lucide-react';
import { BASE_URL } from '../../config/constants';
import OtpVerificationModal from '../../components/ui/OtpVerificationModal';

export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError('Sync Error: Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Security Breach: Password too short (Min 6)');
    }

    try {
      setError('');
      setOtpSending(true);

      const response = await fetch(`${BASE_URL}/shared-auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
      
      setShowOtp(true);
    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Protocol failure while verifying email.');
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyRegister = async (otpValue) => {
    try {
      setError('');
      setLoading(true);

      const response = await fetch(`${BASE_URL}/admin/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          otp: otpValue
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'System Enrollment Failed');
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminData', JSON.stringify(data.admin));

      setShowOtp(false);
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.message || 'Enrollment Protocol Failure');
      console.error('Admin registration error:', error);
      setShowOtp(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Immersive Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -ml-64 -mt-64 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] -mr-64 -mb-64" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10 space-y-4 animate-fade-in">
          <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 mb-2">
            <UserPlus className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase italic text-center">
            Enroll <span className="text-emerald-500 not-italic">Officer</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Command Registration Protocol</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden relative group">
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-24 -translate-y-full group-hover:translate-y-[500%] transition-transform duration-[3.s] ease-linear pointer-events-none opacity-20" />
          
          {error && (
            <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-4 rounded-2xl mb-8 animate-shake">
              <AlertCircle size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
            </div>
          )}

          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Name</label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-500 group-focus-within/field:text-emerald-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all uppercase tracking-wide"
                  placeholder="OFFICER FULL NAME"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Network Email</label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-500 group-focus-within/field:text-emerald-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all uppercase tracking-wide"
                  placeholder="UPLINK@WS.ACCESS"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cipher</label>
                <div className="relative group/field">
                  <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within/field:text-emerald-500 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all uppercase tracking-[0.2em]"
                    placeholder="••••"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                <div className="relative group/field">
                  <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within/field:text-emerald-500 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all uppercase tracking-[0.2em]"
                    placeholder="••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={otpSending || loading}
              className="w-full flex justify-center items-center py-5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all disabled:opacity-50 group/btn overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              {otpSending ? (
                 <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                 </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Fingerprint size={16} />
                  <span>Execute Registry Entry</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Already Operational?{' '}
              <button
                onClick={() => navigate('/admin/login')}
                className="text-emerald-500 hover:text-emerald-400 transition-colors ml-2"
              >
                Access Terminal
              </button>
            </p>
          </div>
        </div>
      </div>

      <OtpVerificationModal
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        email={formData.email}
        loading={loading}
        onVerify={handleVerifyRegister}
        onResend={() => handleSendOtp()}
        mode="register"
      />
    </div>
  );
}
