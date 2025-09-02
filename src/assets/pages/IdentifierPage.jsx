import React, { useState, useRef, useEffect } from 'react';
import { Camera, Shield, AlertTriangle, BookOpen, UploadCloud, XCircle, Loader2, Languages, HeartPulse, Leaf } from 'lucide-react';

// --- Theme Configuration ---
// Centralizing theme colors for easy customization.
const THEME = {
    primary: 'green',
    warning: 'red',
    info: 'blue',
    neutral: 'gray',
};

const colors = {
    primary: {
        bg: `bg-${THEME.primary}-600`,
        hoverBg: `hover:bg-${THEME.primary}-700`,
        text: `text-white`,
        gradientFrom: `from-${THEME.primary}-50`,
        gradientTo: `to-${THEME.primary}-100`,
        border: `border-${THEME.primary}-500`,
        textDark: `text-${THEME.primary}-700`,
        header: `text-${THEME.primary}-800`,
    },
    warning: {
        bg: `bg-${THEME.warning}-100`,
        border: `border-${THEME.warning}-500`,
        text: `text-${THEME.warning}-800`,
        icon: `text-${THEME.warning}-600`,
        hoverIcon: `hover:text-${THEME.warning}-800`,
        gradientFrom: 'from-red-50',
        gradientTo: 'to-red-100',
        textDark: 'text-red-700',
        header: 'text-red-800',
    },
    // Add other color schemes as needed
};


// --- Reusable UI Components ---

/**
 * A card component to display error messages.
 */
const ErrorCard = ({ message, onClear }) => (
    <div className={`${colors.warning.bg} border-l-4 ${colors.warning.border} ${colors.warning.text} p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto animate-fade-in`}>
        <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 mr-4" />
            <div>
                <h3 className="font-bold text-xl mb-1">An Error Occurred</h3>
                <p className="text-md">{message}</p>
            </div>
            <button onClick={onClear} className={`ml-auto ${colors.warning.icon} ${colors.warning.hoverIcon}`}>
                <XCircle size={24} />
            </button>
        </div>
    </div>
);

/**
 * A styled card to display a piece of prediction information.
 */
const PredictionCard = ({ title, content, icon: Icon, colorClass }) => (
    <div className={`bg-gradient-to-br ${colorClass.gradient} border-l-4 ${colorClass.border} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 animate-slide-up`}>
        <div className="flex items-center mb-3">
            <Icon className={`w-7 h-7 ${colorClass.text} mr-4`} />
            <h3 className={`font-bold text-xl ${colorClass.header}`}>{title}</h3>
        </div>
        <p className={`${colorClass.text} leading-relaxed`}>{content}</p>
    </div>
);


// --- Main Application Sections ---

/**
 * The initial view for uploading an image.
 */
const UploadArea = ({ onImageSelect, onPredict, isLoading, imageFile, imageURL, clearImage }) => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageSelect({ target: { files: e.dataTransfer.files } });
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 w-full transition-all duration-300">
            <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}
            >
                {imageURL ? (
                    <>
                        <img src={imageURL} alt="Uploaded Snake" className="object-cover w-full h-80 rounded-lg shadow-inner" />
                        <button
                            onClick={clearImage}
                            className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-colors"
                            aria-label="Clear image"
                        >
                            <XCircle size={24} />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-80 text-gray-500">
                        <UploadCloud className="mx-auto h-16 w-16 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700">Drag & Drop Image Here</h3>
                        <p className="mt-2">or</p>
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="mt-4 bg-white text-green-700 font-semibold py-2 px-6 border border-green-300 rounded-full hover:bg-green-50 transition-colors"
                        >
                            Browse Files
                        </button>
                        <p className="text-xs mt-4 text-gray-400">Supports: JPG, PNG</p>
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={onImageSelect}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
            />
            
            <div className="mt-8 text-center">
                <button
                    onClick={onPredict}
                    disabled={isLoading || !imageFile}
                    className={`font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center w-full max-w-xs mx-auto h-16 text-lg ${colors.primary.bg} ${colors.primary.hoverBg} ${colors.primary.text}`}
                >
                    {isLoading ? <Loader2 className="animate-spin" size={28} /> : 'Identify Snake'}
                </button>
            </div>
        </div>
    );
};

/**
 * The view for displaying prediction results.
 */
const PredictionResults = ({ prediction, imageURL, onReset }) => (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 w-full animate-fade-in">
        <h2 className="text-center text-3xl font-bold mb-2">Identification Result</h2>
        <p className="text-center text-gray-600 mb-6">
            Identified as <strong className={colors.primary.textDark}>{prediction.ClassName}</strong> with {prediction.Confidence} confidence.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <img src={imageURL} alt="Identified Snake" className="rounded-lg object-cover w-full h-auto max-h-96 shadow-md"/>
            </div>

            <PredictionCard title="Species Name" content={`${prediction.ClassName} (${prediction.ScientificName})`} icon={Languages} colorClass={{gradient: 'from-blue-50 to-blue-100', border: 'border-blue-500', text: 'text-blue-700', header: 'text-blue-800'}} />
            <PredictionCard title="Venom" content={prediction.Venomous} icon={AlertTriangle} colorClass={{...colors.warning, text: colors.warning.textDark }} />
            
            <div className="md:col-span-2">
                <PredictionCard title="Description" content={prediction.Description} icon={BookOpen} colorClass={{gradient: 'from-gray-50 to-gray-100', border: 'border-gray-400', text: 'text-gray-700', header: 'text-gray-800'}} />
            </div>
            
            <div className="md:col-span-2">
                <PredictionCard title="Conservation Status" content={prediction.ConservationStatus} icon={Shield} colorClass={{gradient: 'from-yellow-50 to-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', header: 'text-yellow-800'}} />
            </div>

            <div className="md:col-span-2 p-5 bg-amber-100 border-l-4 border-amber-500 rounded-lg">
                <div className="flex items-center">
                    <AlertTriangle className="w-10 h-10 text-amber-600 mr-4 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-amber-800">Medical Disclaimer</h4>
                        <p className="text-sm text-amber-700">This information is for first-aid guidance only. It is not a substitute for professional medical advice. **ALWAYS seek immediate medical attention for any snake bite.**</p>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2">
                <PredictionCard title="First-Aid & Treatment" content={prediction.Treatment} icon={HeartPulse} colorClass={{gradient: 'from-teal-50 to-teal-100', border: 'border-teal-500', text: 'text-teal-700', header: 'text-teal-800'}} />
            </div>
        </div>

        <div className="text-center pt-8 mt-8 border-t border-gray-200">
            <button 
                onClick={onReset} 
                className={`font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white`}
            >
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

    // Clean up the object URL to avoid memory leaks
    useEffect(() => {
        return () => {
            if (imageURL) {
                URL.revokeObjectURL(imageURL);
            }
        };
    }, [imageURL]);

    const clearState = (fullReset = true) => {
        setIsLoading(false);
        if (fullReset) {
            setPrediction(null);
        }
        setError(null);
        setImageURL(null);
        setImageFile(null);
    };

    const handleImageUpload = (event) => {
        clearState(false); // Clear previous image state without clearing prediction
        
        const { files } = event.target;
        if (files && files.length > 0) {
            const file = files[0];
            
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                setError(`Invalid file type. Please select a JPG or PNG image.`);
                clearState();
                return;
            }
            
            const url = URL.createObjectURL(file);
            setImageFile(file);
            setImageURL(url);
        }
    };

    const makePrediction = async () => {
        if (!imageFile) {
            setError("Please select an image first.");
            return;
        }
        setIsLoading(true);
        setPrediction(null);
        setError(null);

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const backendUrl = 'http://127.0.0.1:5000/predict';
            const response = await fetch(backendUrl, {
                method: 'POST',
                body: formData,
            });

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
                    {error && <div className="mb-6"><ErrorCard message={error} onClear={clearState} /></div>}

                    {!prediction ? (
                        <UploadArea 
                            onImageSelect={handleImageUpload}
                            onPredict={makePrediction}
                            isLoading={isLoading}
                            imageFile={imageFile}
                            imageURL={imageURL}
                            clearImage={() => clearState(false)}
                        />
                    ) : (
                        <PredictionResults
                            prediction={prediction}
                            imageURL={imageURL}
                            onReset={clearState}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}