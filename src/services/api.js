// Create a context for all files in the mockDB folder
const context = require.context('../mockDB', false, /\.json$/);

// Create an object to store all imported data
const dataMap = {};

// Iterate over all matched files and import them
context.keys().forEach((key) => {
  const fileName = key.replace('./', ''); // Remove './' from the file path
  dataMap[fileName] = context(key); // Import the file and store it in dataMap
});

// Function to get data from a specific file
export const getDataFromFile = (filename) => {
  return new Promise((resolve, reject) => {
    if (dataMap[filename]) {
      resolve(dataMap[filename]);
    } else {
      reject(new Error('File not found'));
    }
  });
};

// Updated fetchData function to use the context approach
export const fetchData = async (selectedCounty, timeScale, targetYear, scaleValue, selectedDataType) => {
  try {
    const fileName = `${selectedCounty}_${timeScale}_${targetYear}_${scaleValue || ''}_${selectedDataType}.json`;
    
    // Use the dataMap to retrieve data instead of fetching from URL
    const data = await getDataFromFile(fileName);
    
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};
