// AnimalDetailPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import your animal data
import animalsData from '../data/animals_with_images.json';

// 🔑 Replace with your Unsplash Access Key
const UNSPLASH_ACCESS_KEY = 'UrY7BUpS9xMkyfu9YmsUetjp5N1YLtcbnRtQ8Wy71xo'; // ← Replace!
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

const AnimalDetailPage = () => {
  const [selectedAnimal, setSelectedAnimal] = useState(animalsData[0]);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      try {
        const response = await axios.get(UNSPLASH_API_URL, {
          params: {
            query: `${selectedAnimal['Common Name']} Sri Lanka wildlife`,
            orientation: 'landscape',
            per_page: 1,
            client_id: UNSPLASH_ACCESS_KEY,
          },
        });

        const imageUrl = response.data.results[0]?.urls?.regular;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
      {/* Header - Full Width */}
      <header style={{
        width: '100%',
        backgroundColor: '#064e3b',
        color: '#ffffff',
        textAlign: 'center',
        padding: '40px 20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: '600',
          margin: '0 0 10px 0',
          background: 'linear-gradient(to right, #34d399, #6ee7b7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🐍 Sri Lankan Wildlife Explorer
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#a7f3d0',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          Discover venomous and non-venomous animals of Sri Lanka — from snakes to amphibians and insects.
        </p>
      </header>

      {/* Navigation - Full Width Dropdown */}
      <div style={{
        backgroundColor: '#065f46',
        color: '#ffffff',
        padding: '15px 20px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}>
        <label htmlFor="animal-select" style={{
          fontWeight: '600',
          marginRight: '15px',
          fontSize: '1.1rem',
        }}>
          🔍 Select an Animal:
        </label>
        <select
          id="animal-select"
          onChange={(e) =>
            setSelectedAnimal(
              animalsData.find((a) => a['Common Name'] === e.target.value)
            )
          }
          style={{
            fontSize: '1rem',
            padding: '10px 15px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#ecf0f1',
            color: '#2c3e50',
            minWidth: '300px',
            fontWeight: '500',
            outline: 'none',
          }}
        >
          {animalsData.map((animal) => (
            <option
              key={animal['Common Name']}
              value={animal['Common Name']}
              style={{ padding: '10px' }}
            >
              {animal['Common Name']} ({animal['Scientific Name']})
            </option>
          ))}
        </select>
      </div>

      {/* Main Content - Full Width Flex Layout */}
      <main style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '0',
        marginTop: '20px',
        width: '100%',
        minHeight: 'calc(100vh - 200px)',
      }}>
        
        {/* Left: Image Section - 40% Width */}
        <div style={{
          flex: '0 0 40%',
          height: '80vh',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {loading ? (
            <p style={{
              fontSize: '1.5rem',
              color: '#7f8c8d',
            }}>🔄 Loading image...</p>
          ) : image ? (
            <img
              src={image}
              alt={selectedAnimal['Common Name']}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
              }}
              onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
            />
          ) : (
            <div style={{
              textAlign: 'center',
              color: '#e74c3c',
              fontWeight: 'bold',
              fontSize: '1.2rem',
            }}>
              📷 No image available
            </div>
          )}
          {/* Overlay Caption */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            padding: '10px',
            fontSize: '0.9rem',
            textAlign: 'center',
          }}>
            Photo of {selectedAnimal['Common Name']} | Source: Unsplash
          </div>
        </div>

        {/* Right: Details Section - 60% Width */}
        <div style={{
          flex: '0 0 60%',
          padding: '40px',
          backgroundColor: '#fff',
          overflowY: 'auto',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        }}>
          <h2 style={{
            fontSize: '2.2rem',
            color: '#2980b9',
            borderBottom: '3px solid #3498db',
            paddingBottom: '10px',
            marginBottom: '20px',
          }}>
            {selectedAnimal['Common Name']}
          </h2>

          <p><strong>Scientific Name:</strong> <em>{selectedAnimal['Scientific Name']}</em></p>

          <p>
            <strong>Venom Level:</strong>{' '}
            <span style={{
              color: selectedAnimal['Poison Level'] === 'Highly Venomous' ? '#c0392b' :
                     selectedAnimal['Poison Level'] === 'Mildly Venomous' ? '#f39c12' : '#27ae60',
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}>
              {selectedAnimal['Poison Level']}
            </span>
          </p>

          <p><strong>Danger Level:</strong> {selectedAnimal['Danger Level']}</p>
          <p><strong>Type:</strong> {selectedAnimal['Category']}</p>
          <p><strong>Endemic:</strong> {selectedAnimal['Endemic'] === 'Yes' ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Habitat:</strong> {selectedAnimal['Region']}</p>
          <p><strong>Venom Type:</strong> {selectedAnimal['Venom Type'] || 'N/A'}</p>

          <div style={{ marginTop: '25px' }}>
            <h3 style={{ color: '#2c3e50' }}>Behavior When Threatened</h3>
            <p>{selectedAnimal['Behavior (Agitated)']}</p>
          </div>

          <div style={{
            marginTop: '25px',
            backgroundColor: '#e3f2fd',
            padding: '20px',
            borderRadius: '8px',
            borderLeft: '5px solid #2196f3'
          }}>
            <h3>🩹 First Aid</h3>
            <p>{selectedAnimal['If Attacked']}</p>
          </div>

          <div style={{ marginTop: '25px', fontSize: '1rem', lineHeight: '1.7' }}>
            <h3>Description</h3>
            <p>{selectedAnimal['Description']}</p>
          </div>
        </div>
      </main>

      
    </div>
    
  );
};

export default AnimalDetailPage;