import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';

// Import the new page components from your 'pages' directory
import IdentifierPage from './assets/pages/IdentifierPage';
import EmergencyPage from './assets/pages/EmergencyPage';
import LearnPage from './assets/pages/LearnPage';
import MapPage from './assets/pages/MapPage';

// Import the reusable Header and Footer components from your 'components' directory
import Header from './assets/components/Header';
import Footer from './assets/components/Footer';

// The main App component is now much simpler. Its only job is to
// manage which page is currently active and render it.
export default function App() {
    // This state determines which page is shown. Default is 'home'.
    const [page, setPage] = useState('home'); // 'home', 'emergency', 'learning', or 'map'

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans text-gray-800">
            
            {/* The Header component controls navigation. We pass it the current
                page state and the function to update it ('setPage'). */}
            <Header page={page} setPage={setPage} />

            <main className="container mx-auto px-6 py-12">
                {/* This is conditional rendering. It checks the value of the 'page' state
                    and displays only the component that matches. */}
                {page === 'home' && <IdentifierPage />}
                {page === 'emergency' && <EmergencyPage />}
                {page === 'learning' && <LearnPage />}
                {page === 'map' && <MapPage />}
            </main>

            {/* The Footer component also needs the setPage function for its links to work. */}
            <Footer setPage={setPage} />
        </div>
    );
}
