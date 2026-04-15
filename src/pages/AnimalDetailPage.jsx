import React, { useState, useEffect } from 'react';
import { Search, MapPin, Shield, Info, Book, Heart, Globe, Users, ChevronLeft, Layout, Zap, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import your animal data
import animalsData from '../data/sri_lanka_snakes_data.json';

const UNSPLASH_ACCESS_KEY = 'UrY7BUpS9xMkyfu9YmsUetjp5N1YLtcbnRtQ8Wy71xo';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

const AnimalDetailPage = () => {
  const [selectedAnimal, setSelectedAnimal] = useState(animalsData[0]);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredAnimals = animalsData.filter(animal =>
    animal['Common English Name(s)'].toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal['Scientific Name & Authority'].toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${UNSPLASH_API_URL}?query=${encodeURIComponent(selectedAnimal['Common English Name(s)'] + ' Sri Lanka wildlife')}&orientation=landscape&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await response.json();
        setImage(data.results[0]?.urls?.regular || null);
      } catch (error) {
        setImage(null);
      } finally {
        setLoading(false);
      }
    };

    if (selectedAnimal) fetchImage();
  }, [selectedAnimal]);

  const getVenomBadgeColor = (venom) => {
    const v = venom.toLowerCase();
    if (v.includes('highly dangerous')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (v.includes('venomous')) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  const getStatusBadgeColor = (status) => {
    if (status.includes('Endangered')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (status.includes('Vulnerable')) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-sky-100 text-sky-800 border-sky-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-fade-in">
      {/* Search & Navigation Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center p-6 glass rounded-[2.5rem] border-slate-100 shadow-xl">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white rounded-full text-slate-400 hover:text-emerald-600 hover:shadow-lg transition-all active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search biological database..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-medium"
          />
        </div>

        <div className="w-full md:w-80">
          <select
            onChange={(e) => setSelectedAnimal(animalsData.find(a => a['Common English Name(s)'] === e.target.value))}
            className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-2xl appearance-none focus:border-emerald-500 focus:outline-none transition-all font-bold text-slate-800 shadow-sm"
            value={selectedAnimal['Common English Name(s)']}
          >
            {filteredAnimals.map((animal) => (
              <option key={animal['Common English Name(s)']} value={animal['Common English Name(s)']}>
                {animal['Common English Name(s)']}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Visual Identification Hub */}
        <div className="lg:col-span-5 space-y-8">
          <div className="card-premium p-0 overflow-hidden relative group shadow-2xl">
            <div className="aspect-[4/3] bg-slate-900 flex items-center justify-center overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center gap-4 text-emerald-500">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-black uppercase tracking-widest">Retrieving Asset</span>
                </div>
              ) : image ? (
                <img
                  src={image}
                  alt={selectedAnimal['Common English Name(s)']}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="text-center text-slate-600 space-y-2">
                  <Layout size={48} className="mx-auto opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest">No visual asset</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-gradient-to-t from-slate-900 to-slate-900/80 text-white">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight">{selectedAnimal['Common English Name(s)']}</h2>
                  <p className="text-emerald-400 text-sm italic font-medium">{selectedAnimal['Scientific Name & Authority']}</p>
                </div>
                <div className="bg-emerald-500/20 p-3 rounded-2xl backdrop-blur-md border border-emerald-500/30">
                  <Zap className="text-emerald-400" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card-premium p-6 border-slate-100 flex flex-col gap-3">
              <div className="p-2 bg-emerald-50 w-fit rounded-lg"><Hash size={16} className="text-emerald-600" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Family</p>
                <p className="text-sm font-black text-slate-800">{selectedAnimal['Family']}</p>
              </div>
            </div>
            <div className="card-premium p-6 border-slate-100 flex flex-col gap-3">
              <div className="p-2 bg-sky-50 w-fit rounded-lg"><MapPin size={16} className="text-sky-600" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Habitat Range</p>
                <p className="text-sm font-black text-slate-800 truncate">{selectedAnimal['Areas spread across Sri Lanka']}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Data */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 flex items-center gap-2 ${getVenomBadgeColor(selectedAnimal['Venom & Medical Significance'])}`}>
                <Shield size={12} />
                {selectedAnimal['Venom & Medical Significance']}
              </span>
              <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 flex items-center gap-2 ${getStatusBadgeColor(selectedAnimal['Global IUCN Red List Status'])}`}>
                <Globe size={12} />
                {selectedAnimal['Global IUCN Red List Status']}
              </span>
              {selectedAnimal['Endemic Status'] === 'Endemic to Sri Lanka' && (
                <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-100 text-purple-800 border-2 border-purple-200 flex items-center gap-2">
                  <Heart size={12} />
                  Native / Endemic
                </span>
              )}
            </div>

            <div className="card-premium p-8 border-slate-100 bg-slate-50/30">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">Vernacular Nomenclature</h3>
              <p className="text-3xl font-black text-slate-900 leading-tight">
                {selectedAnimal['Local Name(s) (Sinhala/Tamil)']}
              </p>
            </div>
          </div>

          <div className="grid gap-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900">
                <Search size={20} className="text-emerald-600" />
                <h3 className="text-xl font-black tracking-tight">Field Identification</h3>
              </div>
              <div className="card-premium p-6 bg-white border-slate-100 leading-relaxed text-slate-600 font-medium">
                {selectedAnimal['how to find(recognize)']}
              </div>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900">
                  <Info size={20} className="text-emerald-600" />
                  <h3 className="text-lg font-black tracking-tight">Biological Audit</h3>
                </div>
                <div className="card-premium p-6 bg-white border-slate-100 text-sm leading-relaxed text-slate-500 font-medium">
                  {selectedAnimal['A detailed description']}
                </div>
              </section>

              <div className="space-y-8">
                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-900">
                    <Heart size={20} className="text-rose-500" />
                    <h3 className="text-lg font-black tracking-tight">Reproduction</h3>
                  </div>
                  <div className="card-premium p-6 bg-rose-50/30 border-rose-100 text-sm leading-relaxed text-slate-600 font-medium">
                    {selectedAnimal['Contagion (Reproduction)']}
                  </div>
                </section>
                
                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-900">
                    <Book size={20} className="text-sky-500" />
                    <h3 className="text-lg font-black tracking-tight">Trophic Ecology</h3>
                  </div>
                  <div className="card-premium p-6 bg-sky-50/30 border-sky-100 text-sm leading-relaxed text-slate-600 font-medium">
                    {selectedAnimal['foods they eat']}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetailPage;
