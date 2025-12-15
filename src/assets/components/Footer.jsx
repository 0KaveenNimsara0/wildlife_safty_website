import React from 'react';
import { 
    Camera, Shield, AlertTriangle, Phone, Search, BookOpen, 
    Zap, Target, Brain, Globe, Award, Users, 
    Facebook, Twitter, Instagram, Mail, MapPin
} from 'lucide-react';

export default function Footer({ setPage }) {
    const features = [
        {
            icon: Brain,
            title: "AI Recognition",
            description: "Advanced machine learning for accurate species identification"
        },
        {
            icon: Zap,
            title: "Instant Results",
            description: "Get identification results in seconds with confidence scores"
        },
        {
            icon: Shield,
            title: "Safety First",
            description: "Comprehensive safety information and emergency protocols"
        },
        {
            icon: Globe,
            title: "Sri Lankan Focus",
            description: "Specialized database for local wildlife and conditions"
        }
    ];

    const stats = [
        { number: "50K+", label: "Species Identified" },
        { number: "15K+", label: "Active Users" },
        { number: "99.2%", label: "Accuracy Rate" },
        { number: "24/7", label: "Support Available" }
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="container mx-auto px-6 py-16 relative">
                {/* Features Section */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-4">
                            Why Choose WildGuard AI?
                        </h3>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Experience the future of wildlife safety with our cutting-edge AI technology
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {features.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <div key={index} className="group">
                                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 transform hover:-translate-y-1">
                                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <IconComponent className="w-6 h-6 text-white" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Stats Section */}
                    <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl p-8 border border-green-700/30 backdrop-blur-sm">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-400 text-sm font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="relative">
                                <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-3 rounded-xl shadow-lg">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                    <Search className="w-2.5 h-2.5 text-gray-800" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                                    WildGuard AI
                                </h3>
                                <p className="text-green-400 font-medium">Smart Wildlife Protection</p>
                            </div>
                        </div>
                        
                        <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                            Advanced AI-powered wildlife identification system designed to help you stay safe in Sri Lanka's diverse ecosystems. 
                            Protecting lives through intelligent technology.
                        </p>
                        
                        <div className="flex space-x-4 mb-6">
                            <a href="#" className="bg-gray-800 hover:bg-green-600 p-3 rounded-xl transition-colors duration-200 group">
                                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="bg-gray-800 hover:bg-blue-500 p-3 rounded-xl transition-colors duration-200 group">
                                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="bg-gray-800 hover:bg-pink-500 p-3 rounded-xl transition-colors duration-200 group">
                                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="bg-gray-800 hover:bg-red-500 p-3 rounded-xl transition-colors duration-200 group">
                                <Mail className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            </a>
                        </div>
                    </div>
                    
                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-green-400 flex items-center space-x-2">
                            <Target className="w-5 h-5" />
                            <span>Quick Access</span>
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <button 
                                    onClick={() => setPage('home')} 
                                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                                >
                                    <Camera className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                                    <span>Snake Identifier</span>
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => setPage('emergency')} 
                                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                                >
                                    <Phone className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                                    <span>Emergency Guide</span>
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => setPage('learning')} 
                                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                                >
                                    <BookOpen className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                                    <span>Learning Hub</span>
                                </button>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group">
                                    <Award className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                                    <span>Achievements</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Emergency & Support */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-red-400 flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5" />
                            <span>Emergency</span>
                        </h4>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center space-x-2 text-gray-300">
                                <div className="bg-red-600 p-1 rounded">
                                    <Phone className="w-3 h-3 text-white" />
                                </div>
                                <span className="font-mono">Police: 119</span>
                            </li>
                            <li className="flex items-center space-x-2 text-gray-300">
                                <div className="bg-red-600 p-1 rounded">
                                    <Phone className="w-3 h-3 text-white" />
                                </div>
                                <span className="font-mono">Ambulance: 1990</span>
                            </li>
                            <li className="flex items-center space-x-2 text-gray-300">
                                <div className="bg-blue-600 p-1 rounded">
                                    <Users className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm">24/7 Support</span>
                            </li>
                        </ul>
                        
                        <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 p-4 rounded-xl border border-red-700/30">
                            <div className="flex items-start space-x-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-gray-300">
                                    Always seek immediate medical attention for snake bites
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom Section */}
                <div className="border-t border-gray-700/50 pt-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
                        <div className="max-w-3xl">
                            <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 p-4 rounded-xl border border-yellow-400/20 mb-4">
                                <p className="text-yellow-200 text-sm leading-relaxed">
                                    <strong className="text-yellow-400">⚠️ Medical Disclaimer:</strong> 
                                    This application provides educational information only. Always consult healthcare professionals 
                                    for medical advice. Do not rely solely on AI identification for emergency medical decisions.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>Sri Lanka</span>
                        </div>
                    </div>
                    
                    <div className="text-center mt-8 pt-6 border-t border-gray-800">
                        <p className="text-gray-500 text-sm">
                            © 2025 WildGuard AI. Powered by advanced machine learning • 
                            <span className="text-green-400 ml-1">Protecting Wildlife, Protecting You</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
// This code defines a footer component for a wildlife safety application.
// It includes sections for quick links, emergency contacts, and a disclaimer about the use of the app.
// The footer is styled with Tailwind CSS and uses Lucide icons for visual elements.