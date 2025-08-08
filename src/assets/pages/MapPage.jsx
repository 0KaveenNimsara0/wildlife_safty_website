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
      <>
        <main className="max-w-7xl mx-auto space-y-8 p-4">
          {/* Header Section */}
          <header className="text-center mb-8">
            <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Wildlife Hotspots Map</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore snake parks and habitats across Sri Lanka with our interactive map
            </p>
          </header>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Locations</option>
              <option value="park">Tourist Parks</option>
              <option value="hotspot">Snake Hotspots</option>
            </select>
          </div>
          <button
            onClick={handleCurrentLocation}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LocateFixed className="w-4 h-4" />
            <span>My Location</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        <div className="h-96 md:h-[500px] rounded-b-xl overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={8}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            className="rounded-b-xl"

          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredLocations.map((loc, index) => (
              <Marker 
                key={index} 
                position={loc.coordinate} 
                icon={loc.type === 'park' ? parkIcon : hotspotIcon}
              >
                <Popup>
                  <div className="max-w-xs">
                    <h3 className="font-bold text-lg mb-2">{loc.title}</h3>
                    <p className="text-sm text-gray-700 mb-2">{loc.description}</p>
                    
                    {loc.type === 'park' ? (
                      <div className="text-sm space-y-1">
                        <p><strong>Contact:</strong> {loc.contact}</p>
                        <p><strong>Hours:</strong> {loc.hours}</p>
                      </div>
                    ) : (
                      <div className="text-sm space-y-1">
                        <p><strong>Best Time:</strong> {loc.bestTime}</p>
                        {loc.guideRequired && <p className="text-orange-600 font-medium">Guide Required</p>}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
        <p className="text-center text-gray-600">
          Showing {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>
    </main>
      </>
  );
}
