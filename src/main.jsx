import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './assets/styles/global.css';
import App from './App.jsx';
import 'leaflet/dist/leaflet.css';
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx';

// Create root element
const container = document.getElementById('root');
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <App />
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);
