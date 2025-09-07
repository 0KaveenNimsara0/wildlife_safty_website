import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  LogOut,
  User,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  AlertCircle
} from 'lucide-react';

export default function AdminProfilePage() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Administrator'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminData');

    if (!token || !admin) {
      navigate('/admin/login');
      return;
    }

    const parsedAdmin = JSON.parse(admin);
    setAdminData(parsedAdmin);
    setFormData({
      name: parsedAdmin.name || '',
      email: parsedAdmin.email || '',
      role: parsedAdmin.role || 'Administrator'
    });
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: adminData?.name || '',
      email: adminData?.email || '',
      role: adminData?.role || 'Administrator'
    });
    setError('');
    setSuccess('');
  };

  const handleSave = () => {
    // Validate form
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // In a real app, this would make an API call to update the profile
    // For now, just update localStorage and state
    const updatedAdmin = { ...adminData, ...formData };
    localStorage.setItem('adminData', JSON.stringify(updatedAdmin));
    setAdminData(updatedAdmin);
    setIsEditing(false);
    setSuccess('Profile updated successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-emerald-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
                <p className="text-sm text-gray-600">Manage your account settings</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {(error || success) && (
          <div className={`mb-6 flex items-center px-4 py-3 rounded ${error ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'}`}>
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error || success}</span>
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Profile Information
              </h3>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-md">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-900">{adminData?.name || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-md">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-900">{adminData?.email || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  {isEditing ? (
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="Administrator">Administrator</option>
                      <option value="Super Admin">Super Admin</option>
                      <option value="Moderator">Moderator</option>
                    </select>
                  ) : (
                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-md">
                      <Shield className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-900">{adminData?.role || 'Administrator'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date
                  </label>
                  <div className="flex items-center px-3 py-2 bg-gray-50 rounded-md">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {adminData?.createdAt ? new Date(adminData.createdAt).toLocaleDateString() : 'January 1, 2024'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Login
                  </label>
                  <div className="flex items-center px-3 py-2 bg-gray-50 rounded-md">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Status
                  </label>
                  <div className="flex items-center px-3 py-2 bg-green-50 rounded-md">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-green-800">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Security Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                  <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
                </div>
                <button className="px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md">
                  Change Password
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
