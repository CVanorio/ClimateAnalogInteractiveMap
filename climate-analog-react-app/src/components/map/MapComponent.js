import React, { useRef, useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import stateData from '../../data/us-states.json';
import countyData from '../../data/us-counties.json';
import MapInitialization from './MapInitialization';
import MarkerHandler from './MarkerHandler';
import LoadingOverlay from './LoadingOverlay';
import Slider from './Slider';
import '../../styles/MapStyles.css';

const MapComponent = ({
  selectedCounty,
  timeScale,
  scaleValue,
  targetYear,
  selectedDataType,
  mapData,
  loading,
  years,
  showChart,
  menuVisible
}) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const countyLayerRef = useRef(null);
  const [focusToMarkers, setFocusToMarkers] = useState(true);
  const [highlightedYear, setHighlightedYear] = useState(null);
  const [initialBoundsSet, setInitialBoundsSet] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
  };

  const toggleFocus = () => {
    setFocusToMarkers(prevFocusToMarkers => !prevFocusToMarkers);
  };

  useEffect(() => {
    // Initialize map only once on component mount
    mapRef.current = MapInitialization.initializeMap('map', countyData);
    const bounds = [[-10, -200], [85, -30]];
    MapInitialization.setMaxBounds(mapRef.current, bounds);

    // Setup base layers and custom controls
    MapInitialization.setupBaseLayers(mapRef.current, stateData);
    MapInitialization.setupCustomControl(mapRef.current, toggleFocus);
    countyLayerRef.current = MapInitialization.addCountyLayer(mapRef.current, countyData);

    // Cleanup function
    return () => {
      mapRef.current.remove();
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  useEffect(() => {
    if (mapData && mapData.length > 0) {
      setInitialBoundsSet(false);
    }
  }, [mapData]);

  useEffect(() => {
    MarkerHandler.handleMarkers(mapRef.current, markersRef, mapData, selectedDataType, initialBoundsSet, highlightedYear);
    setInitialBoundsSet(true);
  }, [mapData, selectedDataType, highlightedYear]);

  useEffect(() => {
    if (countyLayerRef.current) {
      MapInitialization.highlightCounty(countyLayerRef.current, selectedCounty);
    }
  }, [selectedCounty]);

  useEffect(() => {
    // Handle automatic slider movement logic when isPlaying changes
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        const currentIndex = years.findIndex(year => year === highlightedYear);
        const nextIndex = (currentIndex + 1) % years.length;
        setHighlightedYear(years[nextIndex]);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPlaying, highlightedYear, years]);

  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay loading={loading} />
      <div id="map" style={{ height: showChart ? '70vh' : '98vh', width: menuVisible ? '80vw' : '98vw' }}></div>
      {mapData && (
        <div className="sliderDiv" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 1000 }}>
          <Slider
            highlightedYear={highlightedYear}
            years={years}
            onChange={(year) => setHighlightedYear(year)}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
          />
        </div>
      )}
    </div>
  );
};

export default MapComponent;
