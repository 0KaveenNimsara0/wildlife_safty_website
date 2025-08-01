import React from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, User, LogOut } from 'lucide-react';

function Dashboard() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    
    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100">
                            <Shield className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-800">Welcome to Your Dashboard</h2>
                        <p className="mt-2 text-gray-600">
                            Hello, {currentUser?.email || 'User'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profile Card */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="bg-emerald-100 p-3 rounded-full">
                                    <User className="h-6 w-6 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800">Profile Information</h3>
                            </div>
                            <div className="space-y-2 text-gray-600">
                                <p>Email: {currentUser?.email}</p>
                                <p>Account created: {new Date(currentUser?.metadata?.creationTime).toLocaleDateString()}</p>
                            </div>
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