import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const SecuritySection = ({ updatePassword, setSuccess, setError }) => {
  const { activeUser, sendEmailVerification, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Auto-refresh user state on mount to ensure hasPassword flag is current
  useEffect(() => {
    refreshUser();
  }, []);

  const hasPassword = activeUser?.hasPassword;

  const handleSendCode = async () => {
    try {
      setOtpLoading(true);
      setError('');
      setSuccess('');
      await sendEmailVerification();
      setOtpSent(true);
      setSuccess('Security code sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to send security code.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      return setError('Security code is required for password changes.');
    }

    if (hasPassword && !currentPassword) {
      return setError('Current password is required.');
    }

    if (!newPassword || !confirmPassword) {
      return setError('New password fields cannot be empty.');
    }

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match.');
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await updatePassword(newPassword, currentPassword, otp);
      setSuccess('Security credentials updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setOtpSent(false);
    } catch (err) {
      setError(err.message || 'System rejected credential update.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 pb-8 border-b border-slate-50">
        <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
          <Shield size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">Security & Password</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Manage your account access keys</p>
        </div>
      </div>

      <form onSubmit={handleUpdatePassword} className="space-y-8 max-w-lg">
        {/* Step 1: OTP Requirement */}
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest">
              <Mail size={14} className="text-emerald-500" />
              Identity Verification
            </div>
            {otpSent ? (
               <button 
               type="button"
               onClick={handleSendCode}
               disabled={otpLoading}
               className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl hover:bg-emerald-100 transition-colors disabled:opacity-50 border border-emerald-100"
             >
               {otpLoading ? 'Re-sending...' : 'Resend Security Code'}
             </button>
            ) : (
              <button 
                type="button"
                onClick={handleSendCode}
                disabled={otpLoading}
                className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {otpLoading ? 'Sending...' : 'Send Security Code'}
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Security Code</label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-emerald-500 focus:outline-none transition-all font-black text-slate-800 tracking-[0.5em] text-center"
            />
          </div>
        </div>

        {/* Step 2: Password Fields */}
        <div className="space-y-6 pt-4">
          {hasPassword && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="password"
                  placeholder="Verify existing key"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-rose-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">New Password</label>
            <div className="relative">
              <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="password"
                placeholder="New security key"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-rose-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Confirm New Password</label>
            <div className="relative">
              <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="password"
                placeholder="Verify new key"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-rose-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Updating Credentials...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default SecuritySection;
