import React, { useState, useRef } from 'react';
import { Camera, Shield, AlertTriangle, Info, BookOpen, Languages } from 'lucide-react';

export default function IdentifierPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [imageURL, setImageURL] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageUpload = (event) => {
        const { files } = event.target;
        if (files.length > 0) {
            const file = files[0];
            const url = URL.createObjectURL(file);
            setImageFile(file);
            setImageURL(url);
            setPrediction(null);
            setError(null);
        }
    };

    const makePrediction = async () => {
        if (!imageFile) {
            setError("No image is selected.");
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
            if (!response.ok) {
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setPrediction(data);
        } catch (err) {
            console.error("Error during prediction:", err);
            setError(`Failed to get prediction. Is the backend server running? Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-4xl mx-auto border border-gray-100">
            {/* This section remains the same: initial view, loading, error, and upload */}
            {!prediction && (
                <>
                    <div className="text-center mb-8">
                        <Camera className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">AI Snake Identifier</h2>
                        <p className="text-gray-600">Upload a photo and let our AI identify the snake species for you</p>
                    </div>

                    {isLoading && (
                        <div className="text-center p-12">
                            <div className="w-20 h-20 border-4 border-dashed rounded-full animate-spin border-green-600 mx-auto"></div>
                            <p className="mt-6 text-xl text-gray-600 font-medium">Analyzing Image...</p>
                            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-6 mb-8 rounded-xl flex items-start space-x-3" role="alert">
                            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-lg">Error Occurred</p>
                                <p className="mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {!isLoading && !imageURL && (
                        <div className="text-center py-12">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-green-400 transition-colors">
                                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Upload Snake Image</h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">Take a clear photo of the snake or upload an existing image. Our AI will identify the species and provide safety information.</p>
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-10 rounded-full hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg"
                                >
                                    Choose Image
                                </button>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                                <p className="text-xs text-gray-400 mt-4">Supports JPG, PNG, and other common formats</p>
                            </div>
                        </div>
                    )}

                    {!isLoading && imageURL && (
                        <div className="text-center">
                            <div className="relative inline-block mb-8">
                                <img 
                                    src={imageURL} 
                                    alt="Snake preview" 
                                    className="max-w-full mx-auto rounded-xl shadow-lg border-4 border-gray-100" 
                                    style={{ maxHeight: '400px' }}
                                />
                            </div>
                            <div className="flex justify-center space-x-6">
                                <button 
                                    onClick={() => { setImageURL(null); setPrediction(null); setError(null); setImageFile(null); }} 
                                    className="bg-gray-500 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-600 transition-colors shadow-md"
                                >
                                    Change Image
                                </button>
                                <button 
                                    onClick={makePrediction} 
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-8 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-md"
                                >
                                    Identify Snake
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* --- UPDATED: This is the new display for the prediction results --- */}
            {prediction && (
                <div className="space-y-8">
                    <div className="text-center border-b border-gray-200 pb-8">
                        <h2 className="text-4xl font-bold text-green-800 mb-2">{prediction.Animal}</h2>
                        <p className="text-xl italic text-gray-600 mb-6">{prediction.ScientificName}</p>
                        <img 
                            src={imageURL} 
                            alt="Analyzed snake" 
                            className="max-w-full mx-auto rounded-xl shadow-lg border-4 border-gray-100 mb-6" 
                            style={{ maxHeight: '350px' }}
                        />
                    </div>

                    <div className="grid md:grid-cols-1 gap-6">
                        {/* Card for Venom & Medical Significance */}
                        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
                            <div className="flex items-center mb-3">
                                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                                <h3 className="font-bold text-xl text-red-800">Venom & Medical Significance</h3>
                            </div>
                            <p className="text-red-700 leading-relaxed">{prediction.Venom}</p>
                        </div>

                        {/* Card for Detailed Description */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
                            <div className="flex items-center mb-3">
                                <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                                <h3 className="font-bold text-xl text-blue-800">Detailed Description</h3>
                            </div>
                            <p className="text-blue-700 leading-relaxed">{prediction.Description}</p>
                        </div>
                        
                        {/* Card for Local Names */}
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 p-6 rounded-lg shadow-sm">
                            <div className="flex items-center mb-3">
                                <Languages className="w-6 h-6 text-purple-600 mr-3" />
                                <h3 className="font-bold text-xl text-purple-800">Local Names</h3>
                            </div>
                            <p className="text-purple-700 leading-relaxed">{prediction.LocalNames}</p>
                        </div>

                        {/* Card for Conservation Status */}
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 p-6 rounded-lg shadow-sm">
                            <div className="flex items-center mb-3">
                                <Shield className="w-6 h-6 text-yellow-600 mr-3" />
                                <h3 className="font-bold text-xl text-yellow-800">Conservation Status</h3>
                            </div>
                            <p className="text-yellow-700 leading-relaxed">{prediction.ConservationStatus}</p>
                        </div>
                    </div>

                    <div className="text-center pt-8 border-t border-gray-200">
                        <button 
                            onClick={() => { 
                                setImageURL(null); 
                                setPrediction(null); 
                                setError(null); 
                                setImageFile(null); 
                            }} 
                            className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-10 rounded-full hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg"
                        >
                            Analyze Another Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
