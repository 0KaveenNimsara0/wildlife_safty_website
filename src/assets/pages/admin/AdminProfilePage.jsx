import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  LogOut,
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

export default function AdminProfilePage() {
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

    if (!token || !admin) {
      navigate('/admin/login');
      return;
    }

    const parsedAdmin = JSON.parse(admin);
    setAdminData(parsedAdmin);
    setFormData({
      name: parsedAdmin.name || '',
      email: parsedAdmin.email || '',
      role: parsedAdmin.role || 'Administrator'
    });
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

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
    // Validate form
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // In a real app, this would make an API call to update the profile
    // For now, just update localStorage and state
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Profile Header Hero */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
           <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] bg-emerald-600 border-4 border-slate-800 flex items-center justify-center text-4xl font-black shadow-2xl overflow-hidden">
                 {adminData?.name?.charAt(0) || 'A'}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Edit3 size={24} className="text-white" />
                 </div>
              </div>
              <div className="absolute -bottom-2 -right-2 p-2.5 bg-emerald-500 rounded-xl border-4 border-slate-900 shadow-lg">
                 <Shield size={16} className="text-white" />
              </div>
           </div>
           <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                 <h1 className="text-3xl font-black tracking-tight uppercase">{adminData?.name || 'Administrator'}</h1>
                 <div className="px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Master Authority</span>
                 </div>
              </div>
              <p className="text-slate-400 font-medium">{adminData?.email}</p>
              <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <Fingerprint size={14} className="text-emerald-500" /> ID: {adminData?.uid?.slice(0, 8) || 'ROOT_001'}
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <ShieldCheck size={14} className="text-emerald-500" /> LVL 4 ACCESS
                 </div>
              </div>
           </div>
        </div>
      </div>
        {(error || success) && (
          <div className={`mb-6 flex items-center px-4 py-3 rounded ${error ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'}`}>
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error || success}</span>
          </div>
        )}

        <div className="card-premium p-10 bg-white border-slate-100 overflow-hidden relative">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Account Credentials</h3>
              <p className="text-lg font-black text-slate-900 tracking-tight uppercase">Identity Configuration</p>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 rounded-2xl transition-all active:scale-95"
              >
                <Edit3 size={14} />
                Modify Intel
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                >
                  <Save size={14} />
                  Encrypt & Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-2xl active:scale-95 transition-all"
                >
                  <X size={14} />
                  Abort
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Profile Details */}
            <div className="space-y-6">
              {[
                { label: 'Tactical Name', name: 'name', icon: User, val: formData.name },
                { label: 'Uplink Email', name: 'email', icon: Mail, val: formData.email }
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                    {field.label}
                  </label>
                  {isEditing ? (
                    <div className="relative">
                       <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input
                        type={field.name === 'email' ? 'email' : 'text'}
                        name={field.name}
                        value={field.val}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm tracking-tight text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center h-[58px] px-6 bg-slate-50 border border-slate-100 rounded-2xl">
                      <field.icon size={18} className="text-slate-300 mr-4" />
                      <span className="text-sm font-black text-slate-900 tracking-tight uppercase">{field.val || 'NULL'}</span>
                    </div>
                  )}
                </div>
              ))}

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  System Rank
                </label>
                {isEditing ? (
                   <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm tracking-tight text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 appearance-none transition-all"
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Moderator">Moderator</option>
                      </select>
                   </div>
                ) : (
                  <div className="flex items-center h-[58px] px-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <Shield size={18} className="text-emerald-500 mr-4" />
                    <span className="text-sm font-black text-emerald-700 tracking-tight uppercase">{adminData?.role || 'Administrator'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Info */}
            <div className="space-y-6">
               {[
                 { label: 'Enrolled On', icon: Calendar, val: adminData?.createdAt ? new Date(adminData.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Jan 01, 2024' },
                 { label: 'Last Encryption', icon: Key, val: `${new Date().toLocaleDateString()} @ ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` }
               ].map((item, idx) => (
                 <div key={idx}>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                      {item.label}
                    </label>
                    <div className="flex items-center h-[58px] px-6 bg-slate-50 border border-slate-100 rounded-2xl">
                      <item.icon size={18} className="text-slate-300 mr-4" />
                      <span className="text-sm font-black text-slate-900 tracking-tight uppercase">{item.val}</span>
                    </div>
                 </div>
               ))}

               <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  Operational Status
                </label>
                <div className="flex items-center h-[58px] px-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-4 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                  <span className="text-sm font-black text-emerald-700 tracking-tight uppercase italic">FULLY OPERATIONAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Security Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[
          { title: 'Access Cipher', sub: 'Update security credentials', icon: Key, action: 'Rotate Password', color: 'emerald' },
          { title: 'Auth Relay', sub: 'Multi-factor identification', icon: Smartphone, action: 'Enable MFA', color: 'slate' }
        ].map((sec, idx) => (
          <div key={idx} className="card-premium p-8 bg-white border-slate-100 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-8">
               <div className={`p-4 rounded-2xl bg-${sec.color}-900 text-${sec.color === 'emerald' ? 'emerald-500' : 'slate-200'}`}>
                  <sec.icon size={20} />
               </div>
               <div className="text-right">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{sec.title}</h4>
                  <p className="text-xs font-black text-slate-900 tracking-tight uppercase mt-1">{sec.sub}</p>
               </div>
            </div>
            <button className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all
              ${sec.color === 'emerald' ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
            `}>
              {sec.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
