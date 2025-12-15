import React, { useState, useEffect } from 'react';
import { MapPin, Search, LocateFixed, Filter } from 'lucide-react';

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

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

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

  // Generate Google Maps iframe URL
  const getGoogleMapsUrl = () => {
    if (selectedLocation) {
      // Show specific location
      const [lat, lng] = selectedLocation.coordinate;
      return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    } else {
      // Show overview of all filtered locations
      const [centerLat, centerLng] = mapCenter;
      return `https://maps.google.com/maps?q=${centerLat},${centerLng}&z=8&output=embed`;
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

        {/* Locations List */}
        {filteredLocations.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Filtered Locations</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {filteredLocations.map((location, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedLocation === location
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <h4 className="font-semibold text-blue-600">{location.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                  {location.type === 'park' ? (
                    <div className="text-xs text-gray-500 mt-2">
                      <p>Contact: {location.contact}</p>
                      <p>Hours: {location.hours}</p>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 mt-2">
                      <p>Best Time: {location.bestTime}</p>
                      {location.guideRequired && <p className="text-orange-600">Guide Required</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          <div className="h-96 md:h-[500px] rounded-b-xl overflow-hidden">
            <iframe
              src={getGoogleMapsUrl()}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            ></iframe>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="text-center text-gray-600">
            Showing {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedLocation && ` | Viewing: ${selectedLocation.title}`}
          </p>
          {selectedLocation && (
            <button
              onClick={() => setSelectedLocation(null)}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Show all locations
            </button>
          )}
        </div>
      </main>
    </>
  );
}
