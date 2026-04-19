import React, { useState } from 'react';
import { Camera, Phone, BookOpen, Search, Menu, X, User, LogIn, Shield, MapPin, MessageCircle} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();
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
                name: currentUser.displayName || (currentUser.email && currentUser.email.includes('@') ? currentUser.email.split('@')[0] : 'User'),
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
            navigate('/home');
        } catch (error) {
            console.error('Google sign-in failed:', error);
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    // Helper to check if a path is active
    const isPathActive = (path) => {
        if (path === '/home' && (location.pathname === '/' || location.pathname === '/home')) return true;
        return location.pathname === path;
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
                        src="/src/assets/google-icon-logo-svgrepo-com.svg" 
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
        <header className="sticky top-0 z-50 glass border-b border-slate-200/50 shadow-sm transition-all duration-300">
            <nav className="container mx-auto px-4 sm:px-6 h-18 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <div 
                        className="flex items-center space-x-3 cursor-pointer group"
                        onClick={() => handleNavigation('/home')}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-xl shadow-emerald-500/10 flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform duration-500 border border-slate-100">
                                <img 
                                    src="/src/assets/logo.png" 
                                    alt="WildLife Safety Logo" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black tracking-tight bg-gradient-to-br from-slate-900 via-emerald-800 to-emerald-600 bg-clip-text text-transparent">
                                WildLife Safety
                            </h1>
                            <span className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold -mt-1">
                                Smart Protection
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navigation.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = isPathActive(item.path);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 group ${
                                        isActive 
                                            ? 'text-emerald-700' 
                                            : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50'
                                    }`}
                                >
                                    <IconComponent className={`w-4 h-4 transition-transform duration-300 ${
                                        isActive ? 'scale-110' : 'group-hover:translate-y-[-1px]'
                                    }`} />
                                    <span>{item.name}</span>
                                    {isActive && (
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Action Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="h-8 w-[1px] bg-slate-200/60 mx-2" />
                        
                        {isAnyUserLoggedIn() ? (
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => navigate(getUserInfo()?.dashboardPath)}
                                    className="flex items-center space-x-2 p-1 pl-1 pr-3 rounded-full hover:bg-slate-100 transition-all duration-200 border border-transparent hover:border-slate-200"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-100 shadow-sm flex items-center justify-center bg-emerald-50">
                                        {getUserInfo()?.avatar}
                                    </div>
                                    <div className="flex flex-col items-start lg:flex hidden">
                                        <span className="text-xs font-bold text-slate-800 leading-none">
                                            {getUserInfo()?.name}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-medium">
                                            Account Dashboard
                                        </span>
                                    </div>
                                </button>
                                <button
                                    onClick={handleAuth}
                                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogIn className="w-5 h-5 rotate-180" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => navigate('/login')}
                                    className={`text-sm font-bold px-3 transition-colors ${
                                        location.pathname === '/login' 
                                            ? 'text-emerald-600' 
                                            : 'text-slate-600 hover:text-emerald-600'
                                    }`}
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className={`btn-primary flex items-center space-x-2 py-2 px-5 text-sm ${
                                        location.pathname === '/register' ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
                                    }`}
                                >
                                    <span>Get Started</span>
                                    <Shield className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6 text-rose-500" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation Drawer */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full glass border-b border-slate-200 animate-fade-in shadow-2xl overflow-hidden rounded-b-3xl">
                        <div className="p-4 space-y-2">
                            {navigation.map((item) => {
                                const IconComponent = item.icon;
                                const isActive = isPathActive(item.path);
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavigation(item.path)}
                                        className={`flex items-center space-x-3 w-full px-4 py-3.5 rounded-2xl text-left transition-all duration-200 ${
                                            isActive 
                                                ? 'bg-emerald-50 text-emerald-700 font-bold' 
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <IconComponent className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                                        <span>{item.name}</span>
                                    </button>
                                );
                            })}
                            
                            <div className="pt-4 border-t border-slate-100 mt-2">
                                {isAnyUserLoggedIn() ? (
                                    <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                        <div 
                                            className="flex items-center space-x-3 cursor-pointer"
                                            onClick={() => {
                                                navigate(getUserInfo()?.dashboardPath);
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-emerald-50">
                                                {getUserInfo()?.avatar}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-800">{getUserInfo()?.name}</span>
                                                <span className="text-xs text-slate-500">View Profile</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleAuth}
                                            className="text-sm font-bold text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                                            className="btn-secondary py-3 text-sm"
                                        >
                                            Sign In
                                        </button>
                                        <button
                                            onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                                            className="btn-primary py-3 text-sm"
                                        >
                                            Register
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
