import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';
import './App.css';
import MapComponent from './components/map/MapComponent';
import Sidebar from './components/Sidebar';
import SidebarOverlay from './components/SidebarOverlay';
import { fetchData } from './services/api';
import Graph from './components/Graph';
import { joyrideSteps } from './components/BackgroundIntro';
import { getYearOptions } from './utils/yearUtils.js';
import MethodologyOverlay from './components/MethodologyOverlay';

const App = () => {
  const [selectedCounty, setSelectedCounty] = useState('');
  const [timeScale, setTimeScale] = useState('by_year');
  const [scaleValue, setScaleValue] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [selectedDataType, setSelectedDataType] = useState('both');
  const [menuVisible, setMenuVisible] = useState(true);
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [showChart, setShowChart] = useState(targetYear === 'top_analogs');
  const [showMethodology, setShowMethodology] = useState(false);
  const [runTour, setRunTour] = useState(true); // Start tour on load

  const handleCountySelect = (county) => setSelectedCounty(county);
  const handleTimeScaleToggle = (scale) => setTimeScale(scale);
  const handleScaleValueSelect = (value) => setScaleValue(value);
  const handleTargetYearSelect = (year) => setTargetYear(year);
  const handleDataTypeChange = (dataType) => setSelectedDataType(dataType);
  const toggleMenu = () => setMenuVisible(!menuVisible);
  const toggleChart = () => setShowChart(!showChart);
  const toggleMethodology = () => setShowMethodology(!showMethodology);

  const handleIntroClick = () => {
    setRunTour(true);
  };

  const fetchDataFromApi = async () => {
    setLoading(true);

    try {
      const res = await fetchData(selectedCounty, timeScale, targetYear, scaleValue, selectedDataType);
      const dataYears = getYearOptions(timeScale, scaleValue);
      setYears(dataYears);
      setMapData(res.data[0][0][0]);
      console.log(res.data);
      console.log(res.data[0][0][0]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDataFromApi();
  }, [selectedCounty, timeScale, scaleValue, targetYear, selectedDataType]);

  useEffect(() => {
    setShowChart(targetYear === 'top_analogs');
  }, [targetYear]);

  useEffect(() => {
    setShowMethodology(false);
  }, []);

  return (
    <div className="app-container" id='app-container'>
      <Joyride
        steps={joyrideSteps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        styles={{ options: { zIndex: 10000 } }}
        callback={data => {
          if (data.status === 'finished' || data.status === 'skipped') {
            setRunTour(false);
          }
        }}
      />
      <i id='menuToggle' className={`${menuVisible ? 'fas fa-angle-left' : 'fas fa-angle-right'}`} onClick={toggleMenu} title="Toggle Menu"></i>
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
          mapData={mapData}
          menuVisible={menuVisible}
          toggleMethodology={toggleMethodology}
          onIntroClick={handleIntroClick}
        />
        <SidebarOverlay loading={loading} />
      </aside>
      <section id='map-container' className="map-container">
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
          handleCountyClick={handleCountySelect}
        />
        <MethodologyOverlay 
          visible={showMethodology} 
          onClose={() => setShowMethodology(false)} 
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
