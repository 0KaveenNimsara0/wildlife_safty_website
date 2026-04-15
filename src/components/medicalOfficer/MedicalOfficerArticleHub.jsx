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
    <div className="glass card-premium p-6 rounded-[2rem] flex flex-col h-full border border-slate-100 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Intelligence</h3>
          <h2 className="text-sm font-black text-slate-900 tracking-tight">Public Bulletins</h2>
        </div>
        <button
          onClick={onCreateArticle}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-95 shadow-md font-black text-[9px] uppercase tracking-widest"
        >
          <Plus size={12} />
          Draft
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
        {articles && articles.length > 0 ? (
          articles.filter(a => a && a._id).map((article) => {
            const isPublished = article.status === 'published';
            return (
              <div
                key={article._id}
                className="group relative bg-white border border-slate-50 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/40"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest flex items-center gap-1 ${
                        isPublished ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {isPublished ? <Check size={8} /> : <FileWarning size={8} />}
                        {article.status ? article.status.replace('_', ' ') : 'DRAFT'}
                      </div>
                      <span className="text-[8px] font-black uppercase text-slate-300">{formatDate(article.createdAt)}</span>
                    </div>
                    
                    <h4 className="font-black text-slate-900 text-[11px] leading-tight mb-1 group-hover:text-emerald-600 transition-colors truncate">
                      {article.title}
                    </h4>
                  </div>
                  
                  <button
                    onClick={() => onEditArticle(article)}
                    className="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                  >
                    <Edit3 size={12} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-100 mb-6 shadow-sm">
              <FileText size={32} />
            </div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Zero Bulletin Records</h4>
            <p className="text-[10px] text-slate-400 font-medium text-center mt-2 max-w-[200px] leading-relaxed">
              No medical intelligence has been committed to the public server yet.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between opacity-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-black uppercase text-slate-600">Sync Optimal</span>
          </div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocol v4.2</span>
        </div>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{articles?.length || 0} Nodes Active</p>
      </div>
    </div>
  );
};

export default MedicalOfficerArticleHub;

