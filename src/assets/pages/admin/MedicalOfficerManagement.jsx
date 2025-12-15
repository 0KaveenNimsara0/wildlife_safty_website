import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Phone,
  Building,
  FileText
} from 'lucide-react';

export default function MedicalOfficerManagement() {
  const [medicalOfficers, setMedicalOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [editForm, setEditForm] = useState({
    email: '',
    name: '',
    specialization: '',
    licenseNumber: '',
    phoneNumber: '',
    hospital: '',
    isApproved: false,
    isActive: true
  });
  const [viewingOfficer, setViewingOfficer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchMedicalOfficers();
  }, [currentPage, navigate]);

  const fetchMedicalOfficers = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setError('No authentication token found');
        navigate('/admin/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/admin/users/medical-officers?page=${currentPage}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.medicalOfficers) {
        setMedicalOfficers(data.medicalOfficers);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching medical officers:', error);
      setError(`Failed to load medical officers: ${error.message}`);
      setMedicalOfficers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    if (!term.trim()) {
      fetchMedicalOfficers();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/admin/users/medical-officers/search/${encodeURIComponent(term)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.medicalOfficers) {
        setMedicalOfficers(data.medicalOfficers);
        setTotalPages(1);
      } else {
        throw new Error('Invalid search response format');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(`Search failed: ${error.message}`);
      setMedicalOfficers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (officer) => {
    setEditingOfficer(officer._id);
    setEditForm({
      email: officer.email,
      name: officer.name || '',
      specialization: officer.specialization || '',
      licenseNumber: officer.licenseNumber || '',
      phoneNumber: officer.phoneNumber || '',
      hospital: officer.hospital || '',
      isApproved: officer.isApproved || false,
      isActive: officer.isActive !== false
    });
  };

  const handleUpdate = async () => {
    try {
      setError('');
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setError('No authentication token found');
        return;
      }

      const updateUrl = `http://localhost:5000/api/admin/users/medical-officers/${editingOfficer}`;
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.medicalOfficer) {
        setMedicalOfficers(medicalOfficers.map(officer =>
          officer._id === editingOfficer ? data.medicalOfficer : officer
        ));
        setEditingOfficer(null);
      } else {
        throw new Error('Invalid update response format');
      }
    } catch (error) {
      console.error('Update error:', error);
      setError(`Failed to update medical officer: ${error.message}`);
    }
  };

  const handleDelete = async (officerId) => {
    if (!window.confirm('Are you sure you want to delete this medical officer?')) {
      return;
    }

    try {
      setError('');
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setError('No authentication token found');
        return;
      }

      const deleteUrl = `http://localhost:5000/api/admin/users/medical-officers/${officerId}`;
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      await fetchMedicalOfficers();
    } catch (error) {
      console.error('Delete error:', error);
      setError(`Failed to delete medical officer: ${error.message}`);
    }
  };

  const handleApprovalToggle = async (officer) => {
    try {
      setError('');
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setError('No authentication token found');
        return;
      }

      const updateUrl = `http://localhost:5000/api/admin/users/medical-officers/${officer._id}`;
      const newApprovalStatus = !officer.isApproved;

      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved: newApprovalStatus })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.medicalOfficer) {
        setMedicalOfficers(medicalOfficers.map(o =>
          o._id === officer._id ? data.medicalOfficer : o
        ));
      } else {
        throw new Error('Invalid approval response format');
      }
    } catch (error) {
      console.error('Approval update error:', error);
      setError(`Failed to update approval status: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getSpecializationLabel = (specialization) => {
    const labels = {
      'general': 'General Medicine',
      'toxicology': 'Toxicology',
      'emergency': 'Emergency Medicine',
      'wildlife_medicine': 'Wildlife Medicine'
    };
    return labels[specialization] || specialization;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <UserCheck className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Medical Officer Management</h1>
                <p className="text-sm text-gray-600">Manage all registered medical officers</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search medical officers by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Medical Officers Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading medical officers...</p>
            </div>
          ) : medicalOfficers.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No medical officers found</p>
              <button
                onClick={fetchMedicalOfficers}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medical Officer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License & Hospital
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicalOfficers.map((officer) => (
                    <tr key={officer._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {officer.name ? officer.name.charAt(0).toUpperCase() : '?'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {officer.name || 'No name'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {officer.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {officer.phoneNumber || 'No phone'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getSpecializationLabel(officer.specialization)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-gray-400" />
                            {officer.licenseNumber || 'No license'}
                          </div>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-gray-400" />
                            {officer.hospital || 'No hospital'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {officer.isApproved ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                          {officer.isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div>{formatDate(officer.createdAt)}</div>
                          {officer.lastLogin && (
                            <div className="text-xs text-gray-400">
                              Last login: {formatDate(officer.lastLogin)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingOfficer === officer._id ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleUpdate}
                              className="text-green-600 hover:text-green-900"
                              title="Save changes"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setEditingOfficer(null)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Cancel"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setViewingOfficer(officer)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View details"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEdit(officer)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit officer"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(officer._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete officer"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleApprovalToggle(officer)}
                              className={`${
                                officer.isApproved ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                              }`}
                              title={officer.isApproved ? 'Reject Approval' : 'Approve Officer'}
                            >
                              {officer.isApproved ? (
                                <XCircle className="h-5 w-5" />
                              ) : (
                                <CheckCircle className="h-5 w-5" />
                              )}
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
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
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

        {/* Officer Details Modal */}
        {viewingOfficer && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Medical Officer Details</h3>
                  <button
                    onClick={() => setViewingOfficer(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingOfficer.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingOfficer.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingOfficer.phoneNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                    <p className="mt-1 text-sm text-gray-900">{getSpecializationLabel(viewingOfficer.specialization) || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">License Number</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingOfficer.licenseNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hospital</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingOfficer.hospital || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1 space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        viewingOfficer.isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {viewingOfficer.isApproved ? 'Approved' : 'Pending Approval'}
                      </span>
                      <br />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        viewingOfficer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {viewingOfficer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(viewingOfficer.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Login</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingOfficer.lastLogin ? formatDate(viewingOfficer.lastLogin) : 'Never'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
