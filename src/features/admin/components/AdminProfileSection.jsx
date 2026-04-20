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
  Smartphone,
  Fingerprint
} from 'lucide-react';

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

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    const updatedAdmin = { ...adminData, ...formData };
    localStorage.setItem('adminData', JSON.stringify(updatedAdmin));
    setAdminData(updatedAdmin);
    setIsEditing(false);
    setSuccess('Profile updated successfully');
    setTimeout(() => setSuccess(''), 3000);
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
                        className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-[20px] font-black text-xs uppercase tracking-widest text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all shadow-inner"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center h-[64px] px-8 bg-slate-50/50 border border-slate-50 rounded-[20px] shadow-sm">
                      <field.icon size={18} className="text-slate-300 mr-5" />
                      <span className="text-xs font-black text-slate-900 tracking-tight uppercase tracking-widest">{field.val || 'NULL_NODE'}</span>
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
                        className="w-full pl-14 pr-10 py-4.5 bg-slate-50 border-2 border-transparent rounded-[20px] font-black text-xs uppercase tracking-widest text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 appearance-none transition-all shadow-inner"
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Moderator">Moderator</option>
                      </select>
                   </div>
                ) : (
                  <div className="flex items-center h-[64px] px-8 bg-emerald-50 border border-emerald-100 rounded-[20px] shadow-sm">
                    <Shield size={18} className="text-emerald-500 mr-5" />
                    <span className="text-xs font-black text-emerald-700 tracking-tight uppercase tracking-[0.1em]">{adminData?.role || 'Administrator Authority'}</span>
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
          { title: 'Security Settings', sub: 'Update account password', icon: Key, action: 'Update Password', color: 'emerald' },
          { title: '2FA Settings', sub: 'Multi-factor identification', icon: Smartphone, action: 'Manage 2FA', color: 'slate' }
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
            <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all
              ${sec.color === 'emerald' ? 'bg-emerald-600 text-white hover:bg-slate-900 shadow-xl shadow-emerald-900/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}
              active:scale-95
            `}>
              {sec.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
