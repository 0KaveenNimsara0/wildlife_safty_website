import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ShieldAlert,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  Fingerprint,
} from "lucide-react";
import { BASE_URL } from "../../config/constants";
import OtpVerificationModal from "../../components/ui/OtpVerificationModal";

export default function ForgotPassword({ mode = "user" }) {
  const [step, setStep] = useState(1); // 1 = Email, 2 = New Password
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState(null);

  const navigate = useNavigate();

  // Dynamic configuration based on the user mode navigating here
  const config = {
    user: {
      title: "Member Password Reset",
      subtitle: "Wildlife Safety Network",
      backLink: "/login",
      accent: "emerald",
      bgGrad: "from-emerald-500/10",
    },
    admin: {
      title: "Admin Override Protocol",
      subtitle: "System Control Password Reset",
      backLink: "/admin/login",
      accent: "rose",
      bgGrad: "from-rose-500/10",
    },
    medicalOfficer: {
      title: "Medical Cipher Restructure",
      subtitle: "Verified Officer Secure Protocol",
      backLink: "/medical-officer/login",
      accent: "indigo",
      bgGrad: "from-indigo-500/10",
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

  const accentColorMap = {
    emerald:
      "text-emerald-400 border-emerald-500/20 shadow-emerald-500/10 focus:ring-emerald-500/10 focus:border-emerald-500/50 hover:bg-emerald-500 bg-emerald-600 shadow-emerald-900/40 text-emerald-500/60",
    rose: "text-rose-400 border-rose-500/20 shadow-rose-500/10 focus:ring-rose-500/10 focus:border-rose-500/50 hover:bg-rose-500 bg-rose-600 shadow-rose-900/40 text-rose-500/60",
    indigo:
      "text-indigo-400 border-indigo-500/20 shadow-indigo-500/10 focus:ring-indigo-500/10 focus:border-indigo-500/50 hover:bg-indigo-500 bg-indigo-600 shadow-indigo-900/40 text-indigo-500/60",
  };

  const aColor = config.accent;

  // Dynamic color classes based on the active mode mapped above
  const textColor = `text-${aColor}-400`;
  const bgAccent = `bg-${aColor}-600`;
  const hoverBgAccent = `hover:bg-${aColor}-500`;
  const focusRing = `focus:ring-${aColor}-500/10 focus:border-${aColor}-500/50`;
  const sectionBorderLabel = `text-${aColor}-500/60`;

  return (
    <div className="min-h-screen bg-[#0a0f18] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Immersive Background Elements */}
      <div
        className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl ${config.bgGrad} to-transparent rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse`}
      />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10 space-y-4 animate-fade-in">
          <div
            className={`inline-flex p-4 rounded-3xl bg-${aColor}-500/10 border border-${aColor}-500/20 shadow-2xl shadow-${aColor}-500/10 mb-2`}
          >
            {mode === "admin" ? (
              <ShieldAlert className={`h-10 w-10 ${textColor}`} />
            ) : (
              <KeyRound className={`h-10 w-10 ${textColor}`} />
            )}
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">
            {config.title.split(" ").map((word, i) =>
              i === config.title.split(" ").length - 1 ? (
                <span key={i} className={`text-${aColor}-500 not-italic`}>
                  {" "}
                  {word}
                </span>
              ) : (
                word + " "
              ),
            )}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full bg-${aColor}-500 animate-pulse`}
            />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              {config.subtitle}
            </p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden relative group">
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-24 -translate-y-full group-hover:translate-y-[500%] transition-transform duration-[3s] ease-linear pointer-events-none opacity-20" />

          <button
            onClick={() => navigate(config.backLink)}
            className={`absolute top-8 left-8 text-slate-500 hover:${textColor} transition-colors p-2 -ml-2 rounded-xl hover:bg-white/5`}
          >
            <ArrowLeft size={20} />
          </button>

          {error && (
            <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-4 rounded-2xl mb-8 mt-4 animate-shake">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {error}
              </span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendRequest} className="space-y-8 mt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Network Email ID
                </label>
                <div className="relative group/field">
                  <div
                    className={`absolute inset-y-0 left-5 flex items-center text-slate-500 group-focus-within/field:${textColor} transition-colors`}
                  >
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-14 pr-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-700 focus:outline-none focus:ring-4 ${focusRing} transition-all uppercase tracking-wide`}
                    placeholder={`USER@${mode === "user" ? "WILDSAFE" : mode.toUpperCase()}.NET`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-5 px-6 ${bgAccent} ${hoverBgAccent} text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-${aColor}-900/40 active:scale-[0.98] transition-all disabled:opacity-50 group/btn overflow-hidden relative`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Verifying System Record...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Fingerprint size={16} />
                    <span>Initiate Secure Protocol</span>
                  </div>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleUpdatePassword} className="space-y-8 mt-6">
              <div className="space-y-6">
                <p
                  className={`text-[10px] font-black uppercase tracking-widest ${sectionBorderLabel} pb-2 border-b border-white/5`}
                >
                  Secure Identity Verified
                </p>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    New Security Pass-Cipher
                  </label>
                  <div className="relative group/field">
                    <div
                      className={`absolute inset-y-0 left-5 flex items-center text-slate-500 group-focus-within/field:${textColor} transition-colors`}
                    >
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full pl-14 pr-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-700 focus:outline-none focus:ring-4 ${focusRing} transition-all uppercase tracking-[0.4em]`}
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Validate Pass-Cipher
                  </label>
                  <div className="relative group/field">
                    <div
                      className={`absolute inset-y-0 left-5 flex items-center text-slate-500 group-focus-within/field:${textColor} transition-colors`}
                    >
                      <KeyRound size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-14 pr-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-slate-700 focus:outline-none focus:ring-4 ${focusRing} transition-all uppercase tracking-[0.4em]`}
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-5 px-6 ${bgAccent} ${hoverBgAccent} text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-${aColor}-900/40 active:scale-[0.98] transition-all disabled:opacity-50 group/btn overflow-hidden relative`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Writing Security Key...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock size={16} />
                    <span>Deploy Structural Override</span>
                  </div>
                )}
              </button>
            </form>
          )}
        </div>
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
    </div>
  );
}
