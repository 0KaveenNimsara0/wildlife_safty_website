import React from 'react';
import { Phone, AlertTriangle, Shield, LifeBuoy, MapPin, Clock, Heart, Zap, Activity, Navigation, Info } from 'lucide-react';

export default function EmergencyPage() {
    const emergencyContacts = [
        {
            name: "Central Response",
            number: "119",
            description: "Immediate Military & Police Assistance",
            theme: "rose",
            icon: Shield
        },
        {
            name: "Medical Dispatch",
            number: "1990",
            description: "Suwaseriya Fast Response Ambulance",
            theme: "emerald",
            icon: Heart
        },
        {
            name: "Fire & Rescue",
            number: "110",
            description: "Search, Rescue & Containment",
            theme: "amber",
            icon: Zap
        },
        {
            name: "Crisis Intel",
            number: "1919",
            description: "National Emergency Information Hub",
            theme: "sky",
            icon: Info
        }
    ];

    const protocols = [
        {
            title: "Critical Actions (DO)",
            type: "positive",
            steps: [
                { text: "Immobilize the limb immediately", sub: "Use a splint or padding to prevent movement." },
                { text: "Keep victim calm and horizontal", sub: "Reduces heart rate and venom spread." },
                { text: "Remove jewelry and tight clothing", sub: "The area will likely swell rapidly." },
                { text: "Note identifying marks on snake", sub: "Helps medical staff select the correct antivenom." },
                { text: "Apply clean pressure bandage", sub: "Broad pressure, not a tourniquet." }
            ]
        },
        {
            title: "Strict Prohibitions (DON'T)",
            type: "negative",
            steps: [
                { text: "DO NOT cut the bite area", sub: "Causes tissue damage and infection risk." },
                { text: "DO NOT attempt to suck venom", sub: "Ineffective and dangerous for the rescuer." },
                { text: "DO NOT apply ice or chemicals", sub: "Can worsen localized tissue necrosis." },
                { text: "DO NOT apply a tight tourniquet", sub: "Can lead to amputation if blood flow is cut." },
                { text: "DO NOT give alcohol or coffee", sub: "Accelerates heart rate and venom absorption." }
            ]
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-16 animate-fade-in">
            {/* Urgent Header */}
            <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 lg:p-20 text-center space-y-6">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-600/40 via-transparent to-emerald-600/40" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                </div>
                
                <div className="relative z-10 space-y-6">
                    <div className="mx-auto w-fit bg-rose-500 p-4 rounded-3xl shadow-2xl shadow-rose-500/40 animate-pulse">
                        <LifeBuoy className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-white">
                            EMERGENCY <span className="text-rose-500">PROTOCOL</span>
                        </h2>
                        <p className="text-slate-400 text-lg lg:text-xl font-medium max-w-2xl mx-auto">
                            Immediate medical response is mandatory for all snake bites. Follow these high-stakes guidelines while waiting for help.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tactical Contact Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {emergencyContacts.map((contact, i) => {
                    const themes = {
                        rose: "border-rose-100 bg-rose-50/30 text-rose-600 shadow-rose-500/5",
                        emerald: "border-emerald-100 bg-emerald-50/30 text-emerald-600 shadow-emerald-500/5",
                        amber: "border-amber-100 bg-amber-50/30 text-amber-600 shadow-amber-500/5",
                        sky: "border-sky-100 bg-sky-50/30 text-sky-600 shadow-sky-500/5"
                    };
                    const btnThemes = {
                        rose: "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30",
                        emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30",
                        amber: "bg-amber-600 hover:bg-amber-700 shadow-amber-600/30",
                        sky: "bg-sky-600 hover:bg-sky-700 shadow-sky-600/30"
                    };
                    return (
                        <div key={i} className={`card-premium p-8 flex flex-col items-center text-center space-y-4 border-2 ${themes[contact.theme]}`}>
                            <div className="p-4 rounded-2xl bg-white shadow-sm">
                                <contact.icon size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{contact.name}</h3>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-normal">
                                    {contact.description}
                                </p>
                            </div>
                            <a 
                                href={`tel:${contact.number}`}
                                className={`w-full py-4 rounded-2xl text-white font-black text-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl ${btnThemes[contact.theme]}`}
                            >
                                <Phone size={24} />
                                {contact.number}
                            </a>
                        </div>
                    );
                })}
            </div>

            {/* Life-Saving Protocols */}
            <div className="grid lg:grid-cols-2 gap-10">
                {protocols.map((protocol, i) => (
                    <div key={i} className={`card-premium overflow-hidden border-2 ${protocol.type === 'positive' ? 'border-emerald-100' : 'border-rose-100'}`}>
                        <div className={`p-6 flex items-center gap-4 ${protocol.type === 'positive' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                            {protocol.type === 'positive' ? <Activity size={24} /> : <AlertTriangle size={24} />}
                            <h3 className="text-xl font-black uppercase tracking-tighter">{protocol.title}</h3>
                        </div>
                        <div className="p-8 space-y-6">
                            {protocol.steps.map((step, si) => (
                                <div key={si} className="flex gap-4 group">
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${protocol.type === 'positive' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                        {si + 1}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-800 leading-none group-hover:text-emerald-700 transition-colors">{step.text}</h4>
                                        <p className="text-xs font-medium text-slate-500 leading-relaxed">{step.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation & Safety Insight */}
            <div className="card-premium p-10 bg-slate-50 border-slate-200">
                <div className="flex flex-col lg:flex-row items-center gap-10">
                    <div className="lg:w-1/3">
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 max-w-sm mx-auto">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Live Insights</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="text-xs font-bold text-slate-600">Response Priority</span>
                                    <span className="text-xs font-black text-rose-600 uppercase">Critical</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="text-xs font-bold text-slate-600">Identification</span>
                                    <span className="text-xs font-black text-emerald-600 uppercase">Automated</span>
                                </div>
                            </div>
                            <button className="w-full mt-6 btn-primary flex items-center justify-center gap-2">
                                <Navigation size={18} />
                                <span>Find Nearest Clinic</span>
                            </button>
                        </div>
                    </div>
                    <div className="lg:w-2/3 space-y-6">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Prevention Strategy</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Sri Lanka's agricultural and forest regions present specific challenges. Our preemptive safety measures are designed by herpetology experts to minimize encounter risks during high-activity periods.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { title: "Dawn/Dusk Alerts", desc: "Highest snake activity happens during low-light transitions." },
                                { title: "Tactical Gear", desc: "Boots and thick trousers provide 70%+ bite protection." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <Clock className="text-emerald-500 shrink-0" size={20} />
                                    <div>
                                        <h5 className="font-bold text-slate-800 text-sm">{item.title}</h5>
                                        <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

