// IdentifierPage.jsx
import React, { useState, useRef } from 'react';
import { Camera, Shield, AlertTriangle, BookOpen, UploadCloud, XCircle, Loader2, Languages, HeartPulse, Leaf, Trash2, Users, Globe, MapPin } from 'lucide-react';

const ErrorCard = ({ message, onClear }) => (
    <div className="w-full p-4 rounded-lg shadow-md bg-red-100 border-l-4 border-red-500 animate-fade-in">
        <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 text-red-600" />
            <div className="flex-grow">
                <h3 className="font-bold text-lg mb-1">An Error Occurred</h3>
                <p className="text-md text-red-800">{message}</p>
            </div>
            <button onClick={onClear} className="ml-4 text-red-600 hover:text-red-800">
                <XCircle size={24} />
            </button>
        </div>
    </div>
);

const PredictionCard = ({ title, content, icon: Icon, colorTheme }) => (
    <div className={`bg-gradient-to-r ${colorTheme.from} ${colorTheme.to} border-l-4 ${colorTheme.border} p-6 rounded-lg shadow-sm animate-slide-up h-full`}>
        <div className="flex items-center mb-3">
            <Icon className={`w-6 h-6 ${colorTheme.text} mr-3`} />
            <h3 className={`font-bold text-xl ${colorTheme.header}`}>{title}</h3>
        </div>
        <p className={`${colorTheme.text} leading-relaxed whitespace-pre-wrap`}>{content || 'N/A'}</p>
    </div>
);

const UploadArea = ({ onImageSelect, onPredict, isLoading, imageFile, imageURL, clearImage }) => {
    const fileInputRef = useRef(null);
    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 w-full">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                    <div className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                        {imageURL ? (
                            <>
                                <img src={imageURL} alt="Uploaded Snake" className="object-cover w-full h-full" />
                                <button
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                                    aria-label="Remove image"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </>
                        ) : (
                            <div className="text-center text-gray-500 p-4">
                                <UploadCloud className="mx-auto h-12 w-12" />
                                <p className="mt-2">Image preview will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col items-center text-center">
                    <h2 className="text-2xl font-bold mb-4">Upload Your Image</h2>
                    <p className="mb-6 text-gray-500">Select a JPG or PNG file from your device to identify the snake.</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onImageSelect}
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md flex items-center gap-2 mb-4"
                    >
                        <Camera size={20} />
                        {imageFile ? 'Change Image' : 'Choose an Image'}
                    </button>
                    <button
                        onClick={onPredict}
                        disabled={isLoading || !imageFile}
                        className="bg-green-600 text-white font-bold py-4 px-10 rounded-full hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center w-64 h-16"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Identify Snake'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PredictionResults = ({ prediction, imageURL, onReset }) => {
    const themes = {
        info: { from: 'from-blue-50', to: 'to-blue-100', border: 'border-blue-500', text: 'text-blue-700', header: 'text-blue-800' },
        warning: { from: 'from-red-50', to: 'to-red-100', border: 'border-red-500', text: 'text-red-700', header: 'text-red-800' },
        neutral: { from: 'from-gray-50', to: 'to-gray-100', border: 'border-gray-400', text: 'text-gray-700', header: 'text-gray-800' },
        success: { from: 'from-emerald-50', to: 'to-emerald-100', border: 'border-emerald-500', text: 'text-emerald-700', header: 'text-emerald-800' },
        conservation: { from: 'from-yellow-50', to: 'to-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', header: 'text-yellow-800' },
        treatment: { from: 'from-teal-50', to: 'to-teal-100', border: 'border-teal-500', text: 'text-teal-700', header: 'text-teal-800' }
    };
    
    return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full animate-fade-in">
        <h2 className="text-center text-3xl font-bold mb-2">Identification Result</h2>
        <p className="text-center text-gray-600 mb-6">Identified as <strong className="text-green-700">{prediction.ClassName}</strong> with {prediction.Confidence} confidence.</p>
        
        <div className="mb-6">
            <img src={imageURL} alt="Identified Snake" className="rounded-lg object-cover w-full h-auto max-h-96 shadow-md" />
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
            <div className="flex items-center">
                <AlertTriangle className="w-10 h-10 text-amber-600 mr-3 shrink-0" />
                <div>
                    <h4 className="font-bold text-amber-800">Medical Disclaimer</h4>
                    <p className="text-sm text-amber-700">This information is for guidance only and is not a substitute for professional medical advice. **ALWAYS seek immediate medical attention for any snake bite.**</p>
                </div>
            </div>
        </div>
        <div>
            <PredictionCard title="First-Aid & Treatment" content={prediction.Treatment} icon={HeartPulse} colorTheme={themes.treatment} />
        </div>

        <div className="text-center pt-8 mt-8 border-t border-gray-200">
            <button onClick={onReset} className="font-bold py-4 px-10 rounded-full text-white transition-all transform hover:scale-105 shadow-lg bg-green-600 hover:bg-green-700">
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

    const clearState = (fullReset = true) => {
        setIsLoading(false);
        setError(null);
        if (fullReset) {
            setImageURL(null);
            setImageFile(null);
            setPrediction(null);
        }
    };

    const handleImageUpload = (event) => {
        clearState(true); 
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setError(`Invalid file type. Please select a JPG or PNG image.`);
            setImageFile(null);
            setImageURL(null);
            if (event.target) event.target.value = null; 
            return;
        }
        
        setImageFile(file);
        setImageURL(URL.createObjectURL(file));
    };

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
        <div className="min-h-screen bg-green-50/50 text-gray-800 p-4 sm:p-8 flex flex-col items-center font-sans">
            <div className="w-full max-w-4xl">
                <header className="text-center mb-8">
                    <Leaf className="mx-auto h-12 w-12 mb-2 text-green-700" />
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
                        Snake Identifier
                    </h1>
                    <p className="text-lg text-gray-600">Upload an image to identify a snake species using AI.</p>
                </header>

                <main className="space-y-6">
                    {error && <ErrorCard message={error} onClear={() => clearState(true)} />}

                    {!prediction ? (
                        <UploadArea 
                            onImageSelect={handleImageUpload}
                            onPredict={makePrediction}
                            isLoading={isLoading}
                            imageFile={imageFile}
                            imageURL={imageURL}
                            clearImage={() => {setImageFile(null); setImageURL(null);}}
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