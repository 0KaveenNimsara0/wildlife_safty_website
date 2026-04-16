const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'UrY7BUpS9xMkyfu9YmsUetjp5N1YLtcbnRtQ8Wy71xo';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

export const fetchAnimalImage = async (animalName) => {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}?query=${encodeURIComponent(
        animalName + ' Sri Lanka wildlife'
      )}&orientation=landscape&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();
    return data.results[0]?.urls?.regular || null;
  } catch (error) {
    console.error('Failed to fetch animal image:', error);
    return null;
  }
};
