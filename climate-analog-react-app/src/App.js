// src/App.js
import React, { useState } from 'react';
import './App.css';
import MapComponent from './components/MapComponent'; // Assuming LeafletMap is renamed to MapComponent
import Sidebar from './components/Sidebar';

const App = () => {
  const [selectedCounty, setSelectedCounty] = useState('');
  const [timeScale, setTimeScale] = useState('by_year');
  const [scaleValue, setScaleValue] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [selectedDataType, setSelectedDataType] = useState('both'); // 'both' is default for DataTypeSelector
  const [menuVisible, setMenuVisible] = useState(true); // State to control menu visibility

  const handleCountySelect = (county) => {
    setSelectedCounty(county);
    // Make API call or other logic based on selected county
  };

  const handleTimeScaleToggle = (scale) => {
    setTimeScale(scale);
    // Adjust API call or logic based on selected time scale
  };

  const handleScaleValueSelect = (value) => {
    setScaleValue(value);
    // Adjust API call or logic based on selected scale value (season, month, year, etc.)
  };

  const handleTargetYearSelect = (year) => {
    setTargetYear(year);
    // Adjust API call or logic based on selected target year
  };

  const handleDataTypeChange = (e) => {
    const value = e.target.value;
    setSelectedDataType(value);
    // Adjust API call or logic based on selected data type (temperature, precipitation, both)
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible); // Toggle menu visibility
  };

  return (
    <div className="app-container">
      <button className="menu-toggle" onClick={toggleMenu}>Toggle Menu</button>
      <aside className={`sidebar ${menuVisible ? 'visible' : ''}`}>
        <Sidebar
          onSelectCounty={handleCountySelect}
          onToggleTimeScale={handleTimeScaleToggle}
          onSelectScaleValue={handleScaleValueSelect}
          setFetchTemperature={handleDataTypeChange}
          setFetchPrecipitation={handleDataTypeChange}
        />
      </aside>
      <section className="map-container">
        <MapComponent
          selectedCounty={selectedCounty}
          timeScale={timeScale}
          scaleValue={scaleValue}
          targetYear={targetYear}
          selectedDataType={selectedDataType} // Send selectedDataType to MapComponent
        />
      </section>
    </div>
  );
};

export default App;
