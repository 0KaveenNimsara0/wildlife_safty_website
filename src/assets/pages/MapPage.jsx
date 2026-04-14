import React, { useState, useEffect } from 'react';
import { MapPin, Search, LocateFixed, Filter, Info, Phone, Clock, Navigation, AlertCircle, ChevronRight, Map as MapIcon, Shield, Activity } from 'lucide-react';

const locations = [
  {
    type: 'park',
    coordinate: [6.8568, 79.8735],
    title: 'Dehiwala Zoo (Reptilium)',
    description: 'A well-maintained reptile house within the National Zoo. Great for safe viewing.',
    contact: '+94 11 271 2750',
    hours: '8:30 AM - 6:00 PM',
  },
  {
    type: 'park',
    coordinate: [5.9986, 80.4583],
    title: 'Snake Farm Weligama',
    description: 'A family-run conservation project focused on snake rescue and education.',
    contact: '+94 77 123 4567',
    hours: '9:00 AM - 5:00 PM',
  },
  {
    type: 'park',
    coordinate: [7.3019, 80.3803],
    title: 'Pinnawala Zoo',
    description: 'Features a variety of local wildlife, including a dedicated reptile section.',
    contact: '+94 35 226 9367',
    hours: '8:30 AM - 6:00 PM',
  },
  {
    type: 'hotspot',
    coordinate: [6.4167, 80.5000],
    title: 'Sinharaja Forest Reserve',
    description: 'A UNESCO World Heritage Site with immense biodiversity, including many endemic snake species.',
    bestTime: '6:00 AM - 4:00 PM',
    guideRequired: true,
  },
  {
    type: 'hotspot',
    coordinate: [6.3667, 81.4167],
    title: 'Yala National Park',
    description: 'Dry zone habitat. High chance of seeing Russell\'s Vipers and Cobras.',
    bestTime: '6:00 AM - 6:00 PM',
    guideRequired: true,
  },
  {
    type: 'hotspot',
    coordinate: [8.4250, 80.0000],
    title: 'Wilpattu National Park',
    description: 'Sri Lanka\'s largest national park, known for Pythons and other large reptiles.',
    bestTime: '6:00 AM - 6:00 PM',
    guideRequired: true,
  },
  {
    type: 'hotspot',
    coordinate: [6.4383, 80.8966],
    title: 'Udawalawe National Park',
    description: 'An important habitat for many reptiles, often found near the reservoir.',
    bestTime: '6:00 AM - 6:00 PM',
    guideRequired: true,
  },
];

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || location.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setMapCenter([position.coords.latitude, position.coords.longitude]),
        (error) => alert('Unable to get your location. Please enable location services.')
      );
    }
  };

  const getGoogleMapsUrl = () => {
    if (selectedLocation) {
      const [lat, lng] = selectedLocation.coordinate;
      return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    }
    const [centerLat, centerLng] = mapCenter;
    return `https://maps.google.com/maps?q=${centerLat},${centerLng}&z=8&output=embed`;
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-fade-in">
      {/* Premium Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-200">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.2em] text-xs">
            <MapIcon size={16} />
            <span>Regional intelligence</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none">
            Wildlife <span className="text-emerald-600">Hotspots</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl">
            Explore safe viewing areas and protected habitats across the island. Professional spatial data for safety and research.
          </p>
        </div>
        
        {/* Modern Controls */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-fit">
          <div className="relative group flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search habitats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-3xl focus:border-emerald-500 focus:outline-none transition-all shadow-sm"
            />
          </div>
          
          <div className="relative flex-1 sm:w-60">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white border-2 border-slate-100 rounded-3xl appearance-none focus:border-emerald-500 focus:outline-none transition-all shadow-sm font-bold text-slate-700"
            >
              <option value="all">Global View</option>
              <option value="park">Tourist Parks</option>
              <option value="hotspot">Scientific Hotspots</option>
            </select>
          </div>

          <button
            onClick={handleCurrentLocation}
            className="btn-primary py-4 px-8 flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <LocateFixed size={20} />
            <span>Nearby</span>
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Information Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Found {filteredLocations.length} <span className="text-slate-400 font-medium">sites</span>
            </h3>
            {selectedLocation && (
              <button onClick={() => setSelectedLocation(null)} className="text-xs font-black uppercase text-emerald-600 tracking-widest hover:underline">
                Reset Selection
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
            {filteredLocations.map((location, index) => (
              <div
                key={index}
                onClick={() => setSelectedLocation(location)}
                className={`card-premium p-6 group cursor-pointer transition-all duration-300 border-2 ${
                  selectedLocation === location 
                  ? 'border-emerald-500 bg-emerald-50/30' 
                  : 'border-transparent hover:border-slate-200 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        location.type === 'park' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {location.type}
                      </span>
                      {location.guideRequired && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest">
                          <AlertCircle size={10} />
                          Guide Mandatory
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-black text-slate-900 leading-none group-hover:text-emerald-700 transition-colors">
                        {location.title}
                      </h4>
                      <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed italic">
                        "{location.description}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      {location.type === 'park' ? (
                        <>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Phone size={14} className="text-emerald-500" />
                            <span className="text-[11px] font-bold">{location.contact}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock size={14} className="text-emerald-500" />
                            <span className="text-[11px] font-bold">{location.hours}</span>
                          </div>
                        </>
                      ) : (
                        <div className="col-span-2 flex items-center gap-2 text-slate-400">
                          <Navigation size={14} className="text-emerald-500" />
                          <span className="text-[11px] font-bold">Optimal Visit: {location.bestTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className={`text-slate-300 group-hover:text-emerald-500 transition-all ${selectedLocation === location ? 'rotate-90 text-emerald-500' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Visualization */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card-premium h-[600px] overflow-hidden border-0 shadow-2xl relative">
            {isLoading && (
              <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-sm z-20 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-xl" />
              </div>
            )}
            
            <iframe
              src={getGoogleMapsUrl()}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Global Intelligence Map"
              className="grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            />
          </div>

          {/* Map Legend/Quick Info */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Safety Index', val: '98%', icon: Shield },
              { label: 'Live Alerts', val: 'None', icon: Activity },
              { label: 'Verified Spots', val: '24+', icon: MapPin }
            ].map((stat, i) => (
              <div key={i} className="card-premium p-4 flex flex-col items-center justify-center text-center gap-1 border-slate-100">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">{stat.label}</span>
                <span className="text-sm font-black text-slate-800">{stat.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
