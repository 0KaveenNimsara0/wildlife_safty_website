import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, RefreshCw, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export default function OtpVerificationModal({ 
  isOpen, 
  onClose, 
  email, 
  onVerify, 
  onResend, 
  mode = 'register' 
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [attempts, setAttempts] = useState(3);
  const [errorText, setErrorText] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setErrorText('');
      setAttempts(3);
      setTimer(30);
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setErrorText('Digit count mismatch. 6-unit cipher required.');
      return;
    }

    try {
      setIsVerifying(true);
      setErrorText('');
      await onVerify(otpValue);
    } catch (err) {
      const remaining = attempts - 1;
      setAttempts(remaining);
      
      if (remaining <= 0) {
        setErrorText('SECURITY LOCKOUT: 3 failed attempts. Terminal session terminated.');
        setTimeout(() => {
          onClose();
          window.location.href = '/login';
        }, 2000);
      } else {
        setErrorText(`Validation failure. ${remaining} attempts authorized.`);
        setOtp(['', '', '', '', '', '']);
        inputRefs[0].current.focus();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-slide-up">
        {/* Progress Bar (Locked based on attempts) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex transition-all duration-500">
           <div className={`h-full transition-all duration-500 ${attempts === 3 ? 'w-1/3 bg-emerald-500' : attempts === 2 ? 'w-2/3 bg-amber-500' : 'w-full bg-rose-500'}`} />
        </div>

        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 text-slate-300 hover:text-slate-600 transition-all rounded-2xl hover:bg-slate-50"
        >
          <X size={20} />
        </button>

        <div className="p-10 text-center space-y-8">
          <div className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center border border-emerald-100 relative shadow-xl shadow-emerald-500/5">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-50" />
              <ShieldCheck className="text-emerald-600 relative z-10" size={48} />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Two-Factor <span className="text-emerald-600">Verification</span></h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-relaxed">
                Secure handshake sent to terminal <br />
                <span className="text-slate-900 px-3 py-1 bg-slate-50 rounded-xl inline-block mt-2 font-black lowercase tracking-widest">{email}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-6 gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={attempts <= 0}
                  className="w-full h-16 text-center text-3xl font-black text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:outline-none transition-all shadow-inner focus:shadow-emerald-500/10 placeholder:text-slate-200"
                  placeholder="•"
                />
              ))}
            </div>

            {errorText && (
              <div className="flex items-center justify-center gap-3 p-5 bg-rose-50 border border-rose-100 rounded-[1.5rem] text-rose-600 animate-shake">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  {errorText}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || attempts <= 0}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-600 shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-4 disabled:opacity-50 group active:scale-[0.98]"
            >
              {isVerifying ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  <span>Decrypting Cipher...</span>
                </>
              ) : (
                <>
                  <ShieldAlert size={20} />
                  <span>Verify Identity</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-6 border-t border-slate-50 flex flex-col items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Handshake not received?
            </p>
            <button
              onClick={() => {
                onResend();
                setTimer(30);
              }}
              disabled={timer > 0}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 hover:text-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-3 group"
            >
              <RefreshCw size={16} className={timer > 0 ? '' : 'group-hover:rotate-180 transition-transform duration-500'} />
              {timer > 0 ? `Retry authorized in ${timer}s` : 'Resend Verification Cipher'}
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="bg-slate-50 p-8 flex justify-center gap-8 items-center border-t border-slate-100">
           <div className="flex items-center gap-2 opacity-50">
              <ShieldCheck size={16} className="text-slate-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Protected by WildSafe Secure</span>
           </div>
           <div className="h-4 w-[1px] bg-slate-200" />
           <div className="flex items-center gap-2 opacity-50">
              <Info size={16} className="text-slate-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">2FA ENFORCED</span>
           </div>
        </div>
      </div>
    </div>
  );
}
