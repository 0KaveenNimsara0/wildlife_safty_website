import React, { useState, useRef, useEffect } from 'react';
import { Camera, Shield, AlertTriangle, BookOpen, UploadCloud, XCircle, Loader2, Languages, HeartPulse, Leaf, Trash2 } from 'lucide-react';

// --- Theme Configuration ---
// Centralizing theme colors for easy customization and consistency.
const colors = {
    primary: {
        bg: 'bg-green-600',
        hoverBg: 'hover:bg-green-700',
        textDark: 'text-green-700',
        border: 'border-green-500',
        gradientFrom: 'from-green-50',
        gradientTo: 'to-green-100',
        header: 'text-green-800',
    },
    warning: {
        bg: 'bg-red-100',
        border: 'border-red-500',
        text: 'text-red-800',
        icon: 'text-red-600',
        hoverIcon: 'hover:text-red-800',
        gradientFrom: 'from-red-50',
        gradientTo: 'to-red-100',
    },
    info: {
        gradientFrom: 'from-blue-50',
        gradientTo: 'to-blue-100',
        border: 'border-blue-500',
        text: 'text-blue-700',
        header: 'text-blue-800',
    },
    neutral: {
        gradientFrom: 'from-gray-50',
        gradientTo: 'to-gray-100',
        border: 'border-gray-400',
        text: 'text-gray-700',
        header: 'text-gray-800',
    }
};

// --- Reusable UI Components ---

const ErrorCard = ({ message, onClear }) => (
    <div className={`w-full p-4 rounded-lg shadow-md ${colors.warning.bg} border-l-4 ${colors.warning.border} animate-fade-in`}>
        <div className="flex items-center">
            <AlertTriangle className={`w-6 h-6 mr-3 ${colors.warning.icon}`} />
            <div className="flex-grow">
                <h3 className="font-bold text-lg mb-1">An Error Occurred</h3>
                <p className={`text-md ${colors.warning.text}`}>{message}</p>
            </div>
            <button onClick={onClear} className={`ml-4 ${colors.warning.icon} ${colors.warning.hoverIcon}`}>
                <XCircle size={24} />
            </button>
        </div>
    </div>
);

const PredictionCard = ({ title, content, icon: Icon, colorTheme }) => (
    <div className={`bg-gradient-to-r ${colorTheme.gradientFrom} ${colorTheme.gradientTo} border-l-4 ${colorTheme.border} p-6 rounded-lg shadow-sm animate-slide-up`}>
        <div className="flex items-center mb-3">
            <Icon className={`w-6 h-6 ${colorTheme.text} mr-3`} />
            <h3 className={`font-bold text-xl ${colorTheme.header}`}>{title}</h3>
        </div>
        <p className={`${colorTheme.text} leading-relaxed whitespace-pre-wrap`}>{content}</p>
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
                        className={`${colors.primary.bg} text-white font-bold py-4 px-10 rounded-full ${colors.primary.hoverBg} transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center w-64 h-16`}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Identify Snake'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PredictionResults = ({ prediction, imageURL, onReset }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full animate-fade-in">
        <h2 className="text-center text-3xl font-bold mb-2">Identification Result</h2>
        <p className="text-center text-gray-600 mb-6">Identified as <strong className={colors.primary.textDark}>{prediction.ClassName}</strong> with {prediction.Confidence} confidence.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <img src={imageURL} alt="Identified Snake" className="rounded-lg object-cover w-full h-auto max-h-96 shadow-md" />
            </div>
            <PredictionCard title="Species Name" content={`${prediction.ClassName} (${prediction.ScientificName})`} icon={Languages} colorTheme={colors.info} />
            <PredictionCard title="Venom" content={prediction.Venomous} icon={AlertTriangle} colorTheme={{...colors.warning, text: 'text-red-700', header: 'text-red-800'}} />
            <div className="md:col-span-2">
                <PredictionCard title="Description" content={prediction.Description} icon={BookOpen} colorTheme={colors.neutral} />
            </div>
            <div className="md:col-span-2">
                <PredictionCard title="Conservation Status" content={prediction.ConservationStatus} icon={Shield} colorTheme={{gradientFrom: 'from-yellow-50', gradientTo: 'to-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', header: 'text-yellow-800'}} />
            </div>
            <div className="md:col-span-2 p-4 bg-amber-100 border-l-4 border-amber-500 rounded-lg">
                <div className="flex items-center">
                    <AlertTriangle className="w-10 h-10 text-amber-600 mr-3 shrink-0" />
                    <div>
                        <h4 className="font-bold text-amber-800">Medical Disclaimer</h4>
                        <p className="text-sm text-amber-700">This information is for first-aid guidance only. It is not a substitute for professional medical advice. **ALWAYS seek immediate medical attention for any snake bite.**</p>
                    </div>
                </div>
            </div>
            <div className="md:col-span-2">
                <PredictionCard title="First-Aid & Treatment" content={prediction.Treatment} icon={HeartPulse} colorTheme={{gradientFrom: 'from-teal-50', gradientTo: 'to-teal-100', border: 'border-teal-500', text: 'text-teal-700', header: 'text-teal-800'}} />
            </div>
        </div>
        <div className="text-center pt-8 mt-8 border-t border-gray-200">
            <button onClick={onReset} className={`font-bold py-4 px-10 rounded-full text-white transition-all transform hover:scale-105 shadow-lg ${colors.primary.bg} ${colors.primary.hoverBg}`}>
                Analyze Another Image
            </button>
        </div>
    </div>
);

// --- Main Page Component ---
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
        clearState(); 
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setError(`Invalid file type. Please select a JPG or PNG image.`);
            setImageFile(null);
            setImageURL(null);
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
        clearState(false); // Clear previous errors/loading but keep image
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
                    <Leaf className={`mx-auto h-12 w-12 mb-2 ${colors.primary.textDark}`} />
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
                        Snake Identifier
                    </h1>
                    <p className="text-lg text-gray-600">Upload an image to identify a snake species using AI.</p>
                </header>

                <main>
                    {error && <div className="mb-6"><ErrorCard message={error} onClear={() => clearState(true)} /></div>}

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