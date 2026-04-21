import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config/constants';
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
  FileText,
  Lock,
  RefreshCw,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { createPortal } from 'react-dom';

export default function MedicalProfileSection() {
  const [officerData, setOfficerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityStep, setSecurityStep] = useState(1); // 1: Request OTP, 2: Perform Change
  const [securityLoading, setSecurityLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    licenseNumber: '',
    phoneNumber: '',
    hospital: ''
  });

  const [securityFormData, setSecurityFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    otp: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${BASE_URL}/medical-officer/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const profile = data.medicalOfficer;
        setOfficerData(profile);
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          specialization: profile.specialization || '',
          licenseNumber: profile.licenseNumber || '',
          phoneNumber: profile.phoneNumber || '',
          hospital: profile.hospital || ''
        });
        // Sync localStorage
        localStorage.setItem('medicalOfficerData', JSON.stringify(profile));
      } else {
        setError('Session expired or identity rejected.');
      }
    } catch (err) {
      setError('Communication failure with Medical Terminal');
    } finally {
      setLoading(false);
    }
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
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${BASE_URL}/medical-officer/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          hospital: formData.hospital
        })
      });

      const data = await response.json();
      if (data.success) {
        setOfficerData(data.medicalOfficer);
        localStorage.setItem('medicalOfficerData', JSON.stringify(data.medicalOfficer));
        setIsEditing(false);
        setSuccess('Personnel File updated and synchronized successfully');
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(data.message || 'Update failed');
      }
    } catch (err) {
      setError('Failed to transmit profile updates');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --- Password Change Logic ---
  const handleRequestOtp = async () => {
    try {
      setSecurityLoading(true);
      setError('');
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${BASE_URL}/medical-officer/auth/change-password-otp`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setSecurityStep(2);
      } else {
        setError(data.message || 'OTP dispatch failed');
      }
    } catch (err) {
      setError('Network shielding error');
    } finally {
      setSecurityLoading(false);
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (securityFormData.newPassword !== securityFormData.confirmPassword) {
      setError('Confirmation password mismatch');
      return;
    }
    if (securityFormData.otp.length !== 6) {
      setError('Valid 6-digit security code required');
      return;
    }

    try {
      setSecurityLoading(true);
      setError('');
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${BASE_URL}/medical-officer/auth/change-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          currentPassword: securityFormData.currentPassword,
          newPassword: securityFormData.newPassword,
          otp: securityFormData.otp
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowSecurityModal(false);
        setSuccess('Credentials updated. System security log registered.');
        setTimeout(() => setSuccess(''), 5000);
        setSecurityFormData({ currentPassword: '', newPassword: '', confirmPassword: '', otp: '' });
        setSecurityStep(1);
      } else {
        setError(data.message || 'Identity verification failed');
      }
    } catch (err) {
      setError('Communication protocol disrupted');
    } finally {
      setSecurityLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 font-black uppercase tracking-widest text-[10px]">Verifying Personnel Record...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Profile Header Hero */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
           <div className="relative group">
              <div className="w-32 h-32 rounded-[32px] bg-indigo-600 border-4 border-slate-800 flex items-center justify-center text-4xl font-black shadow-2xl overflow-hidden shadow-indigo-600/20">
                 {officerData?.name?.charAt(0).toUpperCase() || 'D'}
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
                    <ShieldCheck size={14} className="text-emerald-400" /> Operational Status: <span className="text-emerald-400 uppercase">{officerData?.isApproved ? 'ACTIVE' : 'PENDING'}</span>
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
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600 mb-2">Personnel Management</h3>
            <p className="text-2xl font-black text-slate-900 tracking-tight uppercase">Profile Data <span className="text-slate-200">/</span> Identification</p>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-3 px-8 py-4 bg-slate-900 border border-slate-900 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-600 hover:border-indigo-600 rounded-2xl shadow-xl shadow-slate-900/10 transition-all active:scale-95"
            >
              <Edit3 size={16} />
              Edit Personnel File
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
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
          <div className="space-y-8">
            {[
              { label: 'Display Name', name: 'name', icon: User, val: formData.name },
              { label: 'Professional Email (Read-Only)', name: 'email', icon: Mail, val: formData.email, type: 'email', readOnly: true },
              { label: 'Phone Number', name: 'phoneNumber', icon: Phone, val: formData.phoneNumber, type: 'tel' }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">
                  {field.label}
                </label>
                {isEditing && !field.readOnly ? (
                  <div className="relative group">
                     <field.icon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                     <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={field.val}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[20px] font-black text-xs uppercase tracking-widest text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner"
                    />
                  </div>
                ) : (
                  <div className={`flex items-center h-[64px] px-8 border rounded-[20px] shadow-sm ${field.readOnly ? 'bg-slate-100/50 border-slate-100 opacity-60' : 'bg-slate-50/50 border-slate-50'}`}>
                    <field.icon size={18} className="text-slate-300 mr-5" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{field.val || '---'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-8">
            {[
              { label: 'Medical Specialization (Read-Only)', name: 'specialization', icon: Stethoscope, val: formData.specialization, readOnly: true },
              { label: 'State License Number (Read-Only)', name: 'licenseNumber', icon: FileText, val: formData.licenseNumber, readOnly: true },
              { label: 'Hospital Affiliation', name: 'hospital', icon: MapPin, val: formData.hospital }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">
                  {field.label}
                </label>
                {isEditing && !field.readOnly ? (
                  <div className="relative group">
                     <field.icon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                     <input
                      type="text"
                      name={field.name}
                      value={field.val}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[20px] font-black text-xs uppercase tracking-widest text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner"
                    />
                  </div>
                ) : (
                  <div className={`flex items-center h-[64px] px-8 border rounded-[20px] shadow-sm ${field.readOnly ? 'bg-slate-100/50 border-slate-100 opacity-60' : 'bg-slate-50/50 border-slate-50'}`}>
                    <field.icon size={18} className="text-slate-300 mr-5" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{field.val || '---'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Operations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-100 p-10 flex flex-col justify-between rounded-[40px] shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all group">
          <div className="flex items-start justify-between mb-10">
             <div className="p-5 rounded-[24px] bg-indigo-600 text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                <Shield size={24} />
             </div>
             <div className="text-right">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-1">Account Security</h4>
                <p className="text-lg font-black text-slate-900 uppercase tracking-tight">Security Credentials Update</p>
             </div>
          </div>
          <button 
            onClick={() => setShowSecurityModal(true)}
            className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-indigo-600/20 hover:bg-slate-900 transition-all active:scale-95"
          >
            Update Password
          </button>
        </div>

        <div className="bg-white border border-slate-100 p-10 flex flex-col justify-between rounded-[40px] shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all group opacity-50">
          <div className="flex items-start justify-between mb-10">
             <div className="p-5 rounded-[24px] bg-slate-900 text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                <Lock size={24} />
             </div>
             <div className="text-right">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-1">System Status</h4>
                <p className="text-lg font-black text-slate-900 uppercase tracking-tight">Operational Heartbeat</p>
             </div>
          </div>
          <button className="w-full py-5 rounded-2xl bg-slate-50 text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] cursor-not-allowed">
            System Synced
          </button>
        </div>
      </div>

      {/* Security Verification Modal */}
      {showSecurityModal && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-fade-in" onClick={() => !securityLoading && setShowSecurityModal(false)} />
           
           {/* Modal Body */}
           <div className="relative w-full max-w-lg bg-white rounded-[48px] shadow-2xl overflow-hidden animate-slide-up border border-slate-100">
              <div className="absolute top-0 left-0 right-0 h-2 bg-slate-50 flex">
                 <div className={`h-full bg-indigo-600 transition-all duration-700 ${securityStep === 1 ? 'w-1/2' : 'w-full'}`} />
              </div>

              <div className="p-10 pt-16 text-center space-y-8">
                 <div className="space-y-4">
                    <div className={`mx-auto w-24 h-24 rounded-[32px] flex items-center justify-center transition-all duration-500 ${securityStep === 1 ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600 rotate-[360deg]'}`}>
                       {securityStep === 1 ? <Smartphone size={48} /> : <ShieldCheck size={48} />}
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                          {securityStep === 1 ? 'Identity' : 'Security'} <span className="text-indigo-600">Verification</span>
                       </h2>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {securityStep === 1 ? 'Request a one-time code to authorized email' : 'Verify credentials and apply new security layer'}
                       </p>
                    </div>
                 </div>

                 {securityStep === 1 ? (
                   <div className="space-y-8 py-4">
                      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-left">
                         <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                            For professional protection, password updates require a single-use code sent to: <br/>
                            <span className="text-slate-900 font-black not-italic mt-2 inline-block lowercase tracking-widest text-sm">{officerData?.email}</span>
                         </p>
                      </div>
                      <button 
                         onClick={handleRequestOtp}
                         disabled={securityLoading}
                         className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-slate-900 shadow-2xl shadow-indigo-600/10 transition-all flex items-center justify-center gap-4 group"
                      >
                         {securityLoading ? <RefreshCw className="animate-spin" size={18} /> : <Mail size={18} className="group-hover:translate-x-1 transition-transform" /> }
                         <span>Dispatch Security Code</span>
                      </button>
                   </div>
                 ) : (
                   <form onSubmit={handlePasswordChangeSubmit} className="space-y-6 text-left">
                      <div className="space-y-4">
                         <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-4">Current Verified Password</label>
                            <div className="relative">
                               <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                               <input 
                                  required
                                  type="password"
                                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-bold text-sm"
                                  placeholder="Confirm Identity"
                                  value={securityFormData.currentPassword}
                                  onChange={(e) => setSecurityFormData({...securityFormData, currentPassword: e.target.value})}
                               />
                            </div>
                         </div>
                         <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-4">New Security Protocol (Password)</label>
                            <div className="relative">
                               <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                               <input 
                                  required
                                  type="password"
                                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-emerald-500 focus:outline-none transition-all font-bold text-sm"
                                  placeholder="Minimum 6 Characters"
                                  value={securityFormData.newPassword}
                                  onChange={(e) => setSecurityFormData({...securityFormData, newPassword: e.target.value})}
                               />
                            </div>
                         </div>
                         <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-4">Confirm New Security Protocol</label>
                            <div className="relative">
                               <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                               <input 
                                  required
                                  type="password"
                                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-bold text-sm"
                                  placeholder="Repeat New Password"
                                  value={securityFormData.confirmPassword}
                                  onChange={(e) => setSecurityFormData({...securityFormData, confirmPassword: e.target.value})}
                               />
                            </div>
                         </div>
                         <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-4">6-Digit Security Code</label>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="relative col-span-2">
                                  <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                  <input 
                                     required
                                     maxLength={6}
                                     type="text"
                                     className="w-full pl-14 pr-6 py-5 bg-indigo-50/50 border-2 border-indigo-100 rounded-3xl focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-black text-center tracking-[0.5em] text-lg text-indigo-600"
                                     placeholder="000000"
                                     value={securityFormData.otp}
                                     onChange={(e) => setSecurityFormData({...securityFormData, otp: e.target.value})}
                                  />
                               </div>
                            </div>
                         </div>
                      </div>

                      {error && (
                         <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
                            <AlertCircle size={16} /> {error}
                         </div>
                      )}

                      <div className="pt-4 flex gap-4">
                         <button 
                            type="button"
                            onClick={() => setSecurityStep(1)}
                            className="p-5 bg-slate-50 text-slate-400 rounded-3xl hover:bg-slate-100 transition-all"
                         >
                            <ArrowLeft size={20} />
                         </button>
                         <button 
                            type="submit"
                            disabled={securityLoading}
                            className="flex-1 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-indigo-600 shadow-2xl transition-all flex items-center justify-center gap-4"
                         >
                            {securityLoading ? <RefreshCw className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                            <span>Apply Changes</span>
                         </button>
                      </div>
                   </form>
                 )}
              </div>

              <div className="bg-slate-50 p-8 flex justify-between items-center border-t border-slate-100 mt-4">
                 <button onClick={() => !securityLoading && setShowSecurityModal(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">Abort Security Check</button>
                 <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                 </div>
              </div>
           </div>
        </div>,
        document.body
      )}
    </div>
  );
}
