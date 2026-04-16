import React from 'react';
import UserFilesSection from '../../community/components/UserFilesSection';

const ActivitySection = ({ userId }) => {
  return (
    <div className="space-y-10 focus:outline-none">
      <div className="pb-8 border-b border-slate-50">
        <h3 className="text-2xl font-black text-slate-900">Intelligence Assets</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Managed field documents and uploads</p>
      </div>
      <UserFilesSection userId={userId} />
    </div>
  );
};

export default ActivitySection;
