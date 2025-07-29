import React from 'react';
// Make sure you have installed react-leaflet and leaflet:
// npm install react-leaflet leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
// Make sure you are using the web version of lucide-react, not lucide-react-native
import { MapPin, Building, Leaf } from 'lucide-react';

// IMPORTANT: Make sure you have added the Leaflet CSS to your main index.html file in the <head> section:
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

// Define the locations for snake parks and hotspots
const locations = [
  {
    type: 'park',
    coordinate: [6.8568, 79.8735],
    title: 'Dehiwala Zoo (Reptilium)',
    description: 'A well-maintained reptile house within the National Zoo. Great for safe viewing.',
  },
  {
    type: 'park',
    coordinate: [5.9986, 80.4583],
    title: 'Snake Farm Weligama',
    description: 'A family-run conservation project focused on snake rescue and education.',
  },
  {
    type: 'park',
    coordinate: [7.3019, 80.3803],
    title: 'Pinnawala Zoo',
    description: 'Features a variety of local wildlife, including a dedicated reptile section.',
  },
  {
    type: 'hotspot',
    coordinate: [6.4167, 80.5000],
    title: 'Sinharaja Forest Reserve',
    description: 'A UNESCO World Heritage Site with immense biodiversity, including many endemic snake species.',
  },
  {
    type: 'hotspot',
    coordinate: [6.3667, 81.4167],
    title: 'Yala National Park',
    description: 'Dry zone habitat. High chance of seeing Russell\'s Vipers and Cobras.',
  },
  {
    type: 'hotspot',
    coordinate: [8.4250, 80.0000],
    title: 'Wilpattu National Park',
    description: 'Sri Lanka\'s largest national park, known for Pythons and other large reptiles.',
  },
  {
    type: 'hotspot',
    coordinate: [6.4383, 80.8966],
    title: 'Udawalawe National Park',
    description: 'An important habitat for many reptiles, often found near the reservoir.',
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
  return (
    <div className="space-y-8">
      <div className="text-center p-6 rounded-xl shadow-lg bg-white">
          <MapPin className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Wildlife Hotspots Map</h2>
          <p className="text-gray-600">Explore snake parks and known habitats across Sri Lanka.</p>
      </div>

      <div className="h-[600px] w-full rounded-xl shadow-2xl overflow-hidden border-4 border-white">
        <MapContainer center={[7.8731, 80.7718]} zoom={8} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {locations.map((loc, index) => (
            <Marker 
              key={index} 
              position={loc.coordinate} 
              icon={loc.type === 'park' ? parkIcon : hotspotIcon}
            >
              <Popup>
                <div className="font-sans">
                  <div className="flex items-center mb-1">
                    {loc.type === 'park' 
                      ? <Building className="w-4 h-4 mr-2 text-green-600" /> 
                      : <Leaf className="w-4 h-4 mr-2 text-orange-600" />
                    }
                    <strong className="text-md">{loc.title}</strong>
                  </div>
                  <p>{loc.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="flex justify-center items-center space-x-8 bg-white p-4 rounded-xl shadow-lg">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2 border-2 border-white shadow-md"></div>
          <span className="font-medium text-gray-700">Tourist Parks</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-orange-500 mr-2 border-2 border-white shadow-md"></div>
          <span className="font-medium text-gray-700">Snake Hotspots</span>
        </div>
      </div>
    </div>
  );
}
