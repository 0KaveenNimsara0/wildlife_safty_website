import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin, Building, Leaf, Search, LocateFixed, Filter } from 'lucide-react';

// IMPORTANT: Make sure you have added the Leaflet CSS to your main index.html file in the <head> section:
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

// Define the locations for snake parks and hotspots
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

// Create custom icons for the map markers
const parkIcon = new Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const hotspotIcon = new Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter locations based on search and type
  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || location.type === filterType;
    return matchesSearch && matchesType;
  });

  // Handle current location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section - Matching project theme */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl p-4 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Wildlife Hotspots Map</h1>
                <p className="text-sm text-gray-300">Explore snake parks and habitats across Sri Lanka</p>
              </div>
            </div>
            <button
              onClick={handleCurrentLocation}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <LocateFixed className="w-4 h-4" />
              <span className="hidden sm:inline">My Location</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm"
              >
                <option value="all">All Locations</option>
                <option value="park">Tourist Parks</option>
                <option value="hotspot">Snake Hotspots</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        
        <MapContainer
          center={mapCenter}
          zoom={8}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
          className="z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="topright" />
          
          {filteredLocations.map((loc, index) => (
            <Marker 
              key={index} 
              position={loc.coordinate} 
              icon={loc.type === 'park' ? parkIcon : hotspotIcon}
            >
              <Popup>
                <div className="font-sans max-w-xs">
                  <div className="flex items-center mb-2">
                    {loc.type === 'park' 
                      ? <Building className="w-5 h-5 mr-2 text-green-600" /> 
                      : <Leaf className="w-5 h-5 mr-2 text-orange-600" />
                    }
                    <strong className="text-lg font-semibold text-gray-800">{loc.title}</strong>
                  </div>
                  <p className="text-gray-700 mb-3">{loc.description}</p>
                  
                  {loc.type === 'park' ? (
                    <div className="space-y-1 text-sm">
                      <p><strong className="text-gray-800">Contact:</strong> {loc.contact}</p>
                      <p><strong className="text-gray-800">Hours:</strong> {loc.hours}</p>
                    </div>
                  ) : (
                    <div className="space-y-1 text-sm">
                      <p><strong className="text-gray-800">Best Time:</strong> {loc.bestTime}</p>
                      <p className="text-orange-600 font-medium">
                        {loc.guideRequired && '⚠️ Guide Required'}
                      </p>
                    </div>
                  )}
                  
                  <button
                  onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: loc.title,
                          text: loc.description,
                        });
                      }
                    }}
                    className="mt-3 w-full bg-indigo-600 text-white py-2 px-3 rounded text-sm hover:bg-indigo-700 transition-colors"
                  >
                    Share Location
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-20">
          <h3 className="font-semibold text-sm mb-2">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs">Tourist Parks</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <span className="text-xs">Snake Hotspots</span>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-lg z-20">
            <p className="text-sm text-gray-600">
              {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

