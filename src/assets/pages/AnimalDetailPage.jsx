import React, { useState, useEffect } from 'react';
import { Search, MapPin, Shield, Info, Book, Heart, Globe, Users } from 'lucide-react';

// Import your animal data
import animalsData from '../data/sri_lanka_snakes_data.json';

const UNSPLASH_ACCESS_KEY = 'UrY7BUpS9xMkyfu9YmsUetjp5N1YLtcbnRtQ8Wy71xo';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

const AnimalDetailPage = () => {
  const [selectedAnimal, setSelectedAnimal] = useState(animalsData[0]);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
        const imageUrl = data.results[0]?.urls?.regular;
        setImage(imageUrl || null);
      } catch (error) {
        console.error('Error fetching image:', error);
        setImage(null);
      } finally {
        setLoading(false);
      }
    };

    if (selectedAnimal) {
      fetchImage();
    }
  }, [selectedAnimal]);

  const getVenomBadgeColor = (venom) => {
    if (venom.toLowerCase().includes('highly dangerous')) return 'bg-red-100 text-red-800 border-red-200';
    if (venom.toLowerCase().includes('venomous')) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusBadgeColor = (status) => {
    if (status.includes('Endangered')) return 'bg-red-100 text-red-800 border-red-200';
    if (status.includes('Vulnerable')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (status.includes('Near Threatened')) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg w-full">
        <div className="px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🌿 Sri Lankan Wildlife Explorer
            </h1>
            <p className="text-xl text-emerald-100">
              Discover the rich biodiversity of Sri Lanka's endemic and native wildlife species
            </p>
          </div>
        </div>
      </header>

      {/* Search and Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm w-full">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search animals by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Animal Selector */}
            <div className="flex-1 min-w-0">
              <select
                onChange={(e) =>
                  setSelectedAnimal(
                    animalsData.find((a) => a['Common English Name(s)'] === e.target.value)
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-gray-900"
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
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Image Section */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                  {loading ? (
                    <div className="flex items-center justify-center h-80">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading image...</p>
                      </div>
                    </div>
                  ) : image ? (
                    <img
                      src={image}
                      alt={selectedAnimal['Common English Name(s)']}
                      className="w-full h-80 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-80">
                      <div className="text-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          📷
                        </div>
                        <p>No image available</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-gray-50 text-sm text-gray-600">
                  <p>📸 Image source: Unsplash</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              
              {/* Title and Scientific Name */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {selectedAnimal['Common English Name(s)']}
                </h1>
                <p className="text-lg text-gray-600 italic">
                  {selectedAnimal['Scientific Name & Authority']}
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getVenomBadgeColor(selectedAnimal['Venom & Medical Significance'])}`}>
                  <Shield className="w-4 h-4 inline mr-2" />
                  {selectedAnimal['Venom & Medical Significance']}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadgeColor(selectedAnimal['Global IUCN Red List Status'])}`}>
                  <Globe className="w-4 h-4 inline mr-2" />
                  {selectedAnimal['Global IUCN Red List Status']}
                </span>
                {selectedAnimal['Endemic Status'] === 'Endemic to Sri Lanka' && (
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    <Heart className="w-4 h-4 inline mr-2" />
                    Endemic to Sri Lanka
                  </span>
                )}
              </div>

              {/* Quick Facts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-emerald-600" />
                    Family
                  </h4>
                  <p className="text-gray-700">{selectedAnimal['Family']}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                    Habitat
                  </h4>
                  <p className="text-gray-700">{selectedAnimal['Areas spread across Sri Lanka']}</p>
                </div>
              </div>

              {/* Local Names */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6 mb-8 border border-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Book className="w-5 h-5 mr-2 text-emerald-600" />
                  Local Names
                </h3>
                <p className="text-gray-700 text-lg">
                  {selectedAnimal['Local Name(s) (Sinhala/Tamil)']}
                </p>
              </div>

              {/* Detailed Sections */}
              <div className="space-y-8">
                
                {/* Recognition */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Search className="w-5 h-5 mr-2 text-emerald-600" />
                    How to Recognize
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedAnimal['how to find(recognize)']}
                    </p>
                  </div>
                </section>

                {/* Diet */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    🍽️ Diet & Feeding
                  </h3>
                  <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedAnimal['foods they eat']}
                    </p>
                  </div>
                </section>

                {/* Description */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-emerald-600" />
                    Detailed Description
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedAnimal['A detailed description']}
                    </p>
                  </div>
                </section>

                {/* Reproduction */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-emerald-600" />
                    Reproduction
                  </h3>
                  <div className="bg-pink-50 rounded-lg p-6 border border-pink-100">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedAnimal['Contagion (Reproduction)']}
                    </p>
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