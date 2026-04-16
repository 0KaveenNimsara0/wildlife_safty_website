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
