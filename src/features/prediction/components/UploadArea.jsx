import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Activity, Loader2, Sparkles, Database, Shield, Trash2 } from 'lucide-react';

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

export default UploadArea;
