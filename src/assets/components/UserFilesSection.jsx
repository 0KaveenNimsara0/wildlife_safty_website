import React, { useState, useEffect } from 'react';
import { FaFile, FaFileImage, FaFilePdf, FaFileWord, FaFileExcel, FaFileArchive, FaDownload, FaTrash, FaUpload } from 'react-icons/fa';

const UserFilesSection = ({ userId }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUserFiles();
  }, [userId]);

  const fetchUserFiles = async () => {
    try {
      // Mock data for demonstration
      const mockFiles = [
        {
          id: 1,
          name: 'wildlife-report.pdf',
          type: 'application/pdf',
          size: 1024000,
          uploadedAt: new Date().toISOString(),
          url: '/files/wildlife-report.pdf'
        },
        {
          id: 2,
          name: 'profile-picture.jpg',
          type: 'image/jpeg',
          size: 512000,
          uploadedAt: new Date().toISOString(),
          url: '/files/profile-picture.jpg'
        }
      ];
      setFiles(mockFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FaFileImage className="text-blue-500 text-xl" />;
    if (fileType.includes('pdf')) return <FaFilePdf className="text-red-500 text-xl" />;
    if (fileType.includes('word')) return <FaFileWord className="text-blue-600 text-xl" />;
    if (fileType.includes('excel') || fileType.includes('sheet')) return <FaFileExcel className="text-green-600 text-xl" />;
    if (fileType.includes('zip') || fileType.includes('archive')) return <FaFileArchive className="text-purple-600 text-xl" />;
    return <FaFile className="text-gray-500 text-xl" />;
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    try {
      // Mock upload - in real implementation, this would be an API call
      const newFile = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        url: `/files/${file.name}`
      };
      setFiles([...files, newFile]);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      setFiles(files.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Your Files</h3>
          <label className="flex items-center gap-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
            <FaUpload />
            <span>Upload File</span>
            <input
              type="file"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        {uploading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Uploading file...</p>
          </div>
        )}

        {files.length === 0 ? (
          <div className="text-center py-8">
            <FaFile className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600">No files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="text-blue-600 hover:text-blue-700 p-1"
                    title="Download"
                  >
                    <FaDownload size={16} />
                  </button>
                  <button
                    onClick={() => handleFileDelete(file.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFilesSection;
