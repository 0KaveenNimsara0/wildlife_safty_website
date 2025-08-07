import React from 'react';
import { Phone, AlertTriangle, Shield, LifeBuoy } from 'lucide-react';

export default function EmergencyPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Full-width Header */}
            <header className="bg-red-700 text-white shadow-lg">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
                    <LifeBuoy className="w-20 h-20 mx-auto mb-4 opacity-90" />
                    <h1 className="text-5xl font-extrabold tracking-tight">
                        Snake Bite Emergency
                    </h1>
                    <p className="mt-4 text-xl text-red-100 max-w-3xl mx-auto">
                        Follow these critical steps and use the emergency contacts below. Your immediate action can save a life.
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4 sm:p-8">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Emergency Numbers Section */}
                    <section className="bg-red-50 p-6 rounded-2xl shadow-md border border-red-200">
                        <h2 className="font-bold text-3xl mb-5 text-red-800 flex items-center">
                            <Phone className="w-8 h-8 mr-3 flex-shrink-0" />
                            Emergency Numbers (Sri Lanka)
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                            <div className="bg-white p-5 rounded-lg border border-red-100 shadow-sm hover:shadow-lg transition-shadow">
                                <p className="font-semibold text-red-600 text-lg">Police Emergency</p>
                                <a href="tel:119" className="text-4xl font-bold text-red-700 hover:text-red-800 tracking-wider">119</a>
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-red-100 shadow-sm hover:shadow-lg transition-shadow">
                                <p className="font-semibold text-red-600 text-lg">Ambulance / Fire</p>
                                <a href="tel:110" className="text-4xl font-bold text-red-700 hover:text-red-800 tracking-wider">110</a>
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-red-100 shadow-sm hover:shadow-lg transition-shadow">
                                <p className="font-semibold text-red-600 text-lg">National Hospital</p>
                                <a href="tel:0112691111" className="text-2xl font-bold text-red-700 hover:text-red-800">011-269-1111</a>
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-red-100 shadow-sm hover:shadow-lg transition-shadow">
                                <p className="font-semibold text-red-600 text-lg">Government Info Center</p>
                                <a href="tel:1919" className="text-2xl font-bold text-red-700 hover:text-red-800">1919</a>
                            </div>
                        </div>
                    </section>

                    {/* First Aid Section */}
                    <section className="bg-blue-50 p-6 rounded-2xl shadow-md border border-blue-200">
                        <h2 className="font-bold text-3xl mb-5 text-blue-800 flex items-center">
                            <AlertTriangle className="w-8 h-8 mr-3 flex-shrink-0" />
                            Critical First Aid
                        </h2>
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <h3 className="font-bold text-green-700 mb-3 text-xl border-b-2 border-green-200 pb-2">DO ✅</h3>
                                <ul className="space-y-3 text-gray-800">
                                    <li className="flex items-start"><span className="font-bold text-green-600 mr-2">›</span> Keep the person calm and still.</li>
                                    <li className="flex items-start"><span className="font-bold text-green-600 mr-2">›</span> Call for an ambulance immediately.</li>
                                    <li className="flex items-start"><span className="font-bold text-green-600 mr-2">›</span> Position the bite below the heart.</li>
                                    <li className="flex items-start"><span className="font-bold text-green-600 mr-2">›</span> Loosen or remove tight clothing/jewelry.</li>
                                    <li className="flex items-start"><span className="font-bold text-green-600 mr-2">›</span> Remember the snake's appearance if seen.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-red-700 mb-3 text-xl border-b-2 border-red-200 pb-2">DON'T ❌</h3>
                                <ul className="space-y-3 text-gray-800">
                                    <li className="flex items-start"><span className="font-bold text-red-600 mr-2">›</span> DO NOT cut the wound or try to suck venom.</li>
                                    <li className="flex items-start"><span className="font-bold text-red-600 mr-2">›</span> DO NOT apply ice or a tourniquet.</li>
                                    <li className="flex items-start"><span className="font-bold text-red-600 mr-2">›</span> DO NOT attempt to catch the snake.</li>
                                    <li className="flex items-start"><span className="font-bold text-red-600 mr-2">›</span> DO NOT give alcohol or caffeinated drinks.</li>
                                    <li className="flex items-start"><span className="font-bold text-red-600 mr-2">›</span> DO NOT let the person walk around.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Prevention Section */}
                    <section className="bg-green-50 p-6 rounded-2xl shadow-md border border-green-200">
                        <h2 className="font-bold text-3xl mb-5 text-green-800 flex items-center">
                            <Shield className="w-8 h-8 mr-3 flex-shrink-0" />
                            Prevention & Safety
                        </h2>
                        <ul className="space-y-3 text-gray-800 grid sm:grid-cols-2 gap-x-6">
                            <li className="flex items-start"><span className="text-green-600 mt-1 mr-2">✔</span> Wear protective footwear and long trousers in vegetated areas.</li>
                            <li className="flex items-start"><span className="text-green-600 mt-1 mr-2">✔</span> Always use a flashlight when walking at night.</li>
                            <li className="flex items-start"><span className="text-green-600 mt-1 mr-2">✔</span> Stick to clear paths and avoid tall grass.</li>
                            <li className="flex items-start"><span className="text-green-600 mt-1 mr-2">✔</span> Keep your property clean and free of debris where snakes can hide.</li>
                            <li className="flex items-start"><span className="text-green-600 mt-1 mr-2">✔</span> Be cautious before reaching into dark or hidden spaces.</li>
                            <li className="flex items-start"><span className="text-green-600 mt-1 mr-2">✔</span> If you see a snake, slowly back away and give it space.</li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
}