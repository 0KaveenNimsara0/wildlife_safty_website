// ErrorBoundary.jsx
import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-red-600 mb-2">Please try again later</p>
            <p className="text-red-600 mb-2">If the problem persists, please contact support</p>
            <p className="text-red-600 mb-2">Error: {this.state.error?.message || 'Unknown error'}</p>
            <p className="text-red-600 mb-2">Error Info: {this.state.errorInfo?.componentStack || 'No additional info'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
