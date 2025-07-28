import React from 'react';
import { Camera, Shield, AlertTriangle, Phone, Search, BookOpen } from 'lucide-react';

// The Footer component is also self-contained.
// It receives the `setPage` function to make the links work.
export default function Footer({ setPage }) {
    return (
        <footer className="bg-gray-800 text-white mt-16">
            <div className="container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-green-600 p-2 rounded-lg">
                                <Search className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">Wildlife Safety</h3>
                        </div>
                        <p className="text-gray-300 mb-4 max-w-md">
                            Advanced AI-powered snake identification system designed to help you stay safe in Sri Lanka's diverse wildlife environments.
                        </p>
                        <div className="flex space-x-4">
                            <div className="bg-gray-700 p-3 rounded-full">
                                <Shield className="w-5 h-5 text-green-400" />
                            </div>
                            <div className="bg-gray-700 p-3 rounded-full">
                                <Camera className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="bg-gray-700 p-3 rounded-full">
                                <BookOpen className="w-5 h-5 text-purple-400" />
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-green-400">Quick Links</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li><button onClick={() => setPage('home')} className="hover:text-white transition-colors">Snake Identifier</button></li>
                            <li><button onClick={() => setPage('emergency')} className="hover:text-white transition-colors">Emergency Info</button></li>
                            <li><button onClick={() => setPage('learning')} className="hover:text-white transition-colors">Learning Center</button></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-red-400">Emergency</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-red-400" />
                                <span>Police: 119</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-red-400" />
                                <span>Ambulance: 110</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                <span>Always seek medical help</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-gray-700 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-center md:text-left">
                            <p className="text-gray-400 text-sm">
                                <strong className="text-yellow-400">⚠️ Important Disclaimer:</strong> This tool is for educational and informational purposes only. 
                                Always seek immediate professional medical attention for any snake bite. Do not rely solely on AI identification for medical decisions.
                            </p>
                        </div>
                    </div>
                    <div className="text-center mt-6">
                        <p className="text-gray-500 text-sm">
                            © 2025 Wildlife Safety App. Built with AI technology to promote wildlife safety awareness.
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