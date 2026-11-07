import ProfileInput from '../../../../../../packages/shared/src/components/ui/ProfileInput.jsx';
import Avatar from '../../../../../../packages/shared/src/components/ui/Avatar.jsx';
import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, Mail } from 'lucide-react';
import { FaEnvelope } from 'react-icons/fa';
import ImageUploader from '../../../../../../packages/shared/src/components/form/ImageUploader.jsx';

import OtpVerificationModal from "../../../../../../packages/shared/src/components/ui/OtpVerificationModal.jsx";
import ProfilePhotoModal from "../../../../../../packages/shared/src/components/ui/ProfilePhotoModal.jsx";

const ProfileSection = ({ 
  activeUser, 
  updateEmail, 
  updateUserProfile,
  sendEmailVerification, 
  verifyEmail,
  uploadProfilePicture,
  refreshUser,
  setSuccess,
  setError
}) => {
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(activeUser?.displayName || "");
  const [newEmail, setNewEmail] = useState(activeUser?.email || "");
  const [showProfileUpload, setShowProfileUpload] = useState(false); // Legacy, will remove usages
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Sync internal state when activeUser changes (e.g. after refreshUser)
  useEffect(() => {
    if (activeUser) {
      setDisplayName(activeUser.displayName || activeUser.name || "");
      setNewEmail(activeUser.email || "");
    }
  }, [activeUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      setSuccess("Intelligence synchronization initiated...");
      
      // Update both name and email using the unified updateUserProfile
      await updateUserProfile({
        displayName,
        email: newEmail
      });
      
      setSuccess("Personnel profile and verification status synchronized.");
    } catch (err) {
      setError(err.message || "System rejected profile update.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationCode = async () => {
    try {
      setError("");
      setSuccess("");
      await sendEmailVerification();
      if (activeUser.source === "mongodb") {
        setShowOtpModal(true);
        setSuccess("Verification code sent to your authorized email address.");
      } else {
        setSuccess("Verification email transmitted to your authorized frequency. Check your inbox.");
      }
    } catch (err) {
      setError(err.message || "Failed to transmit verification signal.");
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      setOtpLoading(true);
      await verifyEmail(activeUser.email, otp, activeUser.role);
      setSuccess("Email address verified successfully.");
      setShowOtpModal(false);
    } catch (err) {
      throw err; // Let modal handle display
    } finally {
      setOtpLoading(false);
    }
  };

  const handleProfilePhotoUpdate = async (file) => {
    try {
      setSuccess('Uploading profile assets to central intelligence...');
      await uploadProfilePicture(file);
      setSuccess('Intelligence asset profile picture updated.');
    } catch (err) {
      setError(err.message || 'Asset synchronization failed.');
      throw err; // Re-throw to show error in modal
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4 pb-5 border-b border-slate-50">
        <div className="relative group">
          <div className="w-16 h-16 shrink-0 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-semibold text-2xl shadow-sm ring-4 ring-emerald-50 group-hover:scale-105 transition-transform duration-500 overflow-hidden relative z-10">
            {activeUser?.photoURL ? (
              <Avatar src={activeUser.photoURL} name={activeUser?.displayName || activeUser?.name || "User"} />
            ) : (
              displayName?.charAt(0) || activeUser?.email?.charAt(0).toUpperCase()
            )}
          </div>
          <button 
            type="button"
            onClick={() => setIsPhotoModalOpen(true)}
            className="absolute -bottom-2 -right-2 p-3 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] border border-slate-100 text-emerald-600 hover:scale-110 transition-all z-20 hover:bg-emerald-50 active:scale-95"
          >
            <Camera size={16} />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900 tracking-tight">{activeUser?.displayName || 'User'}</h3>
          <div className="space-y-1">
            <p className="text-slate-500 font-medium break-all tracking-normal text-xs flex items-center gap-2 mt-1">
              <FaEnvelope className="text-emerald-500" /> {activeUser?.email}
            </p>
            <div className="text-xs font-semibold uppercase tracking-normal flex items-center gap-2">
              {activeUser?.emailVerified ? (
                <span className="text-emerald-600 flex items-center gap-1"><CheckCircle size={12} /> Email verified</span>
              ) : (
                <>
                  <span className="text-rose-500 flex items-center gap-1"><XCircle size={12} /> Unverified Email Address</span>
                  <button type="button" onClick={handleSendVerificationCode} className="text-emerald-600 hover:scale-105 transition-transform font-semibold">Verify Email</button>
                </>
              )}
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">
              Joined: {(activeUser?.createdAt || activeUser?.metadata?.creationTime) ? new Date(activeUser?.createdAt || activeUser?.metadata?.creationTime).toLocaleDateString() : 'Active Agent'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-normal text-slate-400 ml-4">Full name</label>
          <ProfileInput
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-normal text-slate-400 ml-4">Email address</label>
          <ProfileInput
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800"
          />
        </div>
        <div className="md:col-span-2 pt-4">
          <button type="submit" disabled={loading} className="btn-primary py-2.5 px-5 rounded-2xl font-semibold uppercase tracking-normal text-xs shadow-lg shadow-emerald-200">
            Save changes
          </button>
        </div>
      </form>
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhoto={activeUser?.photoURL}
        onUpload={handleProfilePhotoUpdate}
      />
      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={activeUser?.email}
        loading={otpLoading}
        onVerify={handleVerifyOtp}
        onResend={handleSendVerificationCode}
        mode="verification"
      />
    </div>
  );
};

export default ProfileSection;
