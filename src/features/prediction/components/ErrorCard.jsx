import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

const ErrorCard = ({ message, onClear }) => (
    <div className="w-full p-5 rounded-2xl bg-rose-50 border border-rose-100 shadow-sm animate-fade-in mb-6">
        <div className="flex items-center">
            <div className="bg-rose-500 p-2 rounded-xl mr-4">
                <AlertTriangle className="w-5 h-5 text-white shrink-0" />
            </div>
            <div className="flex-grow">
                <h3 className="font-black text-sm uppercase tracking-widest text-rose-900 mb-1">System Error</h3>
                <p className="text-sm font-medium text-rose-800">{message}</p>
            </div>
            <button onClick={onClear} className="p-2 text-rose-400 hover:text-rose-600 transition-colors">
                <XCircle size={20} />
            </button>
        </div>
    </div>
);

export default ErrorCard;
