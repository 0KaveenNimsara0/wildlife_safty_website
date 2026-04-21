import React from 'react';
import { AlertTriangle, BookOpen, UploadCloud, XCircle, Languages, HeartPulse, Users, Globe, MapPin, CheckCircle, Database, Shield } from 'lucide-react';

const PredictionCard = ({ title, content, icon: Icon, colorTheme }) => (
    <div className="card-premium p-6 group">
        <div className="flex items-center mb-4">
            <div className={`p-2.5 rounded-xl ${colorTheme.bg} transition-transform duration-300 group-hover:scale-110`}>
                <Icon className={`w-5 h-5 ${colorTheme.icon}`} />
            </div>
            <h3 className="font-bold text-slate-800 ml-3 text-base">{title}</h3>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed font-medium">{content || 'Data Unavailable'}</p>
    </div>
);

const PredictionResults = ({ prediction, imageURL, onReset }) => {
    const themes = {
        info: { bg: 'bg-emerald-50/50', icon: 'text-emerald-600' },
        warning: { bg: 'bg-rose-50/50', icon: 'text-rose-600' },
        neutral: { bg: 'bg-slate-50/50', icon: 'text-slate-600' },
        accent: { bg: 'bg-sky-50/50', icon: 'text-sky-600' }
    };

    const isNotSnake = prediction.ClassName === 'Not_Snake';

    if (isNotSnake) {
        return (
            <div className="space-y-8 animate-fade-in max-w-4xl mx-auto text-center py-12">
                <div className="mx-auto w-fit p-6 rounded-[2.5rem] bg-amber-100 text-amber-600 shadow-xl shadow-amber-500/10 mb-8 font-black">
                   <div className="flex flex-col items-center">
                    <AlertTriangle size={64} className="mb-2" />
                    <span className="text-xs uppercase tracking-[0.3em]">Detection Empty</span>
                   </div>
                </div>
                
                <div className="space-y-4">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">No Snake Identified</h2>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Our neural network analyzed the visual patterns but could not confirm the presence of a snake. 
                        Please provide a clearer image of a Sri Lankan snake for more accurate results.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-10 pt-10">
                    <div className="card-premium overflow-hidden border-0 shadow-2xl w-full max-w-sm group">
                        <img src={imageURL} alt="Analyzed Sample" className="w-full h-64 object-cover opacity-50 grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100" />
                        <div className="p-4 bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            Processed Input Sample
                        </div>
                    </div>

                    <button 
                        onClick={onReset} 
                        className="btn-primary flex items-center gap-4 px-12 py-6 text-xl shadow-2xl shadow-emerald-600/40 rounded-[2rem] active:scale-95 transition-transform"
                    >
                        <UploadCloud size={28} />
                        <span>Upload Another Image</span>
                    </button>
                    
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                        Tip: Ensure good lighting and a clear view of the snake's head/body pattern.
                    </p>
                </div>
            </div>
        );
    }

    const isVenomous = prediction.Venom?.toLowerCase().includes('venomous') && !prediction.Venom?.toLowerCase().includes('non');

    return (
        <div className="space-y-12 animate-fade-in max-w-6xl mx-auto">
            {/* Hero Header */}
            <div className="text-center space-y-4">
                <div className={`mx-auto w-fit p-4 rounded-full mb-6 ${isVenomous ? 'bg-rose-100 text-rose-600 shadow-xl shadow-rose-500/20' : 'bg-emerald-100 text-emerald-600 shadow-xl shadow-emerald-500/20'}`}>
                    {isVenomous ? <AlertTriangle size={48} /> : <CheckCircle size={48} />}
                </div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tight">Analysis Report</h2>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-black uppercase tracking-widest">{prediction.ClassName}</span>
                    <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-black uppercase tracking-widest">{prediction.Confidence} Confidence</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Visual Analysis */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="card-premium overflow-hidden border-0 shadow-2xl">
                        <img src={imageURL} alt="Result" className="w-full h-[500px] object-cover" />
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Species Identified</span>
                                <span className="text-xl font-bold">{prediction.CommonEnglishNames}</span>
                            </div>
                            <button onClick={onReset} className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors">
                                <UploadCloud size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data Matrix */}
                <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 h-fit">
                    <PredictionCard title="English Name" content={prediction.CommonEnglishNames} icon={Languages} colorTheme={themes.info} />
                    <PredictionCard title="Scientific Data" content={prediction.ScientificName} icon={BookOpen} colorTheme={themes.info} />
                    <PredictionCard title="Species Family" content={prediction.Family} icon={Users} colorTheme={themes.accent} />
                    <PredictionCard 
                        title="Toxicity Level" 
                        content={prediction.Venom} 
                        icon={AlertTriangle} 
                        colorTheme={isVenomous ? themes.warning : themes.info} 
                    />
                    <PredictionCard title="Regional Names" content={prediction.LocalNames} icon={MapPin} colorTheme={themes.neutral} />
                    <PredictionCard title="Endemicity" content={prediction.EndemicStatus} icon={Globe} colorTheme={themes.neutral} />
                    <div className="sm:col-span-2">
                        <PredictionCard title="Conservation Status" content={prediction.ConservationStatus} icon={Shield} colorTheme={themes.accent} />
                    </div>
                </div>
            </div>

            {/* Detailed Description */}
            <div className="card-premium p-10 space-y-6">
                <div className="flex items-center space-x-3 text-slate-800 border-b border-slate-100 pb-4">
                    <Database className="text-emerald-500" />
                    <h3 className="text-xl font-bold">Biometric Profile</h3>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium text-lg italic bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    "{prediction.Description}"
                </p>
                <div className="grid md:grid-cols-2 gap-8 pt-6">
                    <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
                        <div className="flex items-center space-x-3 text-emerald-700 mb-4">
                            <HeartPulse size={24} />
                            <h4 className="text-lg font-black uppercase tracking-tighter">Emergency Protocol</h4>
                        </div>
                        <p className="text-emerald-900/70 font-medium text-sm leading-[1.8]">
                            {prediction.Treatment}
                        </p>
                    </div>
                    <div className="bg-amber-50/50 p-8 rounded-3xl border border-amber-100">
                        <div className="flex items-center space-x-3 text-amber-700 mb-4">
                            <AlertTriangle size={24} />
                            <h4 className="text-lg font-black uppercase tracking-tighter">Medical Disclaimer</h4>
                        </div>
                        <p className="text-amber-900/70 font-medium text-[13px] leading-relaxed uppercase tracking-tight">
                            SYSTEM IDENTIFICATION IS EDUCATIONAL. IN THE EVENT OF A BITE, IMMEDIATELY SUSPEND ALL NON-EMERGENCY ACTIONS AND TELEPHONE ACCREDITED MEDICAL FACILITIES. DO NOT DELAY FOR RESULTS.
                        </p>
                    </div>
                </div>
            </div>

            <div className="text-center pt-8">
                <button onClick={onReset} className="btn-primary px-16 py-5 text-lg shadow-2xl shadow-emerald-600/30">
                    Analyze New Sample
                </button>
            </div>
        </div>
    );
};

export default PredictionResults;
