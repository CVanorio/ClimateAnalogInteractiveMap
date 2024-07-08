import React, { useState, useEffect } from 'react';
import './App.css';
import MapComponent from './components/map/MapComponent';
import Sidebar from './components/Sidebar';
import { fetchData } from './services/api';
import Graph from './components/Graph';

const App = () => {
  const [selectedCounty, setSelectedCounty] = useState('');
  const [timeScale, setTimeScale] = useState('by_year');
  const [scaleValue, setScaleValue] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [highlightedYear, setHighlightedYear] = useState(null);
  const [selectedDataType, setSelectedDataType] = useState('both');
  const [menuVisible, setMenuVisible] = useState(true);
  const [mapData, setMapData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [showChart, setShowChart] = useState(false);

  const handleCountySelect = (county) => setSelectedCounty(county);
  const handleTimeScaleToggle = (scale) => setTimeScale(scale);
  const handleScaleValueSelect = (value) => setScaleValue(value);
  const handleTargetYearSelect = (year) => setTargetYear(year);
  const handleDataTypeChange = (dataType) => setSelectedDataType(dataType);
  const toggleMenu = () => setMenuVisible(!menuVisible);
  const toggleChart = () => setShowChart(!showChart);

  const fetchDataFromApi = async () => {
    if (!selectedCounty) {
      setError('Please select a county.');
      return;
    }

    if (timeScale === 'by_year' && !targetYear) {
      setError('Please select a year.');
      return;
    }

    if ((timeScale === 'by_season' || timeScale === 'by_month') && (!targetYear || !scaleValue)) {
      setError('Please select a year and a season or month.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetchData(selectedCounty, timeScale, targetYear, scaleValue, selectedDataType);
      const dataYears = res.data[0][0][0].map(item => Number(item.Year));
      setYears(dataYears);
      setMapData(res.data[0][0][0]);
    } catch (error) {
      setError('Failed to fetch data.');
    }

    setLoading(false);
  };

  useEffect(() => {
    // set isFocused or whatever false
    fetchDataFromApi();
  }, [selectedCounty, timeScale, scaleValue, targetYear, selectedDataType]);


  return (
    <div className="app-container">
      <i className={`${menuVisible ? 'fas fa-angle-left' : 'fas fa-angle-right'}`} onClick={toggleMenu}></i>
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
          showChart={showChart}
          toggleChart={toggleChart}
          mapData={mapData} // Pass mapData to Sidebar
        />
        {error && <div className="error-message"><i className={`fas fa-triangle-exclamation`}></i>{error}</div>}
      </aside>
      <section className="map-container">
        <MapComponent
          selectedCounty={selectedCounty}
          timeScale={timeScale}
          scaleValue={scaleValue}
          targetYear={targetYear}
          selectedDataType={selectedDataType}
          mapData={mapData}
          loading={loading}
          years={years}
          showChart={showChart}
          menuVisible={menuVisible}
        />
      </section>
      {mapData && (
        <section>
          {showChart && (
            <Graph 
              graphData={mapData}
              years={years} 
              menuVisible={menuVisible}
            />
          )}
        </section>
      )}
    </div>
  );
};

export default App;
