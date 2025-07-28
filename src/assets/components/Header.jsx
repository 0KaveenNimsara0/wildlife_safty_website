import React, { useState } from 'react';
import { Camera, Phone, BookOpen, Search, Menu, X } from 'lucide-react';

// The Header component is now self-contained.
// It receives the current page and the function to change it as props.
export default function Header({ page, setPage }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { id: 'home', name: 'Identifier', icon: Camera },
        { id: 'emergency', name: 'Emergency', icon: Phone },
        { id: 'learning', name: 'Learn', icon: BookOpen }
    ];

    return (
        <header className="bg-gradient-to-r from-green-800 to-green-900 text-white shadow-xl sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                            <Search className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">Wildlife Safety</h1>
                            <p className="text-green-200 text-sm hidden sm:block">AI-Powered Snake Identification</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-1">
                        {navigation.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setPage(item.id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        page === item.id 
                                            ? 'bg-white bg-opacity-20 text-white shadow-lg' 
                                            : 'text-green-200 hover:bg-white hover:bg-opacity-10'
                                    }`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    <span>{item.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-green-700 pt-4">
                        <div className="space-y-2">
                            {navigation.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setPage(item.id);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left transition-all ${
                                            page === item.id 
                                                ? 'bg-white bg-opacity-20 text-white' 
                                                : 'text-green-200 hover:bg-white hover:bg-opacity-10'
                                        }`}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
