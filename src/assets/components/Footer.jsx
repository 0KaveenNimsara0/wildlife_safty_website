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
            title: "Expert AI",
            description: "Advanced machine learning for precise species identification."
        },
        {
            icon: Zap,
            title: "Real-time",
            description: "Instant results with granular confidence scoring."
        },
        {
            icon: Shield,
            title: "Reliable",
            description: "Verified safety protocols and emergency guidance."
        },
        {
            icon: Globe,
            title: "Localized",
            description: "Expertly tuned for Sri Lanka's unique biodiversity."
        }
    ];

    const stats = [
        { number: "50K+", label: "Identified" },
        { number: "15K+", label: "Users" },
        { number: "99%", label: "Accuracy" },
        { number: "24/7", label: "Guide" }
    ];

    return (
        <footer className="bg-slate-900 text-white pt-20 pb-10 relative overflow-hidden border-t border-slate-800">
            {/* Background Accent */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="container mx-auto px-6 relative">
                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <div key={index} className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 group">
                                <div className="bg-emerald-500/10 p-3 rounded-xl w-fit mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 text-emerald-400">
                                    <IconComponent className="w-5 h-5" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-100 mb-2">{feature.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                <div className="grid lg:grid-cols-12 gap-12 mb-20">
                    {/* Brand Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-emerald-600 p-2 rounded-xl">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                                WildLife Safety
                            </h3>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-base font-medium">
                            Empowering coexistence through technology. Our AI identification system helps protect both people and biodiversity across Sri Lanka.
                        </p>
                        <div className="flex space-x-3">
                            {[Facebook, Twitter, Instagram, Mail].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl text-center">
                                <div className="text-2xl font-black text-emerald-400">{stat.number}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Links */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Navigation</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Identifier', path: 'home' },
                                { name: 'Emergency', path: 'emergency' },
                                { name: 'Learn', path: 'learning' },
                                { name: 'Community', path: 'communityFeed' }
                            ].map((link, i) => (
                                <li key={i}>
                                    <button 
                                        onClick={() => setPage(link.path)}
                                        className="text-slate-400 hover:text-emerald-400 font-bold transition-colors text-sm"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Security Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Safety</h4>
                        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl">
                            <div className="flex items-center space-x-2 text-rose-400 mb-2">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-xs font-black uppercase">Emergency</span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium leading-normal">
                                Always seek immediate medical help for snake bites. Identification is for awareness only.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm font-medium">
                        © 2025 WildLife Safety Sri Lanka. Licensed AI Technology.
                    </p>
                    <div className="flex items-center space-x-6 text-slate-500 text-sm font-medium">
                        <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
                        <div className="flex items-center space-x-2 text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span>Sri Lanka</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
// This code defines a footer component for a wildlife safety application.
// It includes sections for quick links, emergency contacts, and a disclaimer about the use of the app.
// The footer is styled with Tailwind CSS and uses Lucide icons for visual elements.