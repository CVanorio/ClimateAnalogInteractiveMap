// src/api.js
import axios from 'axios';

const BASE_URL = 'https://localhost:3000'

export const fetchData = async (selectedCounty, timeScale, scaleValue, targetYear, selectedDataType) => {
  try {
    const response = await axios.get(`${BASE_URL}/data`, {
      params: {
        county: selectedCounty,
        dateType: timeScale,
        dateValue: scaleValue,
        year: targetYear,
        dataType: selectedDataType,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
