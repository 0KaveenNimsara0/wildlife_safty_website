import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { RefreshCcw, Loader2 } from 'lucide-react';

import { BASE_URL } from '../../../config/constants';

const MedicalOfficerSelector = ({ onSelect, selectedMedicalOfficer }) => {
  const { currentUser } = useAuth();
  const [medicalOfficers, setMedicalOfficers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getIdToken = async () => {
    if (currentUser) {
      // Firebase users have this method
      if (typeof currentUser.getIdToken === 'function') {
        return await currentUser.getIdToken();
      }
      // MongoDB users have their token in localStorage
      return localStorage.getItem('userToken');
    }
    return null;
  };

  const fetchMedicalOfficers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getIdToken();
      if (!token) return;

      const response = await fetch(`${BASE_URL}/user/chat/medical-officers`, {
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
      general: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      toxicology: 'bg-rose-100 text-rose-800 border-rose-200',
      emergency: 'bg-amber-100 text-amber-800 border-amber-200',
      wildlife_medicine: 'bg-sky-100 text-sky-800 border-sky-200',
    };
    return colors[specialization] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="p-6 border-b border-slate-100 bg-emerald-50/20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Available Officers</h3>
        <button
          onClick={fetchMedicalOfficers}
          className="p-2.5 rounded-xl bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm border border-emerald-100 transition-all active:scale-90"
          title="Refresh List"
        >
          <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 opacity-20" />
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-6 animate-fade-in text-center">
          <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mb-3">{error}</p>
          <button
            onClick={fetchMedicalOfficers}
            className="text-white bg-rose-500 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-rose-200"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
        {medicalOfficers.map((officer) => (
          <div
            key={officer._id}
            onClick={() => onSelect(officer)}
            className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer group ${
              selectedMedicalOfficer?._id === officer._id
                ? 'border-emerald-500 bg-white shadow-xl shadow-emerald-900/5 ring-4 ring-emerald-50'
                : 'border-slate-100 bg-white/50 hover:bg-white hover:border-emerald-200 hover:shadow-lg'
            }`}
          >
            <div className="flex gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-110 transition-transform">
                  {officer.name?.charAt(0) || 'O'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-slate-800 text-sm tracking-tight">{officer.name}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getSpecializationColor(
                      officer.specialization
                    )}`}
                  >
                    {officer.specialization.replace('_', ' ')}
                  </span>
                </div>
                {officer.hospital && (
                   <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-2 flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-slate-300" /> {officer.hospital}
                   </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {!loading && medicalOfficers.length === 0 && (
          <div className="text-center py-12 space-y-3 opacity-30">
            <RefreshCcw size={32} className="mx-auto text-slate-200" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Specialists Available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalOfficerSelector;

