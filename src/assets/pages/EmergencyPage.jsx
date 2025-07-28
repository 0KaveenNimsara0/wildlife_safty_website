import React from 'react';
import { Phone, AlertTriangle, Shield } from 'lucide-react';

export default function EmergencyPage() {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-4xl mx-auto text-gray-700 border border-gray-100">
            <div className="text-center mb-8">
                <Phone className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-red-700 mb-2">Emergency Information</h2>
                <p className="text-gray-600">Critical information for snake bite emergencies</p>
            </div>
            
            <div className="space-y-8">
                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                    <h3 className="font-bold text-2xl mb-4 text-red-700 flex items-center">
                        <Phone className="w-7 h-7 mr-3" />
                        Emergency Numbers (Sri Lanka)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="font-bold text-red-600 text-lg">Police Emergency</p>
                            <p className="text-3xl font-bold text-red-700">119</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="font-bold text-red-600 text-lg">Ambulance/Fire</p>
                            <p className="text-3xl font-bold text-red-700">110</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="font-bold text-red-600 text-lg">National Hospital</p>
                            <p className="text-xl font-bold text-red-700">011-269-1111</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="font-bold text-red-600 text-lg">Info Center</p>
                            <p className="text-xl font-bold text-red-700">1919</p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="font-bold text-2xl mb-4 text-blue-700 flex items-center">
                        <AlertTriangle className="w-7 h-7 mr-3" />
                        Snake Bite First Aid
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold text-blue-600 mb-3 text-lg">DO:</h4>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Stay calm and keep victim still</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Call emergency services immediately</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Keep bite below heart level</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Remove tight jewelry/clothing</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Note snake's appearance</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-red-600 mb-3 text-lg">DON'T:</h4>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Cut the wound or suck venom</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Apply ice or tourniquet</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Try to catch the snake</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Give alcohol or caffeine</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Let victim walk unnecessarily</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h3 className="font-bold text-2xl mb-4 text-green-700 flex items-center">
                        <Shield className="w-7 h-7 mr-3" />
                        Prevention & Safety Tips
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>Wear protective boots and long pants</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>Stick to cleared paths when possible</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>Use flashlight during night walks</span>
                            </li>
                        </ul>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>Check before reaching into dark areas</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>Give snakes space to retreat</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span>Keep surroundings clean and tidy</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
