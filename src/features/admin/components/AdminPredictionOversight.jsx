import React, { useState, useEffect } from 'react';
import { BASE_URL, IMAGE_BASE_URL } from '../../../config/constants';
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
    ArrowRight
} from 'lucide-react';

const AdminPredictionOversight = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, corrected: 0 });

    useEffect(() => {
        fetchPredictions();
    }, [filterStatus]);

    const fetchPredictions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/predictions/all?status=${filterStatus}`);
            const data = await response.json();
            if (data.success) {
                setPredictions(data.predictions);
                calculateStats(data.predictions);
            }
        } catch (err) {
            console.error('Failed to load predictions');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const s = { 
            total: data.length, 
            pending: data.filter(p => p.verificationStatus === 'pending').length,
            verified: data.filter(p => p.verificationStatus === 'verified').length,
            corrected: data.filter(p => p.verificationStatus === 'corrected').length
        };
        setStats(s);
    };

    const handleVerify = async (id, status, expertLabel = '') => {
        try {
            const adminData = JSON.parse(localStorage.getItem('adminData'));
            const response = await fetch(`${BASE_URL}/predictions/verify/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    status, 
                    expertLabel, 
                    adminId: adminData._id || adminData.id 
                })
            });
            const data = await response.json();
            if (data.success) {
                setPredictions(predictions.map(p => p._id === id ? data.prediction : p));
                alert(`Identification marked as ${status}`);
            }
        } catch (err) {
            alert('Verification failed');
        }
    };

    const handleExport = async () => {
        try {
            const response = await fetch(`${BASE_URL}/predictions/export-training`);
            const data = await response.json();
            const jsonStr = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `wildsafe_training_data_${new Date().toISOString()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            alert('Export failed');
        }
    };

    const filtered = predictions.filter(p => 
        p.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.verifiedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header / Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight">Prediction Oversight</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Expert verification & Accuracy tuning hub</p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                    <div className="px-6 py-4 bg-slate-900 text-white rounded-3xl">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Total Samples</p>
                        <p className="text-2xl font-black">{stats.total}</p>
                    </div>
                    <div className="px-6 py-4 bg-amber-500 text-white rounded-3xl">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Pending</p>
                        <p className="text-2xl font-black">{stats.pending}</p>
                    </div>
                    <button 
                        onClick={handleExport}
                        className="px-8 py-4 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
                    >
                        <Download size={16} />
                        Export Training Data
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search by Species or User Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                    />
                </div>
                <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl">
                    {['', 'pending', 'verified', 'corrected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                filterStatus === status 
                                    ? 'bg-white text-emerald-600 shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {status || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="py-40 flex flex-col items-center justify-center text-slate-300 gap-4">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-black uppercase tracking-widest">Scanning Databases...</span>
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity Sample</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Source / Reporter</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">ML Classification</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Verification Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(item => (
                                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-4 ring-slate-50 transition-all group-hover:scale-110">
                                            <img src={`${IMAGE_BASE_URL}${item.imagePath}`} className="h-full w-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-slate-50 flex items-center justify-center text-slate-400 font-black text-[10px] overflow-hidden">
                                                {!item.isAnonymous && item.user ? (
                                                    item.user.photoURL ? (
                                                        <img 
                                                            src={item.user.photoURL.startsWith('http') ? item.user.photoURL : `${IMAGE_BASE_URL}${item.user.photoURL}`} 
                                                            alt="" 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    ) : (
                                                        (item.user.displayName || item.user.name || item.user.email || '?').charAt(0).toUpperCase()
                                                    )
                                                ) : (
                                                    <UserIcon size={16} />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 leading-tight">
                                                    {item.isAnonymous ? 'Anonymous Guest' : (item.user?.displayName || item.user?.name || 'Field Agent')}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                    {item.isAnonymous ? 'Public Gateway' : (item.user?.email || 'Authenticated User')}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                                    item.venom?.toLowerCase().includes('venomous') && !item.venom?.toLowerCase().includes('non') 
                                                        ? 'bg-rose-50 text-rose-600' 
                                                        : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                    {item.className}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">({item.confidence}%)</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">{item.commonName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 ${
                                            item.verificationStatus === 'pending' ? 'bg-amber-50 text-amber-600' :
                                            item.verificationStatus === 'verified' ? 'bg-emerald-50 text-emerald-600' :
                                            'bg-sky-50 text-sky-600'
                                        }`}>
                                            {item.verificationStatus === 'pending' && <Clock size={12} />}
                                            {item.verificationStatus === 'verified' && <ShieldCheck size={12} />}
                                            {item.verificationStatus === 'corrected' && <ShieldCheck size={12} />}
                                            {item.verificationStatus}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            {item.verificationStatus === 'pending' ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleVerify(item._id, 'verified')}
                                                        className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all group/v"
                                                    >
                                                        <CheckCircle size={18} className="group-hover/v:scale-110 transition-transform" />
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            const label = window.prompt('Enter Expert Label (Scientific Name or Class):');
                                                            if (label) handleVerify(item._id, 'corrected', label);
                                                        }}
                                                        className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all group/c"
                                                    >
                                                        <XCircle size={18} className="group-hover/c:scale-110 transition-transform" />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-end opacity-60">
                                                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Authenticated By</span>
                                                    <div className="flex flex-col items-end leading-tight">
                                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
                                                            {item.verifiedBy?.name || 'System Authority'}
                                                        </span>
                                                        <span className="text-[7px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">
                                                            {item.verifierRole === 'medical_officer' ? 'Medical Expert' : 'Administrator'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPredictionOversight;
