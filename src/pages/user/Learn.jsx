import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Shield, Map, BookOpen, GraduationCap, ArrowRight, Lightbulb, Search, Info, Leaf, Target } from 'lucide-react';

export default function LearnPage() {
    const navigate = useNavigate();
    const snakeTypes = [
        {
            name: "Venomous Species",
            description: "Critical identification guide for high-risk reptiles.",
            theme: "rose",
            icon: AlertTriangle,
            facts: [
                "Sri Lanka hosts 6 lethal venomous species.",
                "Russell's Viper is responsible for highest morbidity.",
                "Neurotoxic vs Hemotoxic: Understanding the difference.",
                "Primary identification: Head shape and scale patterns."
            ]
        },
        {
            name: "Harmless/Defensive",
            description: "Common species that serve vital ecosystem roles.",
            theme: "emerald",
            icon: Shield,
            facts: [
                "70% of island sightings involve non-venomous types.",
                "Rat snakes are essential for agricultural pest control.",
                "Pythons reach significant size but lack venom glands.",
                "Defensive mimicry: How harmless snakes deter predators."
            ]
        },
        {
            name: "Habitat Intelligence",
            description: "Spatial awareness and behavioral patterns.",
            theme: "sky",
            icon: Map,
            facts: [
                "Activity peaks during crepuscular (dawn/dusk) hours.",
                "Impact of monsoons on snake dispersal patterns.",
                "Wetlands vs Dry zone: Biodiversity variations.",
                "Conflict mitigation through environmental management."
            ]
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-20 animate-fade-in">
            {/* Elegant Header */}
            <div className="text-center space-y-6 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-xs font-black uppercase tracking-widest border border-sky-100 shadow-sm">
                    <GraduationCap size={14} />
                    <span>Wildlife Academy</span>
                </div>
                <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
                    Master <span className="text-emerald-600">Species</span> Intelligence
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Bridging the gap between scientific herpetology and everyday safety. Our learning hub provides expert-vetted data on Sri Lanka's diverse snake populations.
                </p>
            </div>

            {/* Knowledge Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {snakeTypes.map((type, index) => {
                    const themes = {
                        rose: "border-rose-100 bg-rose-50/20 text-rose-600",
                        emerald: "border-emerald-100 bg-emerald-50/20 text-emerald-600",
                        sky: "border-sky-100 bg-sky-50/20 text-sky-600"
                    };
                    const dotThemes = {
                        rose: "bg-rose-500",
                        emerald: "bg-emerald-500",
                        sky: "bg-sky-500"
                    };

                    return (
                        <div key={index} className={`card-premium p-8 group flex flex-col h-full border-2 ${themes[type.theme]}`}>
                            <div className="mb-8">
                                <div className="p-4 rounded-2xl bg-white shadow-sm w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <type.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">{type.name}</h3>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">{type.description}</p>
                            </div>
                            
                            <ul className="space-y-4 flex-grow">
                                {type.facts.map((fact, fi) => (
                                    <li key={fi} className="flex gap-4">
                                        <div className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${dotThemes[type.theme]}`} />
                                        <span className="text-sm font-medium text-slate-600 leading-snug">{fact}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className="mt-8 flex items-center gap-2 text-sm font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                                <span>Deep Dive</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Expert Insight Section */}
            <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-10 lg:p-20">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
                <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <Lightbulb size={24} />
                            <h3 className="text-xl font-bold uppercase tracking-widest">Expert Insights</h3>
                        </div>
                        <h4 className="text-4xl font-black text-white tracking-tight">Rapid Identification <br/> <span className="text-slate-400">Tactics for the Field</span></h4>
                        
                        <div className="grid gap-4">
                            {[
                                { title: "Cranial Morphology", desc: "Triangular head structures often indicate major venom glands.", icon: Target },
                                { title: "Pupil Geometry", desc: "Vertical slit pupils are common in nocturnal vipers.", icon: Search },
                                { title: "Scale Texture", desc: "Keeled scales provide a rougher, non-reflective appearance.", icon: Leaf }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="shrink-0 text-emerald-500">
                                        <item.icon size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h5 className="font-bold text-white leading-none">{item.title}</h5>
                                        <p className="text-sm text-slate-400 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-premium p-8 bg-white border-0 shadow-2xl relative">
                        <div className="absolute -top-4 -right-4 bg-emerald-600 text-white w-20 h-20 rounded-full flex items-center justify-center font-black text-xl shadow-xl shadow-emerald-600/30">
                            ID+
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-emerald-600 border-b border-slate-100 pb-4">
                                <Info size={20} />
                                <span className="font-black uppercase tracking-widest text-xs">Field Note</span>
                            </div>
                            <blockquote className="text-xl font-medium text-slate-800 italic leading-relaxed">
                                "While visual markers are helpful, they are not infallible. Many harmless species have evolved to mimic the look of deadly vipers perfectly. **Never base a life-safety decision solely on visual mimicry.**"
                            </blockquote>
                            <div className="flex items-center gap-4 pt-4">
                                <div className="w-12 h-12 rounded-full bg-slate-200" />
                                <div>
                                    <p className="font-black text-slate-900 text-sm">Dr. Rohan Sennayake</p>
                                    <p className="text-xs font-bold text-slate-500">Chief Herpetologist</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="text-center pb-12">
                <button 
                    onClick={() => navigate("/article-selection")}
                    className="btn-primary px-12 py-5 text-lg shadow-2xl shadow-emerald-500/20"
                >
                    Access Digital Library
                </button>
            </div>
        </div>
    );
}

