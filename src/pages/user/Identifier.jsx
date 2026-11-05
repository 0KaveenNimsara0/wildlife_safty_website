import React, { useState, useCallback } from 'react';
import UploadArea from '../../features/prediction/components/UploadArea';
import PredictionResults from '../../features/prediction/components/PredictionResults';
import ErrorCard from '../../features/prediction/components/ErrorCard';
import { useAuth } from '../../context/useAuth';
import { predictSpecies, savePrediction } from '../../features/prediction/api';

export default function Identifier() {
    const { activeUser } = useAuth();
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
        if (file.size > 5 * 1024 * 1024) {
            setError(`Asset Too Large. Please select an image under 5MB.`);
            return;
        }
        setImageFile(file);
        setImageURL(URL.createObjectURL(file));
    }, [clearState]);

    const makePrediction = async () => {
        if (!imageFile) return setError("Select an image to analyze.");
        clearState(false);
        setIsLoading(true);

        try {
            // 1. Get ML Prediction
            const data = await predictSpecies(imageFile);
            setPrediction(data);

            // 2. Save to History (Always - Logged in or Anonymous)
            // We do this in a separate try/catch so a save failure doesn't break the UI
            try {
                await savePrediction(imageFile, data, activeUser?.uid || null);
                console.log('Identification synced to cloud history.');
            } catch (saveError) {
                console.error('Persistence failed:', saveError);
            }
        } catch (err) {
            setError(err.message || "Engine Connection Failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-6 sm:py-8">
            <div className="container mx-auto max-w-7xl">
                {!prediction && (
                    <header className="text-center mb-10 space-y-5 animate-fade-in">
                        <div className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] w-fit mx-auto shadow-sm">
                            Wildlife safety • Sri Lanka
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 tracking-tight">
                            Understand wildlife.<br /><span className="text-emerald-600">Stay a step safer.</span>
                        </h1>
                        <p className="text-base leading-relaxed text-slate-500 font-medium max-w-2xl mx-auto">
                            Explore Sri Lankan snake species with a photo. Get identification insights and learn how to stay safe around wildlife.
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
