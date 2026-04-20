import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Camera, Upload, Check, AlertCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';

export default function ProfilePhotoModal({ isOpen, onClose, currentPhoto, onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setPreview(null);
      setError('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG).');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setFile(selectedFile);
    setError('');
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleSubmit = async () => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      setError('');
      await onUpload(file);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to sync image with HQ.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg">
              <Camera size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Identity <span className="text-emerald-600">Asset</span></h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Update Profile Dossier</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-4 bg-white rounded-2xl text-slate-300 hover:text-rose-500 hover:shadow-lg transition-all active:scale-95 border border-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-10 space-y-8">
          {/* Drop Zone / Preview */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={`
              relative aspect-square md:aspect-video rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all duration-500 border-4 border-dashed
              ${isDragging ? 'border-emerald-500 bg-emerald-50 scale-[0.98]' : 'border-slate-100 bg-slate-50 hover:bg-slate-100/50 hover:border-emerald-200'}
            `}
          >
            <input 
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />

            {preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 px-6 py-3 rounded-2xl flex items-center gap-2 shadow-2xl">
                    <RefreshCw size={16} className="text-emerald-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Change Asset</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center space-y-6 p-8">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload size={32} className="text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black text-slate-900">Transmit Identification Image</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Drag & drop or click to browse</p>
                </div>
                <div className="flex items-center justify-center gap-8 pt-4 border-t border-slate-200/50">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={14} className="text-slate-300" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">JPG, PNG, GIF</span>
                  </div>
                  <div className="h-4 w-[1px] bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <ImageIcon size={14} className="text-slate-300" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">MAX 5MB</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-3 p-5 bg-rose-50 border border-rose-100 rounded-[1.5rem] text-rose-600 animate-shake">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {error}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-6 bg-slate-50 text-slate-400 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all border border-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!file || isUploading}
              className="flex-[2] py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-600 shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]"
            >
              {isUploading ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <Check size={20} />
                  <span>Update Asset</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-8 flex justify-center items-center border-t border-slate-100 gap-6 opacity-50">
          <div className="flex items-center gap-2">
            <ImageIcon size={14} className="text-slate-400" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Secure Asset Storage</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-2">
            <ImageIcon size={14} className="text-slate-400" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">End-to-End Encryption</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
