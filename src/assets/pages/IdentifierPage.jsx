// IdentifierPage.jsx
import React, { useState, useRef, useCallback } from 'react';
import { Camera, Shield, AlertTriangle, BookOpen, UploadCloud, XCircle, Loader2, Languages, HeartPulse, Leaf, Trash2, Users, Globe, MapPin, CheckCircle, Sparkles, Database, Activity } from 'lucide-react';

const ErrorCard = ({ message, onClear }) => (
    <div className="w-full p-5 rounded-2xl bg-rose-50 border border-rose-100 shadow-sm animate-fade-in mb-6">
        <div className="flex items-center">
            <div className="bg-rose-500 p-2 rounded-xl mr-4">
                <AlertTriangle className="w-5 h-5 text-white shrink-0" />
            </div>
            <div className="flex-grow">
                <h3 className="font-black text-sm uppercase tracking-widest text-rose-900 mb-1">System Error</h3>
                <p className="text-sm font-medium text-rose-800">{message}</p>
            </div>
            <button onClick={onClear} className="p-2 text-rose-400 hover:text-rose-600 transition-colors">
                <XCircle size={20} />
            </button>
        </div>
    </div>
);

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

const UploadArea = ({ onImageSelect, onPredict, isLoading, imageFile, imageURL, clearImage }) => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = (e, state) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(state);
    };

    const handleDrop = (e) => {
        handleDrag(e, false);
        const file = e.dataTransfer.files[0];
        if (file) onImageSelect(file);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-stretch animate-fade-in">
            {/* Left: Interactive Dropzone */}
            <div
                onDragEnter={(e) => handleDrag(e, true)}
                onDragOver={(e) => handleDrag(e, true)}
                onDragLeave={(e) => handleDrag(e, false)}
                onDrop={handleDrop}
                className={`relative group aspect-square lg:aspect-auto min-h-[400px] border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center p-8 transition-all duration-500 overflow-hidden ${
                    isDragging 
                        ? 'border-emerald-500 bg-emerald-50/50 scale-[1.02] shadow-2xl shadow-emerald-500/10' 
                        : 'border-slate-200 bg-white/50 hover:border-emerald-400 hover:bg-emerald-50/20'
                }`}
            >
                {imageURL ? (
                    <>
                        <img src={imageURL} alt="Subject" className="absolute inset-0 object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-colors duration-300" />
                        <button
                            onClick={clearImage}
                            className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md text-rose-500 rounded-2xl shadow-xl hover:bg-rose-500 hover:text-white transition-all duration-300 transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                        >
                            <Trash2 size={20} />
                        </button>
                    </>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="bg-emerald-100 p-6 rounded-[2rem] w-fit mx-auto shadow-sm group-hover:scale-110 transition-transform duration-500">
                            <UploadCloud className="w-12 h-12 text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xl font-black text-slate-800 tracking-tight">Image Submission</h4>
                            <p className="text-slate-500 text-sm font-medium">Drag-and-drop or select manually</p>
                        </div>
                        <div className="pt-4 flex justify-center">
                            <div className="w-10 h-[2px] bg-slate-200 rounded-full" />
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Controls Area */}
            <div className="flex flex-col justify-center space-y-8 p-4 lg:p-8">
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-emerald-600">
                        <Sparkles size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">AI Vision Engine</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                        Identify Species <br/> with <span className="text-emerald-600 underline decoration-emerald-200 decoration-8 underline-offset-4">Confidence</span>
                    </h2>
                    <p className="text-lg text-slate-500 font-medium max-w-md">Our neural network analyzes distinctive patterns to provide accurate Sri Lankan snake identification.</p>
                </div>

                <div className="space-y-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => onImageSelect(e.target.files[0])}
                        className="hidden"
                        accept="image/*"
                    />
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="btn-secondary flex-1 py-4 flex items-center justify-center gap-3 border-2"
                        >
                            <Camera size={20} />
                            <span>{imageFile ? 'Repick Image' : 'Select Source'}</span>
                        </button>
                        
                        <button
                            onClick={onPredict}
                            disabled={isLoading || !imageFile}
                            className="btn-primary flex-[1.5] py-4 h-16 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-xl shadow-emerald-600/20"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Initiate Scan</span>
                                    <Activity size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Info Badges */}
                <div className="flex items-center gap-6 pt-4">
                    <div className="flex items-center space-x-2">
                        <Database className="text-slate-400" size={16} />
                        <span className="text-xs font-bold text-slate-500">Global Database</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Shield className="text-slate-400" size={16} />
                        <span className="text-xs font-bold text-slate-500">Privacy Secure</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PredictionResults = ({ prediction, imageURL, onReset }) => {
    const themes = {
        info: { bg: 'bg-emerald-50/50', icon: 'text-emerald-600' },
        warning: { bg: 'bg-rose-50/50', icon: 'text-rose-600' },
        neutral: { bg: 'bg-slate-50/50', icon: 'text-slate-600' },
        accent: { bg: 'bg-sky-50/50', icon: 'text-sky-600' }
    };

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
                                <Trash2 size={20} />
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

export default function IdentifierPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [imageURL, setImageURL] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    const clearState = useCallback((fullReset = true) => {
        setIsLoading(false);
        setError(null);
        if (fullReset) {
            if (imageURL) URL.revokeObjectURL(imageURL);
            setImageURL(null);
            setImageFile(null);
            setPrediction(null);
        }
    }, [imageURL]);

    const handleImageSelect = useCallback((file) => {
        if (!file) return;
        clearState(true);
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            setError(`Format Not Supported. Please use JPG or PNG.`);
            return;
        }
        setImageFile(file);
        setImageURL(URL.createObjectURL(file));
    }, [clearState]);

    const makePrediction = async () => {
        if (!imageFile) return setError("Select an image to analyze.");
        clearState(false);
        setIsLoading(true);

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await fetch('http://127.0.0.1:5000/predict', { method: 'POST', body: formData });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || `Error ${response.status}`);
            setPrediction(data);
        } catch (err) {
            setError(err.message || "Engine Connection Failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-16 px-4">
            <div className="container mx-auto max-w-7xl">
                {!prediction && (
                    <header className="text-center mb-16 space-y-4 animate-fade-in">
                        <div className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-[0.2em] w-fit mx-auto shadow-sm">
                            V2.0 Core Engine
                        </div>
                        <h1 className="text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter">
                            WildSafe <span className="text-emerald-600">ID</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                            The world's most advanced Sri Lankan snake identification system, powered by high-precision neural networks.
                        </p>
                    </header>
                )}

                <main className="relative">
                    {error && <ErrorCard message={error} onClear={() => clearState(true)} />}

                    {!prediction ? (
                        <UploadArea
                            onImageSelect={handleImageSelect}
                            onPredict={makePrediction}
                            isLoading={isLoading}
                            imageFile={imageFile}
                            imageURL={imageURL}
                            clearImage={() => { URL.revokeObjectURL(imageURL); setImageFile(null); setImageURL(null); }}
                        />
                    ) : (
                        <PredictionResults
                            prediction={prediction}
                            imageURL={imageURL}
                            onReset={() => clearState(true)}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}