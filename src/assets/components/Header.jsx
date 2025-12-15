import React, { useState } from 'react';
import { Camera, Phone, BookOpen, Search, Menu, X, User, LogIn, Shield, MapPin, MessageCircle} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ page, setPage, setAuthPage }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { currentUser, logout, googleSignIn, adminLogout, medicalOfficerLogout } = useAuth();
    const navigate = useNavigate();

    const navigation = [
        { id: 'home', name: 'Identifier', icon: Camera, path: '/home' },
        { id: 'emergency', name: 'Emergency', icon: Phone, path: '/emergency' },
        { id: 'learning', name: 'Learn', icon: BookOpen, path: '/learning' },
        { id: 'map', name: 'Map', icon: MapPin, path: '/map' },
        { id: 'animalDetail', name: 'Animal Details', icon: Search, path: '/animalDetail' },
        { id: 'communityFeed', name: 'Community Feed', icon: User, path: '/communityFeed' },
        { id: 'chat', name: 'Chat', icon: MessageCircle, path: '/chat' }
    ];

    // Helper functions to check login state
    const isAdminLoggedIn = () => !!localStorage.getItem('adminToken');
    const isMedicalOfficerLoggedIn = () => !!localStorage.getItem('medicalOfficerToken');
    const isAnyUserLoggedIn = () => currentUser || isAdminLoggedIn() || isMedicalOfficerLoggedIn();

    // Get admin or medical officer data
    const getAdminData = () => {
        const data = localStorage.getItem('adminData');
        return data ? JSON.parse(data) : null;
    };
    const getMedicalOfficerData = () => {
        const data = localStorage.getItem('medicalOfficerData');
        return data ? JSON.parse(data) : null;
    };

    // Get user display info and dashboard path
    const getUserInfo = () => {
        if (currentUser) {
            return {
                name: currentUser.displayName || currentUser.email.split('@')[0],
                dashboardPath: '/dashboard',
                avatar: getUserAvatar()
            };
        } else if (isAdminLoggedIn()) {
            const adminData = getAdminData();
            return {
                name: adminData?.name || 'Admin',
                dashboardPath: '/admin/dashboard',
                avatar: <Shield className="w-4 h-4 text-white" />
            };
        } else if (isMedicalOfficerLoggedIn()) {
            const moData = getMedicalOfficerData();
            return {
                name: moData?.name || 'Medical Officer',
                dashboardPath: '/medical-officer/dashboard',
                avatar: <User className="w-4 h-4 text-white" />
            };
        }
        return null;
    };

    const handleAuth = () => {
        if (currentUser) {
            logout();
            navigate('/');
        } else if (isAdminLoggedIn()) {
            adminLogout();
            navigate('/');
        } else if (isMedicalOfficerLoggedIn()) {
            medicalOfficerLogout();
            navigate('/');
        } else {
            setAuthPage('login');
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            setAuthPage(null); // Reset authPage state to show main app
            navigate('/home');
        } catch (error) {
            console.error('Google sign-in failed:', error);
        }
    };

    const handleNavigation = (path) => {
        setPage(path.split('/')[1] || 'home');
        navigate(path);
        setMobileMenuOpen(false);
    };

    // Get user profile picture or default icon
    const getUserAvatar = () => {
        // First check if user has a profile picture (Google users typically do)
        if (currentUser?.photoURL) {
            return (
                <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
            );
        }
        
        // Check if user signed in with Google (providerId check)
        const isGoogleUser = currentUser?.providerData?.some(provider => provider.providerId === 'google.com');
        
        if (isGoogleUser) {
            // Show Google logo for Google-authenticated users without profile pictures
            return (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border-2 border-white">
                    <img 
                        src="./src/assets/icons/google-icon-logo-svgrepo-com.svg" 
                        alt="Google" 
                        className="w-5 h-5"
                    />
                </div>
            );
        } else if (currentUser?.email) {
            // Create avatar with user initials
            const initials = currentUser.email.charAt(0).toUpperCase();
            return (
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold border-2 border-white">
                    {initials}
                </div>
            );
        }
        return <User className="w-4 h-4 text-white" />;
    };

    return (
        <header className="bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm border-b border-green-700/30">
<nav className="w-full px-4 py-2">
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Search className="w-2.5 h-2.5 text-gray-800" />
                            </div>
                        </div>
                        <div>
<h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                                WildLife Safty
                            </h1>
<p className="text-green-300 text-xs hidden sm:block font-medium" style={{ fontSize: '0.65rem' }}>
                                Smart Wildlife Protection
                            </p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
<div className="hidden md:flex items-center space-x-4">
                        <div className="flex space-x-1">
                            {navigation.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavigation(item.path)}
                                        className={`group flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                            page === item.id 
                                                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20' 
                                                : 'text-green-200 hover:bg-white/10 hover:text-white hover:shadow-md'
                                        }`}
                                    >
                                        <IconComponent className={`w-4 h-4 transition-transform duration-200 ${
                                            page === item.id ? 'scale-110' : 'group-hover:scale-105'
                                        }`} />
                                        <span>{item.name}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Login Button */}
                        <div className="flex items-center space-x-3 border-l border-green-700/50 pl-6">
                            {isAnyUserLoggedIn() ? (
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => navigate(getUserInfo()?.dashboardPath)}
                                        className="flex items-center space-x-2 hover:bg-white/10 p-1 rounded-full transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold border-2 border-white">
                                            {getUserInfo()?.avatar}
                                        </div>
                                        <span className="text-sm text-green-200 hidden lg:inline">
                                            {getUserInfo()?.name}
                                        </span>
                                    </button>
                                    <button
                                        onClick={handleAuth}
                                        className="text-sm text-green-200 hover:text-white transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleAuth}
                                        className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>Sign In</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2.5 rounded-xl hover:bg-white/10 transition-colors duration-200"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-6 pb-4 border-t border-green-700/50 pt-6 backdrop-blur-sm">
                        <div className="space-y-3">
                            {navigation.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavigation(item.path)}
                                        className={`flex items-center space-x-3 w-full px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                                            page === item.id 
                                                ? 'bg-white/20 text-white shadow-lg border border-white/20' 
                                                : 'text-green-200 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </button>
                                );
                            })}
                            
                            {/* Mobile Login */}
                            <div className="border-t border-green-700/50 pt-4 mt-4">
                                {isAnyUserLoggedIn() ? (
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => navigate(getUserInfo()?.dashboardPath)}
                                                className="flex items-center space-x-2"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold border-2 border-white">
                                                    {getUserInfo()?.avatar}
                                                </div>
                                                <span className="text-white font-medium">
                                                    {getUserInfo()?.name}
                                                </span>
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleAuth}
                                            className="text-sm text-green-300 hover:text-white transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <button
                                            onClick={handleGoogleSignIn}
                                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg"
                                        >
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                                alt="Google"
                                                className="w-4 h-4"
                                            />
                                            <span>Sign in with Google</span>
                                        </button>
                                        <button
                                            onClick={handleAuth}
                                            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            <span>Sign In</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}