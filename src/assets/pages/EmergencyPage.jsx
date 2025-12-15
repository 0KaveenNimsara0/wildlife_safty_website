import React from 'react';
import { Phone, AlertTriangle, Shield, LifeBuoy, MapPin, Clock, Heart } from 'lucide-react';

export default function EmergencyPage() {
    const emergencyContacts = [
        {
            name: "Police Emergency",
            number: "119",
            description: "Immediate police assistance",
            color: "red",
            icon: Phone
        },
        {
            name: "Ambulance / Fire",
            number: "110",
            description: "Medical emergency & fire services",
            color: "orange",
            icon: Phone
        },
        {
            name: "National Hospital",
            number: "0112691111",
            description: "Colombo National Hospital",
            color: "blue",
            icon: Phone
        },
        {
            name: "Government Info Center",
            number: "1919",
            description: "General information & assistance",
            color: "purple",
            icon: Phone
        }
    ];

    const firstAidSteps = [
        {
            title: "DO ✅",
            color: "green",
            items: [
                "Keep the person calm and still",
                "Call for an ambulance immediately",
                "Position the bite below the heart",
                "Loosen or remove tight clothing/jewelry",
                "Remember the snake's appearance if seen"
            ]
        },
        {
            title: "DON'T ❌",
            color: "red",
            items: [
                "DO NOT cut the wound or try to suck venom",
                "DO NOT apply ice or a tourniquet",
                "DO NOT attempt to catch the snake",
                "DO NOT give alcohol or caffeinated drinks",
                "DO NOT let the person walk around"
            ]
        }
    ];

    const preventionTips = [
        {
            title: "Protective Measures",
            icon: Shield,
            tips: [
                "Wear protective footwear and long trousers in vegetated areas",
                "Always use a flashlight when walking at night",
                "Stick to clear paths and avoid tall grass"
            ]
        },
        {
            title: "Property Safety",
            icon: MapPin,
            tips: [
                "Keep your property clean and free of debris",
                "Be cautious before reaching into dark spaces",
                "Seal gaps and holes in buildings"
            ]
        },
        {
            title: "Behavioral Awareness",
            icon: Clock,
            tips: [
                "Most active during dawn and dusk",
                "Snakes prefer to avoid human contact",
                "Slowly back away if you see a snake"
            ]
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center mb-12">
                <LifeBuoy className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Snake Bite Emergency</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Follow these critical steps and use the emergency contacts below. Your immediate action can save a life.
                </p>
            </div>

            {/* Emergency Contacts Section */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {emergencyContacts.map((contact, index) => {
                    const IconComponent = contact.icon;
                    const colorClasses = {
                        red: "bg-red-50 border-red-200 text-red-700",
                        orange: "bg-orange-50 border-orange-200 text-orange-700",
                        blue: "bg-blue-50 border-blue-200 text-blue-700",
                        purple: "bg-purple-50 border-purple-200 text-purple-700"
                    };
                    const iconColors = {
                        red: "text-red-600",
                        orange: "text-orange-600",
                        blue: "text-blue-600",
                        purple: "text-purple-600"
                    };

                    return (
                        <div key={index} className={`${colorClasses[contact.color]} p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow`}>
                            <div className="text-center">
                                <IconComponent className={`w-10 h-10 ${iconColors[contact.color]} mx-auto mb-3`} />
                                <h3 className="font-bold text-lg mb-2">{contact.name}</h3>
                                <p className="text-sm opacity-80 mb-3">{contact.description}</p>
                                <a href={`tel:${contact.number}`} className="text-2xl font-bold hover:underline">
                                    {contact.number}
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* First Aid Section */}
            <div className="grid md:grid-cols-2 gap-8">
                {firstAidSteps.map((section, index) => {
                    const colorClasses = {
                        green: "bg-green-50 border-green-200 text-green-700",
                        red: "bg-red-50 border-red-200 text-red-700"
                    };
                    const iconColors = {
                        green: "text-green-600",
                        red: "text-red-600"
                    };

                    return (
                        <div key={index} className={`${colorClasses[section.color]} p-6 rounded-xl border shadow-sm`}>
                            <h3 className={`font-bold text-2xl mb-4 flex items-center ${iconColors[section.color]}`}>
                                <AlertTriangle className="w-6 h-6 mr-2" />
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start">
                                        <span className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${section.color === 'green' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        <span className="text-gray-800">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>

            {/* Prevention Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl border border-green-200">
                <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">Prevention & Safety Tips</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {preventionTips.map((category, index) => {
                        const IconComponent = category.icon;
                        return (
                            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <div className="text-center mb-4">
                                    <IconComponent className="w-10 h-10 text-green-600 mx-auto mb-2" />
                                    <h4 className="font-bold text-lg text-gray-800">{category.title}</h4>
                                </div>
                                <ul className="space-y-2">
                                    {category.tips.map((tip, tipIndex) => (
                                        <li key={tipIndex} className="flex items-start text-sm">
                                            <span className="text-green-600 mr-2 mt-1">•</span>
                                            <span className="text-gray-700">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Reference Card */}
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <div className="flex items-center mb-4">
                    <Heart className="w-8 h-8 text-yellow-600 mr-3" />
                    <h3 className="text-xl font-bold text-yellow-800">Emergency Quick Reference</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <strong className="text-yellow-700">Step 1:</strong> Call emergency services immediately
                    </div>
                    <div>
                        <strong className="text-yellow-700">Step 2:</strong> Keep victim calm and still
                    </div>
                    <div>
                        <strong className="text-yellow-700">Step 3:</strong> Note snake appearance
                    </div>
                </div>
            </div>
        </div>
    );
}
