import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Clock,
  Filter,
  UserPlus,
  Hospital,
  Shield,
  Activity,
  FileText,
  Phone,
  Building,
  Eye
} from 'lucide-react';

export default function MedicalOfficerManagement() {
  const [medicalOfficers, setMedicalOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [viewingOfficer, setViewingOfficer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    specialization: 'veterinary_surgeon',
    licenseNumber: '',
    hospital: ''
  });

  useEffect(() => {
    fetchMedicalOfficers();
  }, [currentPage]);

  const fetchMedicalOfficers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/users/medical-officers?page=${currentPage}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch medical officers');
      }

      const data = await response.json();
      setMedicalOfficers(data.medicalOfficers);
      setTotalPages(data.pagination.totalPages);
      setError('');
    } catch (error) {
      console.error('Error fetching medical officers:', error);
      setError('Failed to load medical officers');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingOfficer 
        ? `http://localhost:5000/api/admin/users/medical-officers/${editingOfficer}`
        : 'http://localhost:5000/api/medical-officer/auth/register';
      
      const method = editingOfficer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Action failed');
      }

      alert(editingOfficer ? 'Officer updated successfully' : 'Officer enrolled successfully');
      setShowAddModal(false);
      setEditingOfficer(null);
      setFormData({
        name: '', email: '', password: '', phoneNumber: '',
        specialization: 'veterinary_surgeon', licenseNumber: '', hospital: ''
      });
      fetchMedicalOfficers();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Terminate officer access? This action is logged.')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/users/medical-officers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Delete failed');
      fetchMedicalOfficers();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleApprovalToggle = async (officer) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/users/medical-officers/${officer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved: !officer.isApproved })
      });

      if (!response.ok) throw new Error('Status update failed');
      fetchMedicalOfficers();
    } catch (error) {
      alert(error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getSpecializationLabel = (val) => {
    const specs = {
      'veterinary_surgeon': 'Veterinary Surgeon',
      'wildlife_biologist': 'Wildlife Biologist',
      'ecologist': 'Ecologist',
      'zoologist': 'Zoologist',
      'other': 'Specialist'
    };
    return specs[val] || val;
  };

  const filteredOfficers = medicalOfficers.filter(officer =>
    officer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.hospital?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Medical Logistics Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1 w-full max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="System Scan: Search Medical Users, Spec, or Hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 text-sm font-black uppercase tracking-widest text-slate-800 placeholder:text-slate-300 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button
             onClick={() => setShowAddModal(true)}
             className="px-6 py-4 bg-slate-900 text-white rounded-2xl flex items-center gap-3 shadow-xl shadow-emerald-900/10 hover:bg-emerald-600 transition-all active:scale-95 group"
           >
             <UserPlus size={18} className="text-emerald-400 group-hover:text-white" />
             <span className="text-[10px] font-black uppercase tracking-widest">Enroll Officer</span>
           </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl shadow-sm">
          <AlertCircle className="w-5 h-5 mr-3 text-rose-500" />
          <span className="text-sm font-black uppercase tracking-widest">{error}</span>
        </div>
      )}

      {/* Medical Directory Table */}
      <div className="card-premium overflow-hidden bg-white border-slate-100 shadow-xl shadow-slate-200/50">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-30">
              <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retrieving Medical Logs...</p>
           </div>
        ) : medicalOfficers.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <Shield className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No Operational Nodes Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Medical Expert</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Specialization</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Uplink Status</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tactical Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOfficers.map((officer) => (
                  <tr key={officer._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-600 border-4 border-emerald-50 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                             {officer.name ? officer.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                             <div className="text-sm font-black text-slate-900 tracking-tight">{officer.name || 'No name'}</div>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1 mt-1">
                                <Hospital size={10} className="text-slate-300" /> {officer.hospital || 'Private Clinic'}
                             </p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                          {getSpecializationLabel(officer.specialization)}
                       </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${officer.isApproved ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${officer.isApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                             {officer.isApproved ? 'Operational' : 'Pending Auth'}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setViewingOfficer(officer)} className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 rounded-xl shadow-sm transition-all active:scale-95">
                             <Eye size={16} />
                          </button>
                          <button onClick={() => { setEditingOfficer(officer._id); setFormData(officer); setShowAddModal(true); }} className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 rounded-xl shadow-sm transition-all active:scale-95">
                             <Edit size={16} />
                          </button>
                          <button onClick={() => handleApprovalToggle(officer)} className={`p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm transition-all active:scale-95 ${officer.isApproved ? 'text-rose-400 hover:text-rose-600' : 'text-emerald-400 hover:text-emerald-600'}`}>
                             {officer.isApproved ? <XCircle size={16} /> : <CheckCircle size={16} />}
                          </button>
                          <button onClick={() => handleDelete(officer._id)} className="p-2.5 bg-white border border-slate-100 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl shadow-sm transition-all active:scale-95">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === currentPage
                    ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Enroll/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-in">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">{editingOfficer ? 'Modify' : 'Enroll'} <span className="text-emerald-500">Officer</span></h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Operational Protocol v2.4</p>
                 </div>
                 <button onClick={() => { setShowAddModal(false); setEditingOfficer(null); }} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <XCircle size={24} />
                 </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Identity</label>
                       <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Command Name" className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:outline-none text-xs font-black uppercase tracking-widest transition-all" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Comms Email</label>
                       <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="officer@uplink.net" className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:outline-none text-xs font-black uppercase tracking-widest transition-all" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Specialization</label>
                       <select name="specialization" value={formData.specialization} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:outline-none text-xs font-black uppercase tracking-widest transition-all">
                          <option value="veterinary_surgeon">Vet Surgeon</option>
                          <option value="wildlife_biologist">Wild Biologist</option>
                          <option value="ecologist">Ecologist</option>
                          <option value="zoologist">Zoologist</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Base Hospital</label>
                       <input name="hospital" value={formData.hospital} onChange={handleInputChange} placeholder="Station / HQ" className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:outline-none text-xs font-black uppercase tracking-widest transition-all" />
                    </div>
                 </div>
                 
                 <div className="pt-6">
                    <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition-all active:scale-95">
                       {editingOfficer ? 'Commit Updates' : 'Authorize Enrollment'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Quick View Modal */}
      {viewingOfficer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
           <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
              <div className="relative h-32 bg-slate-900">
                 <div className="absolute -bottom-12 left-10">
                    <div className="w-24 h-24 rounded-3xl bg-emerald-600 border-[6px] border-white flex items-center justify-center text-white text-3xl font-black shadow-xl">
                       {viewingOfficer.name?.charAt(0)}
                    </div>
                 </div>
                 <button onClick={() => setViewingOfficer(null)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                    <XCircle size={24} />
                 </button>
              </div>
              <div className="px-10 pt-16 pb-12">
                 <div className="mb-8">
                    <h3 className="text-2xl font-black uppercase tracking-tight">{viewingOfficer.name}</h3>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">{getSpecializationLabel(viewingOfficer.specialization)}</p>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <Phone size={16} className="text-slate-400" />
                       <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{viewingOfficer.phoneNumber || 'NO_CONTACT_LOCKED'}</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <Shield size={16} className="text-slate-400" />
                       <span className="text-xs font-black text-slate-600 uppercase tracking-widest">License: {viewingOfficer.licenseNumber || 'PENDING_SCAN'}</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <Activity size={16} className="text-emerald-500" />
                       <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Uplink: {viewingOfficer.isApproved ? 'ACTIVE_AUTH' : 'PROBATION'}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
