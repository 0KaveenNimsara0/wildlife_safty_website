import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  User,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  AlertCircle,
  Key,
  ShieldCheck,
  Fingerprint,
  RotateCcw,
  Smartphone
} from 'lucide-react';
import { BASE_URL } from '../../../config/constants';
import OtpVerificationModal from '../../../components/ui/OtpVerificationModal';

export default function AdminProfileSection() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Administrator'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Security States
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifiedOtp, setVerifiedOtp] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminData');

    if (token && admin) {
      const parsedAdmin = JSON.parse(admin);
      setAdminData(parsedAdmin);
      setFormData({
        name: parsedAdmin.name || '',
        email: parsedAdmin.email || '',
        role: parsedAdmin.role || 'Administrator'
      });
      setOtpEmail(parsedAdmin.email || '');
    }
    setLoading(false);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: adminData?.name || '',
      email: adminData?.email || '',
      role: adminData?.role || 'Administrator'
    });
    setError('');
    setSuccess('');
  };

   const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        setAdminData(data.admin);
        setIsEditing(false);
        setSuccess('Personnel profile records synchronized.');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Transmission failed.');
      }
    } catch (err) {
      setError('Signal disruption: Update could not be committed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPasswordReset = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/auth/request-password-otp`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setIsOtpModalOpen(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Security protocol failure.');
      }
    } catch (err) {
      setError('Connection interrupted.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerified = async (otp) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/auth/verify-password-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ otp })
      });

      const data = await response.json();
      if (response.ok) {
        setVerifiedOtp(otp);
        setIsOtpModalOpen(false);
        setIsPasswordModalOpen(true);
      } else {
        // Throw error so the modal can handle incorrect attempt
        throw new Error(data.message || 'Verification rejected.');
      }
    } catch (err) {
      // Propagate error to modal
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          otp: verifiedOtp
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Access credentials successfully reset and encrypted.');
        setIsPasswordModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setVerifiedOtp('');
      } else {
        setError(data.message || 'Security reset rejected.');
      }
    } catch (err) {
      setError('Protocol error during security reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 font-black uppercase tracking-widest text-[10px]">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Profile Header Hero */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
           <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] bg-emerald-600 border-4 border-slate-800 flex items-center justify-center text-4xl font-black shadow-2xl overflow-hidden shadow-emerald-900/40 transition-transform duration-500 group-hover:scale-105">
                 {adminData?.name?.charAt(0) || 'A'}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Edit3 size={24} className="text-white" />
                 </div>
              </div>
              <div className="absolute -bottom-2 -right-2 p-2.5 bg-emerald-500 rounded-xl border-4 border-slate-900 shadow-lg shadow-emerald-500/20">
                 <Shield size={16} className="text-white" />
              </div>
           </div>
           <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                 <h1 className="text-4xl font-black tracking-tight uppercase text-white">{adminData?.name || 'Administrator'}</h1>
                 <div className="px-4 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-500/30 backdrop-blur-md">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Administrator</span>
                 </div>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-[0.15em] text-sm mb-6 underline decoration-slate-800 underline-offset-8">{adminData?.email}</p>
              <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                 <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <Fingerprint size={14} className="text-emerald-500" /> User ID: <span className="text-white">{adminData?.uid?.slice(0, 8) || 'ADMIN_USER_01'}</span>
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <ShieldCheck size={14} className="text-emerald-500" /> Access Level: <span className="text-emerald-500">LEVEL 4 ROOT</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
        {(error || success) && (
          <div className={`px-8 py-5 rounded-[24px] flex items-center gap-4 animate-shake ${error ? 'bg-rose-50 border border-rose-100 text-rose-700' : 'bg-emerald-50 border border-emerald-100 text-emerald-700'}`}>
            <AlertCircle size={20} className={error ? 'text-rose-500' : 'text-emerald-500'} />
            <span className="text-[10px] font-black uppercase tracking-widest">{error || success}</span>
          </div>
        )}

        <div className="card-premium p-12 bg-white border-slate-100 overflow-hidden relative shadow-2xl shadow-slate-200/50 rounded-[40px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 mb-2">Account Administration</h3>
              <p className="text-2xl font-black text-slate-900 tracking-tight uppercase">Admin Settings <span className="text-slate-200">/</span> Summary</p>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-3 px-8 py-4 bg-slate-900 border border-slate-900 text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-600 hover:border-emerald-600 rounded-2xl shadow-xl shadow-slate-900/10 transition-all active:scale-95 transition-all"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/20 active:scale-95 transition-all"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-3 px-8 py-4 bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Profile Details */}
            <div className="space-y-8">
              {[
                { label: 'Full Name', name: 'name', icon: User, val: formData.name },
                { label: 'Email Address', name: 'email', icon: Mail, val: formData.email }
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">
                    {field.label}
                  </label>
                  {isEditing ? (
                    <div className="relative group">
                       <field.icon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                        type={field.name === 'email' ? 'email' : 'text'}
                        name={field.name}
                        value={field.val}
                        onChange={handleInputChange}
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[20px] font-black text-xs uppercase tracking-widest text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all shadow-inner"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center min-h-[64px] px-8 bg-slate-50/50 border border-slate-50 rounded-[20px] shadow-sm">
                      <field.icon size={18} className="text-slate-300 mr-5" />
                      <span className="text-xs font-black text-slate-900 tracking-widest uppercase">{field.val || 'NULL_NODE'}</span>
                    </div>
                  )}
                </div>
              ))}

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">
                  Access Level
                </label>
                {isEditing ? (
                   <div className="relative group">
                      <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full pl-16 pr-10 py-5 bg-slate-50 border-2 border-transparent rounded-[20px] font-black text-xs uppercase tracking-widest text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 appearance-none transition-all shadow-inner"
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Moderator">Moderator</option>
                      </select>
                   </div>
                ) : (
                  <div className="flex items-center min-h-[64px] px-8 bg-emerald-50 border border-emerald-100 rounded-[20px] shadow-sm">
                    <Shield size={18} className="text-emerald-500 mr-5" />
                    <span className="text-xs font-black text-emerald-700 tracking-widest uppercase">{adminData?.role || 'Administrator Authority'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Info */}
            <div className="space-y-8">
               {[
                 { label: 'Join Date', icon: Calendar, val: adminData?.createdAt ? new Date(adminData.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Member since 2024' },
                 { label: 'Last Update', icon: Key, val: `${new Date().toLocaleDateString()} @ ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` }
               ].map((item, idx) => (
                 <div key={idx}>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">
                      {item.label}
                    </label>
                    <div className="flex items-center h-[64px] px-8 bg-slate-50/50 border border-slate-50 rounded-[20px] shadow-sm">
                      <item.icon size={18} className="text-slate-300 mr-5" />
                      <span className="text-xs font-black text-slate-900 tracking-tight uppercase tracking-widest">{item.val}</span>
                    </div>
                 </div>
               ))}

               <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">
                  Connection Status
                </label>
                <div className="flex items-center h-[64px] px-8 bg-slate-900 border border-slate-800 rounded-[20px] shadow-xl">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-5 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse"></div>
                  <span className="text-xs font-black text-white tracking-tight uppercase italic tracking-widest">SYSTEM ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Security Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[
          { title: 'Security Settings', sub: 'Update account password', icon: Key, action: 'Update Password', color: 'emerald', onClick: handleRequestPasswordReset },
          { title: '2FA Settings', sub: 'Multi-factor identification', icon: Smartphone, action: 'Manage 2FA', color: 'slate', onClick: () => setSuccess('2FA management coming soon') }
        ].map((sec, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-10 flex flex-col justify-between rounded-[40px] shadow-2xl shadow-slate-200/40 hover:shadow-2xl transition-all group">
            <div className="flex items-start justify-between mb-10">
               <div className={`p-5 rounded-[24px] ${sec.color === 'emerald' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-slate-900 shadow-slate-900/10'} text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                  <sec.icon size={24} />
               </div>
               <div className="text-right">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">{sec.title}</h4>
                  <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{sec.sub}</p>
               </div>
            </div>
            <button 
              onClick={sec.onClick}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all
              ${sec.color === 'emerald' ? 'bg-emerald-600 text-white hover:bg-slate-900 shadow-xl shadow-emerald-900/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}
              active:scale-95
            `}>
              {sec.action}
            </button>
          </div>
        ))}
      </div>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        email={otpEmail}
        onVerify={handleOtpVerified}
        onResend={handleRequestPasswordReset}
      />

      {/* Password Reset Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <ShieldCheck size={28} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Reset Password</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Security Override</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Current Password</label>
                    <input 
                       type="password"
                       value={currentPassword}
                       onChange={(e) => setCurrentPassword(e.target.value)}
                       className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:outline-none focus:border-emerald-500 transition-all"
                       placeholder="••••••••"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">New Password</label>
                    <input 
                       type="password"
                       value={newPassword}
                       onChange={(e) => setNewPassword(e.target.value)}
                       className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:outline-none focus:border-emerald-500 transition-all"
                       placeholder="••••••••"
                    />
                    <p className="mt-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-1 italic">* Minimum 6 characters required</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-10">
                 <button 
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="py-4 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={handlePasswordReset}
                    disabled={loading}
                    className="py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50"
                 >
                    {loading ? 'Processing...' : 'Confirm Reset'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
