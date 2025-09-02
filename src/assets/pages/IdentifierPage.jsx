// IdentifierPage.jsx
import React, { useState, useRef, useCallback } from 'react';
import { Camera, Shield, AlertTriangle, BookOpen, UploadCloud, XCircle, Loader2, Languages, HeartPulse, Leaf, Trash2, Users, Globe, MapPin, CheckCircle } from 'lucide-react';

// A more refined Error Card with the new theme
const ErrorCard = ({ message, onClear }) => (
    <div className="w-full p-4 rounded-lg shadow-md bg-rose-100 border-l-4 border-rose-500 animate-fade-in">
        <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 text-rose-600 shrink-0" />
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-rose-900 mb-1">An Error Occurred</h3>
                <p className="text-md text-rose-800">{message}</p>
            </div>
            <button onClick={onClear} className="ml-4 text-rose-600 hover:text-rose-800 transition-colors">
                <XCircle size={24} />
            </button>
        </div>
    </div>
);

// Updated PredictionCard with hover effects for better interactivity
const PredictionCard = ({ title, content, icon: Icon, colorTheme }) => (
    <div className={`border-l-4 ${colorTheme.border} p-6 rounded-lg shadow-sm h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white`}>
        <div className="flex items-center mb-3">
            <div className={`p-2 rounded-full ${colorTheme.bg}`}>
                <Icon className={`w-5 h-5 ${colorTheme.icon}`} />
            </div>
            <h3 className={`font-bold text-lg ml-3 ${colorTheme.header}`}>{title}</h3>
        </div>
        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{content || 'N/A'}</p>
    </div>
);

// Revamped UploadArea with Drag-and-Drop functionality
const UploadArea = ({ onImageSelect, onPredict, isLoading, imageFile, imageURL, clearImage }) => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            onImageSelect(file);
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 w-full">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                    <div
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`relative aspect-square border-2 border-dashed rounded-lg flex items-center justify-center bg-slate-50 overflow-hidden transition-all duration-300 ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'}`}
                    >
                        {imageURL ? (
                            <>
                                <img src={imageURL} alt="Uploaded Snake" className="object-cover w-full h-full" />
                                <button
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                                    aria-label="Remove image"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </>
                        ) : (
                            <div className="text-center text-slate-500 p-4">
                                <UploadCloud className="mx-auto h-12 w-12" />
                                <p className="mt-2 font-semibold">Drag & drop an image here</p>
                                <p className="text-sm">or click to select a file</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col items-center text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Identify a Snake</h2>
                    <p className="mb-6 text-slate-500">Upload a clear JPG or PNG image for the most accurate result.</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => onImageSelect(e.target.files[0])}
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="bg-slate-200 text-slate-800 font-bold py-3 px-8 rounded-full hover:bg-slate-300 transition-transform transform hover:scale-105 shadow-sm flex items-center gap-2 mb-4"
                    >
                        <Camera size={20} />
                        {imageFile ? 'Change Image' : 'Choose an Image'}
                    </button>
                    <button
                        onClick={onPredict}
                        disabled={isLoading || !imageFile}
                        className="bg-emerald-600 text-white font-bold py-4 px-10 rounded-full hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center w-64 h-16"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={24} />
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            'Identify Snake'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Refined PredictionResults with the new green theme
const PredictionResults = ({ prediction, imageURL, onReset }) => {
    const themes = {
        info: { border: 'border-cyan-500', header: 'text-cyan-800', icon: 'text-cyan-600', bg: 'bg-cyan-100' },
        warning: { border: 'border-red-500', header: 'text-red-800', icon: 'text-red-600', bg: 'bg-red-100' },
        neutral: { border: 'border-slate-400', header: 'text-slate-800', icon: 'text-slate-600', bg: 'bg-slate-100' },
        success: { border: 'border-emerald-500', header: 'text-emerald-800', icon: 'text-emerald-600', bg: 'bg-emerald-100' },
        conservation: { border: 'border-amber-500', header: 'text-amber-800', icon: 'text-amber-600', bg: 'bg-amber-100' },
        treatment: { border: 'border-blue-500', header: 'text-blue-800', icon: 'text-blue-600', bg: 'bg-blue-100' }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 w-full animate-fade-in">
            <div className="text-center mb-6">
                <CheckCircle className="mx-auto h-12 w-12 mb-2 text-emerald-600" />
                <h2 className="text-3xl font-bold text-slate-800">Identification Result</h2>
                <p className="text-slate-600 mt-1">Identified as <strong className="text-emerald-700">{prediction.ClassName}</strong> with {prediction.Confidence} confidence.</p>
            </div>

            <div className="mb-6">
                <img src={imageURL} alt="Identified Snake" className="rounded-lg object-cover w-full h-auto max-h-96 shadow-md border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <PredictionCard title="Common Name" content={prediction.CommonEnglishNames} icon={Languages} colorTheme={themes.info} />
                <PredictionCard title="Scientific Name" content={prediction.ScientificName} icon={BookOpen} colorTheme={themes.info} />
                <PredictionCard title="Family" content={prediction.Family} icon={Users} colorTheme={themes.success} />
                <PredictionCard title="Venom" content={prediction.Venom} icon={AlertTriangle} colorTheme={themes.warning} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <PredictionCard title="Local Names" content={prediction.LocalNames} icon={MapPin} colorTheme={themes.neutral} />
                <PredictionCard title="Endemic Status" content={prediction.EndemicStatus} icon={Globe} colorTheme={themes.neutral} />
                <PredictionCard title="Conservation Status" content={prediction.ConservationStatus} icon={Shield} colorTheme={themes.conservation} />
            </div>

            <div className="mb-6">
                <PredictionCard title="Description" content={prediction.Description} icon={BookOpen} colorTheme={themes.neutral} />
            </div>

            <div className="p-4 bg-amber-100 border-l-4 border-amber-500 rounded-lg mb-6">
                <div className="flex items-start">
                    <AlertTriangle className="w-8 h-8 text-amber-600 mr-3 shrink-0" />
                    <div>
                        <h4 className="font-bold text-amber-800">Medical Disclaimer</h4>
                        <p className="text-sm text-amber-700">This information is for educational purposes only and is not a substitute for professional medical advice. **ALWAYS seek immediate medical attention for any snake bite.**</p>
                    </div>
                </div>
            </div>

            <div>
                <PredictionCard title="First-Aid & Treatment" content={prediction.Treatment} icon={HeartPulse} colorTheme={themes.treatment} />
            </div>

            <div className="text-center pt-8 mt-8 border-t border-slate-200">
                <button onClick={onReset} className="font-bold py-3 px-10 rounded-full text-white transition-all transform hover:scale-105 shadow-lg bg-emerald-600 hover:bg-emerald-700">
                    Analyze Another Image
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
            URL.revokeObjectURL(imageURL); // Clean up object URL to prevent memory leaks
            setImageURL(null);
            setImageFile(null);
            setPrediction(null);
        }
    }, [imageURL]);

    const handleImageSelect = useCallback((file) => {
        if (!file) return;

        clearState(true);

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setError(`Invalid file type. Please select a JPG or PNG image.`);
            return;
        }

        setImageFile(file);
        setImageURL(URL.createObjectURL(file));
    }, [clearState]);

    const clearImage = () => {
        URL.revokeObjectURL(imageURL);
        setImageFile(null);
        setImageURL(null);
    }

    const makePrediction = async () => {
        if (!imageFile) {
            setError("Please select an image first.");
            return;
        }
        clearState(false);
        setIsLoading(true);

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const backendUrl = 'http://127.0.0.1:5000/predict';
            const response = await fetch(backendUrl, { method: 'POST', body: formData });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `An API error occurred: ${response.status}`);
            }

            setPrediction(data);
        } catch (err) {
            console.error("Prediction API error:", err);
            setError(err.message || "An unknown error occurred. Please check your network and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50/70 text-slate-800 p-4 sm:p-8 flex flex-col items-center font-sans">
            <div className="w-full max-w-4xl">
                <header className="text-center mb-8">
                    <Leaf className="mx-auto h-12 w-12 mb-2 text-emerald-700" />
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-2">
                        Snake Identifier
                    </h1>
                    <p className="text-lg text-slate-600">Upload an image to identify a snake species using AI.</p>
                </header>

                <main className="space-y-6">
                    {error && <ErrorCard message={error} onClear={() => clearState(true)} />}

                    {!prediction ? (
                        <UploadArea
                            onImageSelect={handleImageSelect}
                            onPredict={makePrediction}
                            isLoading={isLoading}
                            imageFile={imageFile}
                            imageURL={imageURL}
                            clearImage={clearImage}
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