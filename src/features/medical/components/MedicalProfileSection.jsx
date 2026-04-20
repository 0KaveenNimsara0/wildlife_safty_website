import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  User,
  Mail,
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

export default function MedicalProfileSection() {
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

    if (token && officer) {
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
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
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
      <div className="py-20 flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 font-black uppercase tracking-widest text-[10px]">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile Header Hero */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
           <div className="relative group">
              <div className="w-32 h-32 rounded-[32px] bg-indigo-600 border-4 border-slate-800 flex items-center justify-center text-4xl font-black shadow-2xl overflow-hidden shadow-indigo-600/20">
                 {officerData?.name?.charAt(0).toUpperCase() || 'D'}
                 <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Edit3 size={24} className="text-white" />
                 </div>
              </div>
              <div className="absolute -bottom-2 -right-2 p-2.5 bg-indigo-500 rounded-2xl border-4 border-slate-900 shadow-lg">
                 <Stethoscope size={16} className="text-white" />
              </div>
           </div>
           <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                 <h1 className="text-4xl font-black tracking-tight text-white uppercase">{officerData?.name || 'Medical Officer'}</h1>
                 <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Verified Member</span>
                 </div>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-[0.15em] text-sm mb-6 underline decoration-slate-800 underline-offset-8">{officerData?.specialization || 'General Practice Specialist'}</p>
              
              <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                 <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <FileText size={14} className="text-indigo-400" /> License: <span className="text-white">{officerData?.licenseNumber || 'Pending'}</span>
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <ShieldCheck size={14} className="text-emerald-400" /> Operational Status: <span className="text-emerald-400">ACTIVE</span>
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

      <div className="p-10 bg-white shadow-2xl shadow-slate-200/50 rounded-[40px] border border-slate-100 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600 mb-2">Account Administration</h3>
            <p className="text-2xl font-black text-slate-900 tracking-tight uppercase">Personnel Profile <span className="text-slate-200">/</span> Summary</p>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-3 px-8 py-4 bg-slate-900 border border-slate-900 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-600 hover:border-indigo-600 rounded-2xl shadow-xl shadow-slate-900/10 transition-all active:scale-95 transition-all"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <Save size={16} />
                Save Profile
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
          <div className="space-y-8">
            {[
              { label: 'Full Name', name: 'name', icon: User, val: formData.name },
              { label: 'Email Address', name: 'email', icon: Mail, val: formData.email, type: 'email' },
              { label: 'Phone Number', name: 'phoneNumber', icon: Phone, val: formData.phoneNumber, type: 'tel' }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">
                  {field.label}
                </label>
                {isEditing ? (
                  <div className="relative group">
                     <field.icon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                     <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={field.val}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-[20px] font-black text-xs uppercase tracking-widest text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner"
                    />
                  </div>
                ) : (
                  <div className="flex items-center h-[64px] px-8 bg-slate-50/50 border border-slate-50 rounded-[20px] shadow-sm">
                    <field.icon size={18} className="text-slate-300 mr-5" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{field.val || 'NULL_NODE'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-8">
            {[
              { label: 'Specialization', name: 'specialization', icon: Stethoscope, val: formData.specialization },
              { label: 'License Number', name: 'licenseNumber', icon: FileText, val: formData.licenseNumber },
              { label: 'Hospital / Clinic', name: 'hospital', icon: MapPin, val: formData.hospital }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">
                  {field.label}
                </label>
                {isEditing ? (
                  <div className="relative group">
                     <field.icon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                     <input
                      type="text"
                      name={field.name}
                      value={field.val}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-[20px] font-black text-xs uppercase tracking-widest text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner"
                    />
                  </div>
                ) : (
                  <div className="flex items-center h-[64px] px-8 bg-slate-50/50 border border-slate-50 rounded-[20px] shadow-sm">
                    <field.icon size={18} className="text-slate-300 mr-5" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{field.val || 'UNASSIGNED'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[
          { title: 'Security Settings', sub: 'Update account password', icon: Key, action: 'Update Password', color: 'indigo' },
          { title: 'System Status', sub: 'Audit connection stability', icon: Smartphone, action: 'Check Sync', color: 'slate' }
        ].map((sec, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-10 flex flex-col justify-between rounded-[40px] shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all group">
            <div className="flex items-start justify-between mb-10">
               <div className={`p-5 rounded-[24px] ${sec.color === 'indigo' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'} shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                  <sec.icon size={24} />
               </div>
               <div className="text-right">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-1">{sec.title}</h4>
                  <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{sec.sub}</p>
               </div>
            </div>
            <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all
              ${sec.color === 'indigo' ? 'bg-indigo-600 text-white hover:bg-slate-900 shadow-xl shadow-indigo-600/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}
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
