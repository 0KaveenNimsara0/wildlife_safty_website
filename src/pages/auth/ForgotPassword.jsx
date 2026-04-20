import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowLeft,
  KeyRound,
  Info,
  Fingerprint,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { BASE_URL } from "../../config/constants";
import OtpVerificationModal from "../../components/ui/OtpVerificationModal";
import AuthLayout from "../../components/auth/AuthLayout";

export default function ForgotPassword({ mode = "user" }) {
  const [step, setStep] = useState(1); // 1 = Email, 2 = New Password
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Dynamic configuration based on the user mode navigating here
  const config = {
    user: {
      title: "Member",
      subtitle: "Recovery",
      backLink: "/login",
      roleId: "user",
      quote: "The best way to predict the future is to create it.",
      author: "Peter Drucker"
    },
    admin: {
      title: "Admin",
      subtitle: "Override",
      backLink: "/admin/login",
      roleId: "admin",
      quote: "Management is doing things right; leadership is doing the right things.",
      author: "Peter Drucker"
    },
    medicalOfficer: {
      title: "Officer",
      subtitle: "Cipher",
      backLink: "/medical-officer/login",
      roleId: "medicalOfficer",
      quote: "Medicine is a science of uncertainty and an art of probability.",
      author: "William Osler"
    },
  }[mode];

  const handleSendRequest = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      setError("Network Email ID is required");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/shared-auth/forgot-password/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, role: mode }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Identity verification failed.");
      }

      setShowOtp(true);
    } catch (err) {
      console.error("Password Reset OTP Error:", err);
      setError(
        err.message ||
          "System failed to verify identity. Please contact support.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerified = async (otpValue) => {
    try {
      const response = await fetch(`${BASE_URL}/shared-auth/forgot-password/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid validation code');
      }

      setVerifiedOtp(otpValue);
      setShowOtp(false);
      setStep(2); // Proceed to the new password setup interface
    } catch (err) {
      // Re-throw to be caught by the Modal's internal attempt handler
      throw err;
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Security pass-ciphers do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Cipher complexity must exceed 6 alphanumeric units.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/shared-auth/forgot-password/reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            role: mode,
            otp: verifiedOtp,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password structural update failed.");
      }

      // Success, route back to corresponding login terminal
      navigate(config.backLink, {
        state: { message: "Security Key Updated Successfully. Please Login." },
      });
    } catch (err) {
      console.error("Password Update Error:", err);
      setError(err.message || "System error during structural cipher update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={config.title} 
      subtitle={config.subtitle} 
      quote={config.quote}
      author={config.author}
      role={config.roleId}
    >
      <div className="space-y-8 animate-fade-in-up">
        <button
          onClick={() => navigate(config.backLink)}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Terminal
        </button>

        {error && (
          <div className="flex items-start gap-4 p-5 bg-rose-50 border border-rose-100 rounded-3xl text-rose-700 animate-shake">
            <Info className="flex-shrink-0 mt-0.5" size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
              {error}
            </span>
          </div>
        )}

        {step === 1 ? (
          <form className="space-y-8" onSubmit={handleSendRequest}>
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                Authorized Email ID
              </label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5"
                  placeholder="agent@wildsafe.gov"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-600 shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-4 group active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Transmitting OTP...' : 'Initiate Recovery Protocol'}
              {!loading && <Fingerprint size={18} className="group-hover:scale-110 transition-transform duration-500" />}
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleUpdatePassword}>
            <div className="space-y-5">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                  New Security Pass-Cipher
                </label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-16 pr-14 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5 tracking-[0.3em]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-5 group-focus-within:text-emerald-600 transition-colors">
                  Validate Pass-Cipher
                </label>
                <div className="relative group">
                  <CheckCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-16 pr-14 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/30 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-focus-within:shadow-emerald-500/5 tracking-[0.3em]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-700 shadow-2xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-4 group active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Deploying Changes...' : 'Deploy Structural Override'}
              {!loading && <KeyRound size={18} className="group-hover:rotate-12 transition-transform duration-500" />}
            </button>
          </form>
        )}
      </div>

      <OtpVerificationModal
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        email={email}
        loading={false}
        onVerify={handleOtpVerified}
        onResend={handleSendRequest}
        mode="reset-password"
      />
    </AuthLayout>
  );
}
