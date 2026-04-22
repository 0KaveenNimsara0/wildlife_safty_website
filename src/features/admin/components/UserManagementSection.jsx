import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, IMAGE_BASE_URL } from '../../../config/constants';
import {
  Users,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';

export default function UserManagementSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ email: '', displayName: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/users/unified?page=${currentPage}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.pagination?.totalPages || 1);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    if (!term.trim()) {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/users/search/${encodeURIComponent(term)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(1);
      setError('');
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.uid);
    setEditForm({
      email: user.email,
      displayName: user.displayName || ''
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/users/${editingUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      setUsers(users.map(user =>
        user.uid === editingUser ? { ...user, ...editForm } : user
      ));
      setEditingUser(null);
      setError('');
    } catch (error) {
      console.error('Update error:', error);
      setError('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Delete failed');
      }

      await fetchUsers();
      setError('');
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete user');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1 w-full max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Scan database: Identity, Email, or Hash..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 text-sm font-black uppercase tracking-widest text-slate-800 placeholder:text-slate-300 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-5 py-3.5 bg-slate-900 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-900/10">
            <Users size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{users.length} Active Nodes</span>
          </div>
          <button className="p-3.5 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 transition-all hover:shadow-lg active:scale-95">
             <Filter size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl shadow-sm">
          <AlertCircle className="w-5 h-5 mr-3 text-rose-500" />
          <span className="text-sm font-black uppercase tracking-widest">{error}</span>
        </div>
      )}

      <div className="card-premium overflow-hidden bg-white border-slate-100 shadow-xl shadow-slate-200/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-30">
              <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Synchronizing Data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Identity</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Node</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users && users.map((user) => (
                    <tr key={user.uid} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl ${(user.sources || []).includes('firebase') ? 'bg-amber-500' : 'bg-slate-900'} border-4 border-slate-100 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform relative overflow-hidden`}>
                            {user.photoURL ? (
                              <img 
                                src={user.photoURL.startsWith('http') ? user.photoURL : `${IMAGE_BASE_URL}${user.photoURL}`} 
                                alt="" 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                  e.target.onerror = null; 
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              (user.displayName || user.email || '?').charAt(0).toUpperCase()
                            )}
                             <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                               {(user.sources || []).includes('firebase') && (
                                 <div className="w-5 h-5 rounded-lg border-2 border-white flex items-center justify-center text-[8px] font-black shadow-lg bg-amber-600 text-white">G</div>
                               )}
                               {(user.sources || []).includes('mongodb') && (
                                 <div className="w-5 h-5 rounded-lg border-2 border-white flex items-center justify-center text-[8px] font-black shadow-lg bg-emerald-600 text-white">P</div>
                               )}
                             </div>
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900 tracking-tight">{user.displayName || 'Anonymous User'}</div>
                             <div className="flex items-center gap-1.5 mt-0.5">
                               {(user.sources || []).includes('firebase') && (
                                 <div className="text-[9px] font-bold text-amber-500 uppercase tracking-widest bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">Social</div>
                               )}
                               {user.hasPassword && (
                                 <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">Protocol</div>
                               )}
                             </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        {editingUser === user.uid ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            className="bg-white border-2 border-emerald-500 outline-none px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-900"
                          />
                        ) : (
                          <div className="text-xs font-bold text-slate-500 lowercase">{user.email || 'No email registered'}</div>
                        )}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                               year: 'numeric', month: 'short', day: 'numeric'
                            }) : 'UNKNOWN'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right">
                        {editingUser === user.uid ? (
                          <div className="flex justify-end gap-2">
                             <button onClick={handleUpdate} className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 active:scale-95 transition-all" title="Confirm Update">
                                <CheckCircle size={16} />
                             </button>
                             <button onClick={() => setEditingUser(null)} className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 active:scale-95 transition-all" title="Abort">
                                <XCircle size={16} />
                             </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleEdit(user)} className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 rounded-xl shadow-sm transition-all active:scale-95" title="Modify Personnel Record">
                                <Edit size={16} />
                             </button>
                             <button onClick={() => handleDelete(user.uid)} className="p-2.5 bg-white border border-slate-100 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl shadow-sm transition-all active:scale-95" title="Purge Identity">
                                <Trash2 size={16} />
                             </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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
    </div>
  );
}
