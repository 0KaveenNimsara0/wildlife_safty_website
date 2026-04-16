import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, AlertCircle, Mail, FileText, Phone, MapPin, Lock, UserPlus, User, Fingerprint } from 'lucide-react';
import { BASE_URL } from '../../config/constants';

export default function MedicalOfficerRegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    specialization: '',
    licenseNumber: '',
    phoneNumber: '',
    hospital: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Cipher mismatch detected');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const response = await fetch(`${BASE_URL}/medical-officer/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          specialization: formData.specialization,
          licenseNumber: formData.licenseNumber,
          phoneNumber: formData.phoneNumber,
          hospital: formData.hospital
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registry Enrollment Failed');
      }

      localStorage.setItem('medicalOfficerToken', data.token);
      localStorage.setItem('medicalOfficerData', JSON.stringify(data.medicalOfficer));

      navigate('/medical-officer/dashboard');
    } catch (error) {
      setError(error.message || 'System Enrollment Protocol Failure');
      console.error('Medical officer registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] flex items-center justify-center p-6 lg:p-12 relative overflow-hidden font-sans">
      {/* Immersive Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] -ml-64 -mb-64" />
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-10 space-y-4 animate-fade-in">
          <div className="inline-flex p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10 mb-2">
            <UserPlus className="h-10 w-10 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
            Personnel <span className="text-indigo-500 not-italic">Registry</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Official Enrollment Protocol</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 lg:p-14 rounded-[3rem] shadow-2xl shadow-black/50 overflow-hidden relative group">
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-24 -translate-y-full group-hover:translate-y-[500%] transition-transform duration-[4s] ease-linear pointer-events-none opacity-20" />
          
          {error && (
            <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-4 rounded-2xl mb-8 animate-shake">
              <AlertCircle size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Personnel Core Data */}
               <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500/60 pb-2 border-b border-white/5">Core Identification</p>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Name</label>
                    <div className="relative group/field">
                      <div className="absolute inset-y-0 left-5 flex items-center text-slate-600 group-focus-within/field:text-indigo-400 transition-colors">
                        <User size={18} />
                      </div>
                      <input
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all uppercase tracking-wide"
                        placeholder="DR. NAME"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Med-Link Email</label>
                    <div className="relative group/field">
                      <div className="absolute inset-y-0 left-5 flex items-center text-slate-600 group-focus-within/field:text-indigo-400 transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all uppercase tracking-wide"
                        placeholder="OFFICER@MED.LINK"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cipher</label>
                        <input
                          name="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all uppercase tracking-[0.2em]"
                          placeholder="••••"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Verify</label>
                        <input
                          name="confirmPassword"
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full px-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all uppercase tracking-[0.2em]"
                          placeholder="••••"
                        />
                     </div>
                  </div>
               </div>

               {/* Professional Credentials */}
               <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500/60 pb-2 border-b border-white/5">Professional Credentials</p>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Specialization Unit</label>
                    <select
                      name="specialization"
                      required
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all uppercase appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-900">Select Department</option>
                      <option value="general" className="bg-slate-900">General Medicine</option>
                      <option value="toxicology" className="bg-slate-900">Toxicology Hub</option>
                      <option value="emergency" className="bg-slate-900">Emergency Ops</option>
                      <option value="wildlife_medicine" className="bg-slate-900">Wildlife Research</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">License Vector ID</label>
                    <div className="relative group/field">
                      <div className="absolute inset-y-0 left-5 flex items-center text-slate-600 group-focus-within/field:text-indigo-400 transition-colors">
                        <FileText size={18} />
                      </div>
                      <input
                        name="licenseNumber"
                        type="text"
                        required
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all uppercase tracking-wide"
                        placeholder="LIC-0000-X"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operational Facility</label>
                    <div className="relative group/field">
                      <div className="absolute inset-y-0 left-5 flex items-center text-slate-600 group-focus-within/field:text-indigo-400 transition-colors">
                        <MapPin size={18} />
                      </div>
                      <input
                        name="hospital"
                        type="text"
                        required
                        value={formData.hospital}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all uppercase tracking-wide"
                        placeholder="BASE STATION / CLINIC"
                      />
                    </div>
                  </div>
               </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-6 px-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-900/40 active:scale-[0.98] transition-all disabled:opacity-50 group/btn overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              {loading ? (
                 <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Processing Enrollment...</span>
                 </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Fingerprint size={20} />
                  <span>Execute Personnel Enrollment</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Officer already active in system?{' '}
              <button
                onClick={() => navigate('/medical-officer/login')}
                className="text-indigo-400 hover:text-indigo-300 transition-colors ml-2 underline underline-offset-4"
              >
                Access Terminal
              </button>
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
           <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] animate-pulse">Classified Information Access Required</p>
        </div>
      </div>
    </div>
  );
}
