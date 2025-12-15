import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { RefreshCcw, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const MedicalOfficerSelector = ({ onSelect, selectedMedicalOfficer }) => {
  const { currentUser } = useAuth();
  const [medicalOfficers, setMedicalOfficers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getIdToken = async () => {
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  };

  const fetchMedicalOfficers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getIdToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/user/chat/medical-officers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setMedicalOfficers(data.medicalOfficers);
      } else {
        setError(data.message || 'Failed to load medical officers');
      }
    } catch (error) {
      console.error('Error fetching medical officers:', error);
      setError('Failed to load medical officers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchMedicalOfficers();
  }, [currentUser]);

  const getSpecializationColor = (specialization) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      toxicology: 'bg-red-100 text-red-800',
      emergency: 'bg-orange-100 text-orange-800',
      wildlife_medicine: 'bg-green-100 text-green-800',
    };
    return colors[specialization] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4 border-b border-green-100 bg-green-50/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-green-800">Available Officers</h3>
        <button
          onClick={fetchMedicalOfficers}
          className="p-2 rounded-full hover:bg-green-100 transition"
          title="Refresh List"
        >
          <RefreshCcw size={18} className="text-green-700" />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchMedicalOfficers}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {medicalOfficers.map((officer) => (
          <div
            key={officer._id}
            onClick={() => onSelect(officer)}
            className={`p-3 rounded-lg border transition cursor-pointer ${
              selectedMedicalOfficer?._id === officer._id
                ? 'border-green-500 bg-green-100'
                : 'border-green-100 hover:bg-green-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-green-900">{officer.name}</h4>
                <p className="text-sm text-green-700">{officer.email}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getSpecializationColor(
                      officer.specialization
                    )}`}
                  >
                    {officer.specialization.replace('_', ' ')}
                  </span>
                  {officer.hospital && (
                    <span className="text-xs text-gray-500">{officer.hospital}</span>
                  )}
                </div>
                {officer.phoneNumber && (
                  <p className="text-xs text-gray-500 mt-1">📞 {officer.phoneNumber}</p>
                )}
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
            </div>
          </div>
        ))}

        {!loading && medicalOfficers.length === 0 && (
          <div className="text-center py-6">
            <div className="text-3xl text-green-300 mb-2">👨‍⚕️</div>
            <p className="text-green-700 text-sm">No medical officers available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalOfficerSelector;
