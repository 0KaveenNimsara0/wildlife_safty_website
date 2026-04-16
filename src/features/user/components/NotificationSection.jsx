import React from 'react';
import { Bell } from 'lucide-react';

const NotificationSection = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
      <div className="p-8 bg-sky-50 rounded-full text-sky-400 relative">
        <Bell size={64} className="animate-bounce" />
        <div className="absolute top-4 right-4 w-6 h-6 bg-rose-500 rounded-full border-4 border-white shadow-lg" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-900">Zero Comms</h3>
        <p className="text-slate-400 font-medium max-w-xs leading-relaxed italic">Intelligence grid reports no incoming transmissions for your current coordinates.</p>
      </div>
    </div>
  );
};

export default NotificationSection;
