import axios from 'axios';

export const fetchData = async (selectedCounty, timeScale, targetYear, scaleValue, selectedDataType) => {
  try {
    // Construct the file name
    const fileName = `${selectedCounty}_${timeScale}_${targetYear}_${scaleValue || ''}_${selectedDataType}.json`;
    
    // Fetch the file from the server
    const response = await fetch(`./mockDB/${fileName}`);
    
    // Check if the response is ok
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    // Parse the JSON content
    const data = await response.json();

    // Return the data
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};
