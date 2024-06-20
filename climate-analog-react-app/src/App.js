// src/App.js
import React, { useState } from 'react';
import './App.css';
import MapComponent from './components/MapComponent'; // Assuming LeafletMap is renamed to MapComponent
import TargetCountySelector from './components/TargetCountySelector';
import DataTypeSelector from './components/DataTypeSelector';

const App = () => {
const [selectedCounty, setSelectedCounty] = useState('');
const [timeScale, setTimeScale] = useState('by_year');
const [scaleValue, setScaleValue] = useState('');
const [targetYear, setTargetYear] = useState('');
const [fetchTemperature, setFetchTemperature] = useState(false);
const [fetchPrecipitation, setFetchPrecipitation] = useState(false);
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
setSelectedDataType(e.target.value);
// Adjust API call or logic based on selected data type (temperature, precipitation, both)
};

const toggleMenu = () => {
setMenuVisible(!menuVisible); // Toggle menu visibility
};

return (
<div className="App">
<h1>Climate Analog Interactive Map</h1>
<button className="menu-toggle" onClick={toggleMenu}>Toggle Menu</button>
<div className={`sidebar ${menuVisible ? 'visible' : ''}`}>
    <div className="menu-content">
      <TargetCountySelector
        onSelectCounty={handleCountySelect}
        onToggleTimeScale={handleTimeScaleToggle}
        onSelectScaleValue={handleScaleValueSelect}
        setFetchTemperature={setFetchTemperature}
        setFetchPrecipitation={setFetchPrecipitation}
      />
      <div className="date-selector">
        <h2>Date Selector</h2>
        {/* Implement date selection UI */}
        <select onChange={(e) => handleTargetYearSelect(e.target.value)}>
          <option value="">Select target county year</option>
          {Array.from({ length: new Date().getFullYear() - 1894 }, (_, i) => {
            const year = 1895 + i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
          <option value="top_analogs">Top analogs from each year</option>
        </select>
      </div>
      <div className="data-type-selector">
        <h2>Data Type Selector</h2>
        <DataTypeSelector selectedDataType={selectedDataType} onChange={handleDataTypeChange} />
      </div>
    </div>
  </div>

  <div className="map-container">
    <MapComponent
      selectedCounty={selectedCounty}
      timeScale={timeScale}
      scaleValue={scaleValue}
      targetYear={targetYear}
      fetchTemperature={fetchTemperature}
      fetchPrecipitation={fetchPrecipitation}
    />
  </div>
</div>

);
};

export default App;