import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="w-full max-w-md animate-fade-in">
        {children}
      </div>
    </div>
  );
}
