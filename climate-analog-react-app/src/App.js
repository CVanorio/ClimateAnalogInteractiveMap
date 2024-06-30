import React, { useState, useEffect } from 'react';
import './App.css';
import MapComponent from './components/MapComponent'; // Assuming LeafletMap is renamed to MapComponent
import Sidebar from './components/Sidebar';
import { fetchData } from './services/api'; // Import the fetchData function

const App = () => {
  const [selectedCounty, setSelectedCounty] = useState('');
  const [timeScale, setTimeScale] = useState('by_year');
  const [scaleValue, setScaleValue] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [selectedDataType, setSelectedDataType] = useState('both'); // 'both' is default for DataTypeSelector
  const [menuVisible, setMenuVisible] = useState(true); // State to control menu visibility
  const [mapData, setMapData] = useState(null); // State to store fetched data
  const [error, setError] = useState(''); // State to store any errors
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleCountySelect = (county) => {
    setSelectedCounty(county);
  };

  const handleTimeScaleToggle = (scale) => {
    setTimeScale(scale);
  };

  const handleScaleValueSelect = (value) => {
    setScaleValue(value);
  };

  const handleTargetYearSelect = (year) => {
    setTargetYear(year);
  };

  const handleDataTypeChange = (dataType) => {
    setSelectedDataType(dataType);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible); // Toggle menu visibility
  };

  const fetchDataFromApi = async () => {
    // Check if all required parameters are provided
    // if (!selectedCounty) {
    //   setError('Please select a county.');
    //   return;
    // }

    // if (timeScale === 'by_year' && !targetYear) {
    //   setError('Please select a year.');
    //   return;
    // }

    // if (timeScale === 'by_season' && !scaleValue) {
    //   setError('Please select a season.');
    //   return;
    // }

    // if (timeScale === 'by_month' && !scaleValue) {
    //   setError('Please select a month.');
    //   return;
    // }

    setError(''); // Clear any previous errors
    setLoading(true); // Set loading to true when fetching data

    try {
      console.log('Fetching data with params:', {
        selectedCounty, timeScale, targetYear, scaleValue, selectedDataType
      });
      const res = await fetchData(selectedCounty, timeScale, targetYear, scaleValue, selectedDataType);
      console.log(`res: ${res.data[0][0][0]}`);
      setMapData(res.data[0][0][0]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to fetch data.');
    }

    setLoading(false); // Set loading to false after data is fetched
  };

  // Fetch data whenever relevant state changes
  useEffect(() => {
    fetchDataFromApi();
  }, [selectedCounty, timeScale, scaleValue, targetYear, selectedDataType]);

  return (
    <div className="app-container">
      <button className="menu-toggle" onClick={toggleMenu}>Toggle Menu</button>
      <aside className={`sidebar ${menuVisible ? 'visible' : ''}`}>
        <Sidebar
          selectedCounty={selectedCounty}
          onSelectCounty={handleCountySelect}
          timeScale={timeScale}
          onToggleTimeScale={handleTimeScaleToggle}
          scaleValue={scaleValue}
          onSelectScaleValue={handleScaleValueSelect}
          selectedDataType={selectedDataType}
          onDataTypeChange={handleDataTypeChange}
          targetYear={targetYear}
          onSelectTargetYear={handleTargetYearSelect}
        />
      </aside>
      <section className="map-container">
        {error && <div className="error-message">{error}</div>}
        <MapComponent
          selectedCounty={selectedCounty}
          timeScale={timeScale}
          scaleValue={scaleValue}
          targetYear={targetYear}
          selectedDataType={selectedDataType}
          mapData={mapData} // Pass fetched data to MapComponent
          loading={loading} // Pass loading state to MapComponent
        />
      </section>
    </div>
  );
};

export default App;
