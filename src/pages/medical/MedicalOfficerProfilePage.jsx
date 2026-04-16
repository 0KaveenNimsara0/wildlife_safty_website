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
  Stethoscope,
  Phone,
  MapPin,
  FileText
} from 'lucide-react';

export default function MedicalOfficerProfilePage() {
  const [officerData, setOfficerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    licenseNumber: '',
    phoneNumber: '',
    hospital: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('medicalOfficerToken');
    const officer = localStorage.getItem('medicalOfficerData');

    if (!token || !officer) {
      navigate('/medical-officer/login');
      return;
    }

    const parsedOfficer = JSON.parse(officer);
    setOfficerData(parsedOfficer);
    setFormData({
      name: parsedOfficer.name || '',
      email: parsedOfficer.email || '',
      specialization: parsedOfficer.specialization || '',
      licenseNumber: parsedOfficer.licenseNumber || '',
      phoneNumber: parsedOfficer.phoneNumber || '',
      hospital: parsedOfficer.hospital || ''
    });
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('medicalOfficerToken');
    localStorage.removeItem('medicalOfficerData');
    navigate('/medical-officer/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: officerData?.name || '',
      email: officerData?.email || '',
      specialization: officerData?.specialization || '',
      licenseNumber: officerData?.licenseNumber || '',
      phoneNumber: officerData?.phoneNumber || '',
      hospital: officerData?.hospital || ''
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    // Validate form
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const token = localStorage.getItem('medicalOfficerToken');
      // In a real app, this would make an API call to update the profile
      // We'll simulate success and update localStorage
      const updatedOfficer = { ...officerData, ...formData };
      localStorage.setItem('medicalOfficerData', JSON.stringify(updatedOfficer));
      setOfficerData(updatedOfficer);
      setIsEditing(false);
      setSuccess('Personnel File updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
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
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 font-semibold uppercase tracking-widest text-[10px]">Loading Profile Metadata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header Hero */}
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-10 text-white shadow-xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
           <div className="relative group">
              <div className="w-28 h-28 rounded-3xl bg-indigo-600 border-4 border-slate-800 flex items-center justify-center text-3xl font-bold shadow-2xl overflow-hidden">
                 {officerData?.name?.charAt(0) || 'D'}
                 <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Edit3 size={20} className="text-white" />
                 </div>
              </div>
              <div className="absolute -bottom-1 -right-1 p-2 bg-indigo-500 rounded-lg border-2 border-slate-900 shadow-lg">
                 <Stethoscope size={14} className="text-white" />
              </div>
           </div>
           <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                 <h1 className="text-3xl font-bold tracking-tight">{officerData?.name || 'Medical Officer'}</h1>
                 <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Verified Personnel</span>
                 </div>
              </div>
              <p className="text-slate-400 font-medium tracking-wide text-sm mb-4">{officerData?.specialization || 'General Practice'}</p>
              
              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <FileText size={12} className="text-indigo-400" /> License: {officerData?.licenseNumber || 'PENDING'}
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <ShieldCheck size={12} className="text-indigo-400" /> Active Session
                 </div>
              </div>
           </div>
        </div>
      </div>

      {(error || success) && (
        <div className={`px-6 py-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 ${error ? 'bg-rose-50 border border-rose-100 text-rose-700' : 'bg-emerald-50 border border-emerald-100 text-emerald-700'}`}>
          <AlertCircle size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">{error || success}</span>
        </div>
      )}

      <div className="p-10 bg-white shadow-sm rounded-3xl border border-slate-100 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-1">Account Information</h3>
            <p className="text-xl font-bold text-slate-900 tracking-tight">Personnel Metadata</p>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-xl transition-all active:scale-95"
            >
              <Edit3 size={14} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <Save size={14} />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-xs font-bold text-slate-400 rounded-xl active:scale-95 transition-all"
              >
                <X size={14} />
                Discard
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Column 1 */}
          <div className="space-y-6">
            {[
              { label: 'Full Name', name: 'name', icon: User, val: formData.name },
              { label: 'Email Address', name: 'email', icon: Mail, val: formData.email, type: 'email' },
              { label: 'Contact Number', name: 'phoneNumber', icon: Phone, val: formData.phoneNumber, type: 'tel' }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
                  {field.label}
                </label>
                {isEditing ? (
                  <div className="relative group">
                     <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
                     <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={field.val}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center h-[54px] px-6 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <field.icon size={16} className="text-slate-300 mr-4" />
                    <span className="text-sm font-semibold text-slate-700">{field.val || '---'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            {[
              { label: 'Specialization', name: 'specialization', icon: Stethoscope, val: formData.specialization },
              { label: 'Medical License', name: 'licenseNumber', icon: FileText, val: formData.licenseNumber },
              { label: 'Primary Hospital', name: 'hospital', icon: MapPin, val: formData.hospital }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
                  {field.label}
                </label>
                {isEditing ? (
                  <div className="relative group">
                     <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
                     <input
                      type="text"
                      name={field.name}
                      value={field.val}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center h-[54px] px-6 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <field.icon size={16} className="text-slate-300 mr-4" />
                    <span className="text-sm font-semibold text-slate-700">{field.val || '---'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title: 'Security Cipher', sub: 'Update account password', icon: Key, action: 'Change Password', color: 'indigo' },
          { title: 'System Diagnostics', sub: 'Check connectivity status', icon: Smartphone, action: 'Run Check', color: 'slate' }
        ].map((sec, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-8 flex flex-col justify-between rounded-3xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-8">
               <div className={`p-4 rounded-2xl ${sec.color === 'indigo' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'} shadow-md group-hover:scale-105 transition-transform`}>
                  <sec.icon size={18} />
               </div>
               <div className="text-right">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">{sec.title}</h4>
                  <p className="text-sm font-bold text-slate-900 mt-1">{sec.sub}</p>
               </div>
            </div>
            <button className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all
              ${sec.color === 'indigo' ? 'bg-indigo-600 text-white hover:bg-slate-900 shadow-lg shadow-indigo-600/10' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}
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
