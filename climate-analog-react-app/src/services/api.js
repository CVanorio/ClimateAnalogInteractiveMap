// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Replace with your actual backend API URL

export const fetchData = async (county, scale, fetchTemperature, fetchPrecipitation) => {
  try {
    let endpoint = `${API_URL}/data`;

    // Prepare query parameters based on selected options
    const params = {
      county,
      scale,
      temperature: fetchTemperature ? 'temp' : '',
      precipitation: fetchPrecipitation ? 'precip' : '',
    };

    // Adjust endpoint based on scale and additional parameters
    if (scale === 'top_analogs') {
      endpoint += '/top-analogs'; // Example endpoint for fetching top analogs
    }

    const response = await axios.get(endpoint, { params });
    return response.data; // Assuming the API returns an array of data points
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Propagate error to handle it in the component
  }
};
