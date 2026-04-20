import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope, AlertCircle, Mail, FileText, Phone, MapPin, Lock, UserPlus, User, Fingerprint, Info, CheckCircle, ArrowRight, Hospital, Eye, EyeOff } from 'lucide-react';
import { BASE_URL } from '../../config/constants';
import OtpVerificationModal from '../../components/ui/OtpVerificationModal';
import AuthLayout from '../../components/auth/AuthLayout';

export default function MedicalOfficerRegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    specialization: '',
    licenseNumber: '',
    phoneNumber: '',
    hospital: '',
    securityKey: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      setError('Passwords do not match');
      return;
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
          hospital: formData.hospital,
          otp: otpValue,
          securityKey: formData.securityKey
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registry Enrollment Failed');
      }

      localStorage.setItem('medicalOfficerToken', data.token);
      localStorage.setItem('medicalOfficerData', JSON.stringify(data.medicalOfficer));

      setShowOtp(false);
      navigate('/medical-officer/dashboard');
    } catch (error) {
      setError(error.message || 'System Enrollment Protocol Failure');
      console.error('Medical officer registration error:', error);
      setShowOtp(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Enroll" 
      subtitle="Officer" 
      quote="Medicine is a science of uncertainty and an art of probability."
      author="William Osler"
      role="medicalOfficer"
    >
      <div className="space-y-8 animate-fade-in-up">
        {error && (
          <div className="flex items-start gap-4 p-5 bg-rose-50 border border-rose-100 rounded-3xl text-rose-700 animate-shake">
            <Info className="flex-shrink-0 mt-0.5" size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
              {error}
            </span>
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSendOtp}>
          <div className="space-y-6">
            {/* Personnel Core Data */}
            <div className="space-y-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 pb-2 border-b border-slate-100 ml-5">Core Identification</p>
              
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5"
                    placeholder="DR. NAME"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                  Registration Key
                </label>
                <div className="relative">
                  <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    name="securityKey"
                    type="password"
                    required
                    value={formData.securityKey}
                    onChange={handleChange}
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5"
                    placeholder="ENTER AUTHORIZATION KEY"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5"
                    placeholder="OFFICER@MED.LINK"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-14 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5 tracking-[0.2em]"
                      placeholder="••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <CheckCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-14 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5 tracking-[0.2em]"
                      placeholder="••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Credentials */}
            <div className="space-y-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 pb-2 border-b border-slate-100 ml-5">Professional Details</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                    Specialization
                  </label>
                  <div className="relative">
                    <Stethoscope className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <select
                      name="specialization"
                      required
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                    >
                      <option value="">Select Dept</option>
                      <option value="general">General Medicine</option>
                      <option value="toxicology">Toxicology Hub</option>
                      <option value="emergency">Emergency Ops</option>
                      <option value="wildlife_medicine">Wildlife Research</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                    License ID
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input
                      name="licenseNumber"
                      type="text"
                      required
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                      placeholder="LIC-0000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                  Operational Facility
                </label>
                <div className="relative">
                  <Hospital className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    name="hospital"
                    type="text"
                    required
                    value={formData.hospital}
                    onChange={handleChange}
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5"
                    placeholder="BASE STATION / CLINIC"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                  Contact Protocol
                </label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    name="phoneNumber"
                    type="text"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5"
                    placeholder="+1 000 000 000"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={otpSending || loading}
            className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-600 shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-4 group active:scale-[0.98] disabled:opacity-50"
          >
            {otpSending ? 'Sending OTP...' : 'Register'}
            {!otpSending && <Fingerprint size={18} className="group-hover:scale-110 transition-transform duration-500" />}
          </button>
        </form>

        <div className="pt-4 text-center">
          <p className="text-slate-400 font-bold text-sm">
            Personnel already Operational? {' '}
            <Link to="/medical-officer/login" className="text-emerald-600 font-black uppercase tracking-[0.2em] hover:text-emerald-700 underline underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-500 transition-all text-xs">
              Access Terminal
            </Link>
          </p>
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
    </AuthLayout>
  );
}
