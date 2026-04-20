import api from '../../services/api';
import { API_CONFIG } from '../../config/constants';

export const predictSpecies = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  // Note: The ML prediction uses a different base URL
  const response = await fetch(`${API_CONFIG.ML_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Prediction failed with status ${response.status}`);
  }

  return response.json();
};
export const savePrediction = async (imageFile, predictionData, userId) => {
  const formData = new FormData();
  formData.append('identificationImage', imageFile);
  formData.append('userId', userId);
  formData.append('isAnonymous', !userId ? 'true' : 'false');
  formData.append('className', predictionData.ClassName);
  formData.append('commonName', predictionData.CommonEnglishNames);
  formData.append('scientificName', predictionData.ScientificName);
  formData.append('confidence', parseFloat(predictionData.Confidence));
  formData.append('venom', predictionData.Venom);
  formData.append('family', predictionData.Family);
  formData.append('details', JSON.stringify(predictionData));

  // Note: Saving to our Node.js Backend
  const response = await fetch(`${API_CONFIG.BASE_URL}/predictions/save`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to sync identification to history');
  }

  return response.json();
};
