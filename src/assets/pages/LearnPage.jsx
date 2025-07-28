import React from 'react';
import { AlertTriangle, Shield, Map, BookOpen } from 'lucide-react';

export default function LearnPage() {
    const snakeTypes = [
        {
            name: "Venomous Snakes",
            description: "Learn to identify dangerous species",
            color: "red",
            icon: AlertTriangle,
            facts: [
                "Sri Lanka has 6 highly venomous snake species",
                "Russell's Viper causes most snake bite deaths",
                "Cobra bites affect the nervous system",
                "Saw-scaled Viper has hemotoxic venom"
            ]
        },
        {
            name: "Non-Venomous Snakes",
            description: "Harmless species you might encounter",
            color: "green",
            icon: Shield,
            facts: [
                "Most Sri Lankan snakes are non-venomous",
                "Rat snakes help control rodent populations",
                "Python species are constrictors, not venomous",
                "Many non-venomous snakes mimic venomous ones"
            ]
        },
        {
            name: "Habitat & Behavior",
            description: "Understanding snake ecology",
            color: "blue",
            icon: Map,
            facts: [
                "Snakes are most active during dawn and dusk",
                "They seek shelter during extreme weather",
                "Water snakes are often mistaken for dangerous species",
                "Most snakes prefer to avoid human contact"
            ]
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center mb-12">
                <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Learning Center</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Expand your knowledge about snakes, their behavior, and how to stay safe
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {snakeTypes.map((type, index) => {
                    const IconComponent = type.icon;
                    const colorClasses = {
                        red: "bg-red-50 border-red-200 text-red-700",
                        green: "bg-green-50 border-green-200 text-green-700",
                        blue: "bg-blue-50 border-blue-200 text-blue-700"
                    };
                    const iconColors = {
                        red: "text-red-600",
                        green: "text-green-600",
                        blue: "text-blue-600"
                    };

                    return (
                        <div key={index} className={`${colorClasses[type.color]} p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow`}>
                            <div className="text-center mb-6">
                                <IconComponent className={`w-12 h-12 ${iconColors[type.color]} mx-auto mb-3`} />
                                <h3 className="text-xl font-bold mb-2">{type.name}</h3>
                                <p className="text-sm opacity-80">{type.description}</p>
                            </div>
                            <ul className="space-y-3">
                                {type.facts.map((fact, factIndex) => (
                                    <li key={factIndex} className="flex items-start text-sm">
                                        <span className={`w-2 h-2 ${type.color === 'red' ? 'bg-red-500' : type.color === 'green' ? 'bg-green-500' : 'bg-blue-500'} rounded-full mt-2 mr-3 flex-shrink-0`}></span>
                                        <span>{fact}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-200">
                <h3 className="text-2xl font-bold text-purple-800 mb-4 text-center">Quick Identification Tips</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold text-purple-700 mb-3">Visual Characteristics</h4>
                        <ul className="space-y-2 text-sm">
                            <li>• Head shape: Triangular (venomous) vs. Oval (non-venomous)</li>
                            <li>• Eye pupils: Vertical slits vs. Round pupils</li>
                            <li>• Body patterns: Distinctive markings and colors</li>
                            <li>• Tail characteristics: Thick vs. Tapering</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-purple-700 mb-3">Behavioral Signs</h4>
                        <ul className="space-y-2 text-sm">
                            <li>• Defensive posture: Coiling and hissing</li>
                            <li>• Movement patterns: Quick vs. Slow movements</li>
                            <li>• Habitat preferences: Ground vs. Tree dwelling</li>
                            <li>• Activity timing: Diurnal vs. Nocturnal</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
