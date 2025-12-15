import React, { useState } from 'react';
import { FaCamera, FaUpload, FaTimes } from 'react-icons/fa';

const ProfilePictureUpload = ({ currentPhoto, onPhotoChange }) => {
  const [preview, setPreview] = useState(currentPhoto);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);
      try {
        await onPhotoChange(file, preview);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removePreview = () => {
    setPreview(currentPhoto);
    setFile(null);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="relative inline-block">
          <img
            src={preview || '/default-avatar.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
          />
          {preview !== currentPhoto && (
            <button
              onClick={removePreview}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          className="hidden"
        />
        <FaUpload className="mx-auto text-2xl mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">
          {isDragging ? 'Drop your image here' : 'Drag & drop or click to upload'}
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 2MB</p>
      </div>

      {file && (
        <div className="flex justify-center">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <FaUpload />
                Upload Profile Picture
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
