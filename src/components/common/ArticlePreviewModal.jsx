import React from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Award, Clock, User } from 'lucide-react';

const ArticlePreviewModal = ({ article, isOpen, onClose, actionButton }) => {
  if (!isOpen || !article) return null;

  return createPortal(
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 lg:p-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/20 flex flex-col relative animate-scale-in">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px]">
              <Award size={14} />
              <span>Intelligence Report: {article.category || 'General Intel'}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight max-w-2xl">{article.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Author / Source</p>
              <div className="flex items-center gap-2">
                <User size={14} className="text-emerald-600" />
                <p className="text-sm font-black text-slate-900 tracking-tight">{article.author?.name || 'Authorized Officer'}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Timestamp</p>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-emerald-600" />
                <p className="text-sm font-black text-slate-900 tracking-tight">
                  {new Date(article.createdAt || article.savedAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            {/* Excerpt / Summary */}
            <p className="text-slate-600 text-xl font-medium leading-relaxed italic mb-12 border-l-4 border-emerald-500 pl-8 bg-emerald-50/30 py-6 rounded-r-2xl">
              "{article.excerpt || article.content?.substring(0, 150)}..."
            </p>

            {/* Main Image */}
            {article.image_url && (
              <div className="mb-12 rounded-[2rem] overflow-hidden border-8 border-slate-50 shadow-inner">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-auto object-cover max-h-[500px]"
                />
              </div>
            )}

            {/* Content Body */}
            <div 
              className="text-slate-800 text-lg leading-[2] font-medium whitespace-pre-wrap font-serif"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Additional Images (if any) */}
          {article.images && article.images.length > 0 && (
            <div className="mt-12 space-y-8">
              {article.images.map((img, idx) => (
                <div key={idx} className="rounded-[2.5rem] overflow-hidden border-4 border-slate-50">
                  <img
                    src={img.url}
                    alt={`Intelligence Asset ${idx + 1}`}
                    className="w-full h-auto object-cover shadow-2xl"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Official Wildlife Safety Terminal — Access Logged</span>
          {actionButton}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ArticlePreviewModal;

