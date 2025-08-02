import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, User, LogOut, Mail, Lock, Camera, CheckCircle, XCircle } from 'lucide-react';

function Dashboard() {
    const { currentUser, logout, updateEmail, updatePassword, sendEmailVerification } = useAuth();
    const navigate = useNavigate();
    
    const [editMode, setEditMode] = useState(false);
    const [newEmail, setNewEmail] = useState(currentUser?.email || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleUpdateProfile = async () => {
        setError('');
        setSuccess('');
        
        try {
            // Update email if changed
            if (newEmail !== currentUser.email) {
                await updateEmail(newEmail);
            }

            // Update password if provided
            if (newPassword && newPassword === confirmPassword) {
                await updatePassword(newPassword);
            }

            // TODO: Add profile picture update logic here
            // You would need to implement image upload to storage
            // and update the user's photoURL

            setSuccess('Profile updated successfully!');
            setEditMode(false);
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        }
    };

    const handleVerifyEmail = async () => {
        try {
            await sendEmailVerification();
            setSuccess('Verification email sent! Check your inbox.');
        } catch (err) {
            setError(err.message || 'Failed to send verification email');
        }
    };

    // Get user profile picture or default icon
    const getUserAvatar = () => {
        if (currentUser?.photoURL) {
            return (
                <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className="h-full w-full rounded-full object-cover"
                />
            );
        }
        return <User className="h-12 w-12 text-emerald-600" />;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-100 relative">
                            {getUserAvatar()}
                            {editMode && (
                                <button className="absolute bottom-0 right-0 bg-emerald-600 p-2 rounded-full text-white hover:bg-emerald-700">
                                    <Camera className="h-4 w-4" />
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => {
                                            // Handle image upload here
                                            const file = e.target.files[0];
                                            if (file) {
                                                // TODO: Upload image and get URL
                                                // Then update user's photoURL
                                            }
                                        }}
                                    />
                                </button>
                            )}
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-800">
                            {editMode ? 'Edit Profile' : 'Welcome to Your Dashboard'}
                        </h2>
                        <p className="mt-2 text-gray-600">
                            {editMode ? 'Update your account details' : `Hello, ${currentUser?.displayName || currentUser?.email || 'User'}`}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center">
                            <XCircle className="h-5 w-5 mr-2" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            {success}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profile Card */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-emerald-100 p-3 rounded-full">
                                        <User className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800">
                                        Profile Information
                                    </h3>
                                </div>
                                {!editMode && (
                                    <button 
                                        onClick={() => setEditMode(true)}
                                        className="text-sm text-emerald-600 hover:text-emerald-800"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {editMode ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="Leave blank to keep current"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    {newPassword && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex space-x-3 pt-2">
                                        <button
                                            onClick={handleUpdateProfile}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditMode(false);
                                                setError('');
                                                setSuccess('');
                                            }}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 text-gray-600">
                                    <p className="flex items-center">
                                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                        {currentUser?.email}
                                    </p>
                                    <p className="flex items-center">
                                        {currentUser?.emailVerified ? (
                                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                        ) : (
                                            <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                        )}
                                        Email {currentUser?.emailVerified ? 'Verified' : 'Not Verified'}
                                        {/* Show verify button for all users, including Google users */}
                                        <button 
                                            onClick={handleVerifyEmail}
                                            className="ml-2 text-sm text-emerald-600 hover:text-emerald-800"
                                        >
                                            Verify Now
                                        </button>
                                    </p>
                                    <p>
                                        Account created: {new Date(currentUser?.metadata?.creationTime).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Actions Card */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/animalDetail')}
                                    className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-100"
                                >
                                    <span>View Animals</span>
                                    <span>→</span>
                                </button>
                                <button
                                    onClick={() => navigate('/map')}
                                    className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-100"
                                >
                                    <span>View Map</span>
                                    <span>→</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-2 px-4 py-2 bg-red-50 border border-red-100 rounded-md text-red-600 hover:bg-red-100 mt-4"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;