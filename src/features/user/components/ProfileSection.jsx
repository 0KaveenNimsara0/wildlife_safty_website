import React, { useState } from 'react';
import { Camera, CheckCircle, XCircle, Mail } from 'lucide-react';
import { FaEnvelope } from 'react-icons/fa';
import ImageUploader from '../../../components/form/ImageUploader';

const ProfileSection = ({ 
  currentUser, 
  updateEmail, 
  sendEmailVerification, 
  uploadProfilePicture,
  setSuccess,
  setError
}) => {
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [newEmail, setNewEmail] = useState(currentUser?.email || '');
  const [showProfileUpload, setShowProfileUpload] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      if (newEmail !== currentUser.email) {
        await updateEmail(newEmail);
      }
      setSuccess('Personnel profile updated successfully.');
    } catch (err) {
      setError(err.message || 'System rejected profile update.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setError('');
      setSuccess('');
      await sendEmailVerification();
      setSuccess('Verification email transmitted to your authorized frequency. Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to transmit verification signal.');
    }
  };

  const handleProfilePhotoUpdate = async (file, previewUrl) => {
    try {
      setError('');
      setSuccess('');
      setSuccess('Uploading profile assets to central intelligence...');
      const photoURL = await uploadProfilePicture(file);
      setSuccess('Intelligence asset profile picture updated.');
      setShowProfileUpload(false);
      // We might need a better way to refresh the parent than window.location.reload()
      // but keeping consistency with existing logic for now.
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err.message || 'Asset synchronization failed.');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-8 pb-10 border-b border-slate-50">
        <div className="relative group">
          {showProfileUpload ? (
            <div className="w-24 h-24 rounded-[2rem] overflow-hidden">
              <ImageUploader 
                currentPhoto={currentUser?.photoURL}
                onPhotoChange={handleProfilePhotoUpdate}
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-[2rem] bg-emerald-600 flex items-center justify-center text-white font-black text-4xl shadow-xl ring-8 ring-emerald-50 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile Asset" className="w-full h-full object-cover" />
              ) : (
                displayName?.charAt(0) || currentUser?.email?.charAt(0).toUpperCase()
              )}
            </div>
          )}
          {!showProfileUpload && (
            <button 
              onClick={() => setShowProfileUpload(true)}
              className="absolute -bottom-2 -right-2 p-3 bg-white rounded-xl shadow-lg border border-slate-100 text-emerald-600 hover:scale-110 transition-transform"
            >
              <Camera size={16} />
            </button>
          )}
        </div>
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{displayName || 'Agent Unnamed'}</h3>
          <div className="space-y-1">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mt-1">
              <FaEnvelope className="text-emerald-500" /> {currentUser?.email}
            </p>
            <div className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              {currentUser?.emailVerified ? (
                <span className="text-emerald-600 flex items-center gap-1"><CheckCircle size={12} /> Verified Protocol</span>
              ) : (
                <>
                  <span className="text-rose-500 flex items-center gap-1"><XCircle size={12} /> Unverified Frequency</span>
                  <button onClick={handleVerifyEmail} className="text-emerald-600 hover:underline">Verify Frequency</button>
                </>
              )}
            </div>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">Enlisted: {new Date(currentUser?.metadata?.creationTime).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Codename</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Authorized Email Address</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800"
          />
        </div>
        <div className="md:col-span-2 pt-4">
          <button type="submit" disabled={loading} className="btn-primary py-4 px-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-200">
            Sync Intelligence Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;
