import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; //https://wwwtest.climatology.nelson.wisc.edu/climate-change-app/

// Function to fetch data from the server based on user selections
export const fetchData = async (selectedCounty, timeScale, targetYear, scaleValue, selectedDataType) => {
  try {
    // Make a GET request to the server with the specified parameters
    const response = await axios.get(`${BASE_URL}/getData`, {
      params: {
        targetCounty: selectedCounty,
        timeScale: timeScale,
        timeScaleValue: scaleValue,
        year: targetYear,
        dataType: selectedDataType,
      },
    });

    console.log(selectedCounty)
    
    // Return the data received from the server
    return response.data;
  } catch (error) {
    // Log any errors that occur during the request
    console.error('Error fetching data:', error);
    return error; // Return the error to handle it
  }
};
