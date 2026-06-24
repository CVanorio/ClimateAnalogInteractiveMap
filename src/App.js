import React, { useState, useEffect, useRef } from 'react';
import Joyride, { STATUS } from 'react-joyride';
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
  const [selectedState, setSelectedState] = useState('47');
  const [selectedStateName, setSelectedStateName] = useState('WI');
  const [timeScale, setTimeScale] = useState(''); // no default; user picks explicitly
  const [scaleValue, setScaleValue] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [selectedDataType, setSelectedDataType] = useState(''); // no default; user picks explicitly
  const [menuVisible, setMenuVisible] = useState(true);
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [showChart, setShowChart] = useState(/*targetYear === 'top_analogs'*/ false);
  const [graphMode, setGraphMode] = useState('raw'); // 'raw' | 'anomalies' — graph display preference
  const [showMethodology, setShowMethodology] = useState(false);
 const [runTour, setRunTour] = React.useState(() => !localStorage.getItem('hasSeenTour_v1')); // Start tour on load, hide after 1st visit

  // --- View History via the URL (native browser Back/Forward) ---
  const isNavigatingRef = useRef(false);     // true while restoring state from the URL (popstate / deep link)
  const startedWithParamsRef = useRef(false); // true if the page was opened with a view in the URL
  const isFirstUserLoadRef = useRef(true);    // first user-initiated load replaces the blank "/" entry

  const handleCountySelect = (county) => setSelectedCounty(county);
  const handleStateSelect = (state) => setSelectedState(state);
  const handleStateSelectName = (state) => setSelectedStateName(state);
  const handleTimeScaleToggle = (scale) => setTimeScale(scale);
  const handleScaleValueSelect = (value) => setScaleValue(value);
  const handleTargetYearSelect = (year) => setTargetYear(year);
  const handleDataTypeChange = (dataType) => setSelectedDataType(dataType);
  const toggleMenu = () => setMenuVisible(!menuVisible);
  const toggleChart = () => setShowChart(!showChart); // sticky global preference
  const toggleMethodology = () => setShowMethodology(!showMethodology);

  const handleIntroClick = () => {
    setRunTour(true);
  };

  // --- URL <-> view-state helpers ---
  // Encode the current view as a query string (omitting empty values).
  const buildSearch = () => {
    const params = new URLSearchParams();
    if (selectedCounty) params.set('county', selectedCounty);
    if (timeScale) params.set('scale', timeScale);
    if (scaleValue) params.set('sub', scaleValue);
    if (targetYear) params.set('year', targetYear);
    if (selectedDataType) params.set('type', selectedDataType);
    return params.toString();
  };

  // Decode a query string back into view settings, with sensible defaults.
  const parseSearch = (search) => {
    const params = new URLSearchParams(search);
    return {
      selectedCounty: params.get('county') || '',
      timeScale: params.get('scale') || '',
      scaleValue: params.get('sub') || '',
      targetYear: params.get('year') || '',
      selectedDataType: params.get('type') || ''
    };
  };

  // Apply a parsed view to state; flags navigation so the resulting fetch won't re-push the URL.
  const applyView = (view) => {
    if (!view) return;
    isNavigatingRef.current = true;
    setSelectedCounty(view.selectedCounty);
    setTimeScale(view.timeScale);
    setScaleValue(view.scaleValue);
    setTargetYear(view.targetYear);
    setSelectedDataType(view.selectedDataType);
  };

  const fetchDataFromApi = async () => {
    // Only fetch if all required fields are set
    const isTimeScaleByYear = timeScale === 'by_year';
    const isScaleValueValid = isTimeScaleByYear || scaleValue !== '';
    if (
      !selectedCounty || selectedCounty === '' ||
      !selectedState ||
      !selectedStateName ||
      !timeScale ||
      !isScaleValueValid ||
      !targetYear ||
      !selectedDataType
    ) {
      setMapData(null); // Optionally clear map data if fields are incomplete
      setYears([]);
      return;
    }
    // Capture and clear the navigation flag up front so a failed/empty fetch
    // can't leave it stuck and suppress the next real view from being recorded.
    const wasNavigating = isNavigatingRef.current;
    isNavigatingRef.current = false;
    setLoading(true);
    try {
      const res = await fetchData(selectedCounty, timeScale, targetYear, scaleValue, selectedDataType, selectedState);
      const dataYears = getYearOptions(timeScale, scaleValue);
      console.log('res', res.data)
      setYears(dataYears);
      if (res.data[0][0][0].length > 0) {
        setMapData(res.data[0][0][0]);
        // Write this view to the URL unless the load came from a browser navigation
        // (popstate / deep link), where the URL already reflects the state.
        if (!wasNavigating) {
          const search = buildSearch();
          if (isFirstUserLoadRef.current && !startedWithParamsRef.current) {
            // Replace the blank "/" entry so Back from the first view leaves the app.
            window.history.replaceState({}, '', `?${search}`);
          } else {
            window.history.pushState({}, '', `?${search}`);
          }
          isFirstUserLoadRef.current = false;
        }
      }
      console.log(res.data);
      console.log(res.data[0][0][0]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDataFromApi();
  }, [selectedCounty, timeScale, scaleValue, targetYear, selectedDataType, selectedState]);

  useEffect(() => {
    setShowMethodology(false);
  }, []);

  // On mount, restore a view from the URL (deep link / refresh).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('county')) {
      startedWithParamsRef.current = true;
      applyView(parseSearch(window.location.search));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Native browser Back/Forward: restore the view encoded in the (new) URL.
  useEffect(() => {
    const onPopState = () => {
      applyView(parseSearch(window.location.search));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The graph is only actually visible on chart-allowed views; the map sizes to this
  // (not the raw sticky preference) so it resumes full height when no graph is shown.
  const graphVisible = showChart && targetYear === 'top_analogs';

  return (
    <div className="app-container" id='app-container'>
      <Joyride
  steps={joyrideSteps}
  run={runTour}
  // Remove step navigation UI
  // continuous
  // showSkipButton
  hideCloseButton={true}
  showProgress={false}

  // Keep your close behavior constraints
  disableCloseOnEsc
  disableOverlayClose

  // Accessibility / stacking
  styles={{ options: { zIndex: 10000 } }}

  // Label for the close button (optional)
  locale={{ close: 'Close' }}

  callback={({ status, type }) => {
    const done =
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED ||
      type === 'tour:end';

    if (done) {
      localStorage.setItem('hasSeenTour_v1', 'true');
      setRunTour(false);
    }
  }}
/>

      <i id='menuToggle' className={`${menuVisible ? 'fas fa-angle-left' : 'fas fa-angle-right'}`} onClick={toggleMenu} title="Toggle Menu"></i>
      <aside className={`sidebar ${menuVisible ? 'visible' : ''}`}>
        <Sidebar
          selectedCounty={selectedCounty}
          onSelectCounty={handleCountySelect}
          onSelectState={handleStateSelect}
          selectedState={selectedState}
          selectedStateName={selectedStateName}
          onSelectStateName={handleStateSelectName}
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
          graphMode={graphMode}
          onGraphModeChange={setGraphMode}
        />
        <SidebarOverlay loading={loading} />
      </aside>
      <section id='map-container' className="map-container">
        <MapComponent
          selectedCounty={selectedCounty}
          selectedState={selectedState}
          selectedStateName={selectedStateName}
          timeScale={timeScale}
          scaleValue={scaleValue}
          targetYear={targetYear}
          selectedDataType={selectedDataType}
          mapData={mapData}
          loading={loading}
          years={years}
          showChart={graphVisible}
          menuVisible={menuVisible}
          onSelectCounty={handleCountySelect}
        />
        <MethodologyOverlay 
          visible={showMethodology} 
          onClose={() => setShowMethodology(false)} 
        />
      </section>
      {mapData && graphVisible && (
        <section>
          <Graph
            graphData={mapData}
            years={years}
            menuVisible={menuVisible}
            onSelectTargetYear={handleTargetYearSelect}
            graphMode={graphMode}
          />
        </section>
      )}
    </div>
  );
};

export default App;
