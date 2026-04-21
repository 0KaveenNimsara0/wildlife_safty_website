import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../../context/AuthContext';
import { BASE_URL, IMAGE_BASE_URL } from '../../../config/constants';
import { Clock, Trash2, Eye, ShieldAlert, CheckCircle, Search, Info, X, AlertTriangle } from 'lucide-react';

const PredictionHistorySection = () => {
    const { activeUser } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, [activeUser?.uid]);

    const fetchHistory = async () => {
        try {
            if (!activeUser?.uid) return;
            setLoading(true);
            const response = await fetch(`${BASE_URL}/predictions/history/${activeUser.uid}`);
            const data = await response.json();
            if (data.success) {
                setHistory(data.predictions);
            }
        } catch (err) {
            setError('Failed to load identification history');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this identification from your history?')) return;
        try {
            const response = await fetch(`${BASE_URL}/predictions/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.success) {
                setHistory(history.filter(item => item._id !== id));
            }
        } catch (err) {
            alert('Deletion failed');
        }
    };

    const filteredHistory = history.filter(item => 
        item.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.className?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Accessing Archives...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-50">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Identification History</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Your personal archive of identified species</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search your records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-400 w-full md:w-80"
                    />
                </div>
            </div>

            {filteredHistory.length === 0 ? (
                <div className="py-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200">
                        <Clock size={40} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-lg font-black text-slate-900">No Records Found</h4>
                        <p className="text-sm text-slate-400 font-medium">Capture species in the Identifier to build your archive.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHistory.map((item) => (
                        <div key={item._id} className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2">
                            {/* Image Header */}
                            <div className="relative h-56 overflow-hidden">
                                <img 
                                    src={`${IMAGE_BASE_URL}${item.imagePath}`} 
                                    alt={item.commonName} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                                        item.venom?.toLowerCase().includes('venomous') && !item.venom?.toLowerCase().includes('non')
                                            ? 'bg-rose-600 text-white'
                                            : 'bg-emerald-600 text-white'
                                    }`}>
                                        {item.venom?.toLowerCase().includes('venomous') && !item.venom?.toLowerCase().includes('non') ? 'Danger' : 'Safe'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{item.family}</p>
                                        <div className="flex items-center gap-1 text-slate-300">
                                            <Clock size={12} />
                                            <span className="text-[10px] font-bold">{new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 leading-tight truncate">{item.commonName}</h4>
                                    <p className="text-xs font-bold text-slate-400 italic mb-4">{item.scientificName}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Confidence</p>
                                        <p className="text-sm font-black text-slate-800">{item.confidence}%</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
                                        <div className="flex items-center justify-center gap-1">
                                            {item.verificationStatus === 'pending' ? (
                                                <Clock size={12} className="text-amber-500" />
                                            ) : (
                                                <CheckCircle size={12} className="text-emerald-500" />
                                            )}
                                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{item.verificationStatus}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <button 
                                        onClick={() => setSelectedPrediction(item)}
                                        className="flex-1 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Eye size={14} />
                                        Full Report
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item._id)}
                                        className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm group/del"
                                    >
                                        <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detailed Modal Overlay using React Portal for true full-screen depth */}
            {selectedPrediction && createPortal(
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8 bg-slate-900/40 backdrop-blur-3xl animate-fade-in">
                    <div className="bg-white rounded-[3rem] w-full max-w-6xl h-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col lg:flex-row">
                        <button 
                            onClick={() => setSelectedPrediction(null)}
                            className="absolute top-6 right-6 z-[10001] p-4 bg-white/20 hover:bg-rose-500 hover:text-white backdrop-blur-xl rounded-2xl transition-all text-slate-900 lg:text-slate-400 group border border-white/20 lg:border-transparent shadow-xl"
                        >
                            <X size={24} className="group-hover:rotate-90 transition-transform" />
                        </button>

                        {/* Visual Header - Left Side */}
                        <div className="w-full lg:w-1/2 h-64 lg:h-full relative flex-shrink-0">
                            <img 
                                src={`${IMAGE_BASE_URL}${selectedPrediction.imagePath}`} 
                                alt={selectedPrediction.commonName} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent lg:hidden" />
                            <div className="absolute bottom-6 left-6 lg:hidden text-white">
                                <h2 className="text-3xl font-black tracking-tighter">{selectedPrediction.commonName}</h2>
                                <p className="text-emerald-400 font-bold italic tracking-wide text-sm">{selectedPrediction.scientificName}</p>
                            </div>
                        </div>

                        {/* Detailed Stats - Right Side */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-16 space-y-10">
                            <div className="hidden lg:block space-y-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">Detailed Biometric Profile</span>
                                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">{selectedPrediction.commonName}</h2>
                                </div>
                                <p className="text-xl font-bold text-emerald-600/70 italic">{selectedPrediction.scientificName}</p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex items-center gap-4 group/card hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                                    <div className={`p-4 rounded-2xl transition-transform group-hover/card:scale-110 ${
                                        selectedPrediction.venom?.toLowerCase().includes('venomous') && !selectedPrediction.venom?.toLowerCase().includes('non')
                                            ? 'bg-rose-100 text-rose-600'
                                            : 'bg-emerald-100 text-emerald-600'
                                    }`}>
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Toxicity Level</p>
                                        <p className="text-sm font-black text-slate-800">{selectedPrediction.venom}</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex items-center gap-4 group/card hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                                    <div className="p-4 bg-sky-100 text-sky-600 rounded-2xl transition-transform group-hover/card:scale-110">
                                        <Info size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Species Family</p>
                                        <p className="text-sm font-black text-slate-800">{selectedPrediction.family}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-slate-900 font-bold uppercase tracking-widest text-[11px] pb-4 border-b border-slate-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                    <span>Ecological Insight</span>
                                </div>
                                <div className="relative">
                                    <p className="text-slate-600 leading-relaxed font-semibold italic text-lg pr-4">
                                        "{selectedPrediction.details?.Description || "Detailed profile data unavailable for this specific capture session."}"
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100">
                                <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group/reliability">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-6">Engine Identification Reliability</h4>
                                    <div className="flex items-end gap-3 mb-8">
                                        <span className="text-7xl font-black leading-none tracking-tighter">{selectedPrediction.confidence}%</span>
                                        <span className="text-xs text-emerald-400 font-black uppercase tracking-widest pb-2 opacity-80">Accuracy Score</span>
                                    </div>
                                    <div className="relative h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-[1.5s] ease-out relative"
                                            style={{ width: `${selectedPrediction.confidence}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 opacity-60">Result verified via Neural Network Core V2.0</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default PredictionHistorySection;
