import React, { useState } from 'react';
import { Shield, Key } from 'lucide-react';

const SecuritySection = ({ updatePassword, setSuccess, setError }) => {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      return setError('Access keys cannot be empty.');
    }

    if (newPassword !== confirmPassword) {
      return setError('Encryption mismatch: Passwords do not align.');
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await updatePassword(newPassword);
      setSuccess('Security credentials updated.');
      setNewPassword('');
      setConfirmPassword('');
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
          <h3 className="text-2xl font-black text-slate-900">Credential Hardening</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Update Sector Access Keys</p>
        </div>
      </div>

      <form onSubmit={handleUpdatePassword} className="space-y-8 max-w-lg">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">New Access Key</label>
          <div className="relative">
            <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-rose-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Verify Key</label>
          <div className="relative">
            <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-rose-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Processing Cryptography...' : 'Commit Protocol Override'}
        </button>
      </form>
    </div>
  );
};

export default SecuritySection;
