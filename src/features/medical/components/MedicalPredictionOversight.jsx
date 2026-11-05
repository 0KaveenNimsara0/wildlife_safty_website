import ModalLayer from '../../../components/ui/ModalLayer';
import React, { useState, useEffect } from 'react';
import { 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertTriangle, 
    Search, 
    Filter, 
    Download, 
    Eye, 
    ShieldCheck, 
    MessageSquare, 
    User as UserIcon,
    ArrowRight,
    X
} from 'lucide-react';
import { BASE_URL, IMAGE_BASE_URL } from '../../../config/constants';
import { createPortal } from 'react-dom';

export default function MedicalPredictionOversight() {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);
    const [medicalData, setMedicalData] = useState(null);

    useEffect(() => {
        const medical = localStorage.getItem('medicalOfficerData');
        if (medical) setMedicalData(JSON.parse(medical));
        fetchPredictions();
    }, []);

    const fetchPredictions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/predictions/all`);
            const data = await response.json();
            if (data.success) {
                setPredictions(data.predictions);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id, status, expertLabel = null) => {
        try {
            const response = await fetch(`${BASE_URL}/predictions/verify/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    expertLabel,
                    verifierId: medicalData._id || medicalData.id,
                    verifierRole: 'medical_officer'
                })
            });
            const data = await response.json();
            if (data.success) {
                setPredictions(predictions.map(p => p._id === id ? data.prediction : p));
                setSelectedItem(null);
            }
        } catch (error) {
            alert('Verification failed');
        }
    };

    const filteredPredictions = predictions.filter(p => {
        const matchesSearch = 
            p.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.user?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.verifiedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || p.verificationStatus === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-semibold uppercase tracking-normal text-slate-400">Loading Identification Global Log...</p>
            </div>
        );
    }

    return (
        <div className="p-5 lg:p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto">
            {/* Elegant Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-emerald-600">
                        <ShieldCheck size={20} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">WildSafe Expert Core</span>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Species <span className="text-emerald-600">Oversight</span></h2>
                    <p className="text-slate-500 font-medium max-w-xl">Audit, verify, and curate identification results. Your expert verification directly improves the neural network's accuracy.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Filter by species or UID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-2.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-bold text-slate-800 w-full sm:w-80 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Scans" value={predictions.length} icon={Eye} color="slate" />
                <StatCard title="Pending" value={predictions.filter(p => p.verificationStatus === 'pending').length} icon={Clock} color="amber" />
                <StatCard title="Verified" value={predictions.filter(p => p.verificationStatus === 'verified').length} icon={CheckCircle} color="emerald" />
                <StatCard title="Expert Overrides" value={predictions.filter(p => p.verificationStatus === 'corrected').length} icon={AlertTriangle} color="rose" />
            </div>

            {/* List Header/Filters */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-6 mt-12">
                <div className="flex items-center gap-5">
                    {['all', 'pending', 'verified', 'corrected'].map(status => (
                        <button 
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`text-[10px] font-semibold uppercase tracking-normal transition-all relative py-2 ${
                                filterStatus === status ? 'text-slate-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-500' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid/Table */}
            <div className="overflow-hidden bg-white border border-slate-100 rounded-2xl shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-normal text-slate-400">Capture Species</th>
                            <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-normal text-slate-400">User Identity</th>
                            <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-normal text-slate-400">AI Confidence</th>
                            <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-normal text-slate-400">Status</th>
                            <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-normal text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredPredictions.map(item => (
                            <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                                            <img src={`${IMAGE_BASE_URL}${item.imagePath}`} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 tracking-tight">{item.commonName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 italic">{item.scientificName}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-semibold text-[10px] overflow-hidden">
                                            {!item.isAnonymous && item.user ? (
                                                item.user.photoURL ? (
                                                    <img 
                                                        src={item.user.photoURL.startsWith('http') ? item.user.photoURL : `${IMAGE_BASE_URL}${item.user.photoURL}`} 
                                                        alt="" 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                ) : (
                                                    (item.user.displayName || item.user.email || '?').charAt(0).toUpperCase()
                                                )
                                            ) : (
                                                <UserIcon size={16} />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-semibold text-slate-900 leading-tight">
                                                {item.isAnonymous ? 'Guest User' : (item.user?.displayName || 'Field Agent')}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-normal mt-0.5">
                                                {item.isAnonymous ? 'Public Gateway' : (item.user?.email || 'Authenticated')}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-slate-700">{item.confidence}%</span>
                                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.confidence}%` }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={item.verificationStatus} />
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button 
                                        onClick={() => setSelectedItem(item)}
                                        className="p-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Verification Modal Portal */}
            {selectedItem && createPortal(
                <ModalLayer onClose={() => setSelectedItem(null)} className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-5 bg-slate-900/40 backdrop-blur-3xl animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-5xl h-full max-h-[90vh] overflow-hidden shadow-sm relative flex flex-col lg:flex-row border border-white/20">
                        <button 
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-6 right-6 z-[10001] p-4 bg-white/20 hover:bg-rose-500 hover:text-white backdrop-blur-xl rounded-2xl transition-all text-slate-900 lg:text-slate-400 group border border-white/20 lg:border-transparent"
                        >
                            <X size={24} className="group-hover:rotate-90 transition-transform" />
                        </button>

                        <div className="w-full lg:w-1/2 h-64 lg:h-full relative overflow-hidden group">
                            <img src={`${IMAGE_BASE_URL}${selectedItem.imagePath}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 lg:p-16 space-y-6 bg-white">
                            <div className="space-y-2">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-600">Species Audit Portal</span>
                                <h2 className="text-2xl font-semibold text-slate-900 tracking-tight leading-tight">{selectedItem.commonName}</h2>
                                <p className="text-lg font-bold text-slate-400 italic font-serif opacity-70">{selectedItem.scientificName}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-normal mb-1.5 opacity-60">AI Confidence</p>
                                    <p className="text-2xl font-semibold text-slate-900">{selectedItem.confidence}%</p>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-normal mb-1.5 opacity-60">Engine Label</p>
                                    <p className="text-2xl font-semibold text-emerald-600">{selectedItem.className}</p>
                                </div>
                            </div>

                            {selectedItem.verificationStatus === 'pending' ? (
                                <div className="space-y-5 pt-8 border-t border-slate-100">
                                    <div className="space-y-4">
                                        <p className="text-xs font-semibold text-slate-900 uppercase tracking-normal">Medical Action required:</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button 
                                                onClick={() => handleVerify(selectedItem._id, 'verified')}
                                                className="py-3 bg-emerald-600 text-white rounded-2xl font-semibold text-[10px] uppercase tracking-normal hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-3"
                                            >
                                                <CheckCircle size={18} />
                                                Confirm Label
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    const correction = prompt("Enter the correct expert species label (Common Name):");
                                                    if (correction) handleVerify(selectedItem._id, 'corrected', correction);
                                                }}
                                                className="py-3 bg-slate-900 text-white rounded-2xl font-semibold text-[10px] uppercase tracking-normal hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-sm"
                                            >
                                                <AlertTriangle size={18} />
                                                Override Label
                                            </button>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleVerify(selectedItem._id, 'rejected')}
                                        className="w-full py-2.5 bg-rose-50 text-rose-600 rounded-2xl font-semibold text-[10px] uppercase tracking-normal hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-3"
                                    >
                                        <XCircle size={18} />
                                        Reject Identification
                                    </button>
                                </div>
                            ) : (
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/50 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                            <ShieldCheck className="text-emerald-500" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal">Verification Recorded</p>
                                            <h4 className="text-xl font-bold text-slate-900">System Expert Decided</h4>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                            <p className="text-[9px] font-semibold text-slate-400 uppercase mb-1">Final Status</p>
                                            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">{selectedItem.verificationStatus}</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                            <p className="text-[9px] font-semibold text-slate-400 uppercase mb-1">Authenticated By</p>
                                            <div className="flex flex-col">
                                                <p className="text-sm font-semibold text-slate-900 uppercase tracking-wider">{selectedItem.verifiedBy?.name || 'System'}</p>
                                                <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-normal mt-1">
                                                    {selectedItem.verifierRole === 'medical_officer' ? 'Medical Expert' : 'Administrator'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {selectedItem.expertLabel && (
                                        <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-sm">
                                            <p className="text-[9px] font-semibold text-emerald-400 uppercase mb-1 tracking-normal">Medical Expert Corrected Label</p>
                                            <p className="text-lg font-semibold tracking-tight">{selectedItem.expertLabel}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </ModalLayer>,
                document.body
            )}
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    const colors = {
        slate: 'bg-slate-100 text-slate-600',
        amber: 'bg-amber-100 text-amber-600',
        emerald: 'bg-emerald-100 text-emerald-600',
        rose: 'bg-rose-100 text-rose-600'
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-sm hover:shadow-slate-200/50 transition-all flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-normal mb-1">{title}</p>
                <p className="text-xl font-semibold text-slate-900 tracking-tight">{value}</p>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const configs = {
        pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
        verified: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
        corrected: { bg: 'bg-emerald-900', text: 'text-white', icon: AlertTriangle },
        rejected: { bg: 'bg-rose-100', text: 'text-rose-700', icon: XCircle }
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-normal flex items-center gap-2 w-fit ${config.bg} ${config.text}`}>
            <Icon size={12} />
            {status}
        </span>
    );
}
