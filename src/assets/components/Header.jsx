import React, { useState } from 'react';
// FIXED: Added MapPin to the import list
import { Camera, Phone, BookOpen, Search, Menu, X, User, LogIn, Shield, MapPin } from 'lucide-react';

export default function Header({ page, setPage }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigation = [
        { id: 'home', name: 'Identifier', icon: Camera },
        { id: 'emergency', name: 'Emergency', icon: Phone },
        { id: 'learning', name: 'Learn', icon: BookOpen },
        { id: 'map', name: 'Map', icon: MapPin },
        { id: 'animalDetail', name: 'Animal Details', icon: Search },
        { id:'communityFeed', name: 'Community Feed', icon: User }
    ];

    const handleLogin = () => {
        setIsLoggedIn(!isLoggedIn);
    };

    return (
        <header className="bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm border-b border-green-700/30">
            <nav className="container mx-auto px-6 py-4">
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
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                                WildGuard AI
                            </h1>
                            <p className="text-green-300 text-sm hidden sm:block font-medium">
                                Smart Wildlife Protection
                            </p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="flex space-x-1">
                            {navigation.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setPage(item.id)}
                                        className={`group flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
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
                            {isLoggedIn ? (
                                <div className="flex items-center space-x-2">
                                    <div className="bg-green-500 p-2 rounded-full">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <button
                                        onClick={handleLogin}
                                        className="text-sm text-green-200 hover:text-white transition-colors"
                                    >
                                        Profile
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Sign In</span>
                                </button>
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
                                        onClick={() => {
                                            setPage(item.id);
                                            setMobileMenuOpen(false);
                                        }}
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
                                {isLoggedIn ? (
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-green-500 p-2 rounded-full">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-white font-medium">Welcome back!</span>
                                        </div>
                                        <button
                                            onClick={handleLogin}
                                            className="text-sm text-green-300 hover:text-white transition-colors"
                                        >
                                            Profile
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleLogin}
                                        className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>Sign In</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}