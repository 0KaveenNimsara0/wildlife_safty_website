import React from 'react';
import { 
  FileText, 
  Plus, 
  Check, 
  Edit3, 
  FileWarning 
} from 'lucide-react';

const MedicalOfficerArticleHub = ({ articles, onCreateArticle, onEditArticle }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white p-6 rounded-3xl flex flex-col h-full border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center mb-6 px-1">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Medical Knowledge</h3>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Article Archive</h2>
        </div>
        <button
          onClick={onCreateArticle}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-slate-900 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 font-bold text-[10px] uppercase tracking-wider"
        >
          <Plus size={14} />
          Create
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
        {articles && articles.length > 0 ? (
          articles.filter(a => a && a._id).map((article) => {
            const isPublished = article.status === 'published';
            return (
              <div
                key={article._id}
                className="group relative bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all duration-300 hover:bg-white hover:shadow-md"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isPublished ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {isPublished ? <Check size={8} /> : <FileWarning size={8} />}
                        {article.status ? article.status.replace('_', ' ') : 'DRAFT'}
                      </div>
                      <span className="text-[9px] font-semibold text-slate-400">{formatDate(article.createdAt)}</span>
                    </div>
                    
                    <h4 className="font-bold text-slate-800 text-xs leading-tight mb-1 group-hover:text-indigo-600 transition-colors truncate">
                      {article.title}
                    </h4>
                  </div>
                  
                  <button
                    onClick={() => onEditArticle(article)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-sm"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-200 mb-6 shadow-sm">
              <FileText size={28} />
            </div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No Articles Found</h4>
            <p className="text-[10px] text-slate-400 font-medium text-center mt-2 max-w-[180px] leading-relaxed">
              Medical documentation has not been shared with the archive yet.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
            <span className="text-[9px] font-bold uppercase text-slate-500">Cloud Synced</span>
          </div>
        </div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{articles?.length || 0} Records Total</p>
      </div>
    </div>
  );
};

export default MedicalOfficerArticleHub;

