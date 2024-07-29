import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchData = async (selectedCounty, timeScale, targetYear, scaleValue, selectedDataType) => {
  try {
    //console.log("Inside API.js")
    const response = await axios.get(`${BASE_URL}/getData`, {
      params: {
        targetCounty: selectedCounty,
        timeScale: timeScale,
        timeScaleValue: scaleValue,
        year: targetYear,
        dataType: selectedDataType,
      },
    });
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};
