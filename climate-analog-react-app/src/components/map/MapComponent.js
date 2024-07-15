import React, { useRef, useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as d3 from 'd3';
import { scaleSequential } from 'd3-scale';
import { interpolateViridis } from 'd3-scale-chromatic';
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
  const [yearColors, setYearColors] = useState({}); // State to store year colors

  const togglePlayPause = () => {
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
  };

  const toggleFocus = () => {
    setFocusToMarkers(prevFocusToMarkers => !prevFocusToMarkers);
  };

  // Define handleCountyClick function to handle county clicks
  const handleCountyClick = (countyName) => {
    console.log(`Clicked on county: ${countyName}`);
    // Implement logic to set selectedCounty here
  };

  // Calculate year colors based on a gradient from white to blue
  useEffect(() => {
    if (years && years.length > 0) {
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
  
      const colorScale = scaleSequential(interpolateViridis)
        .domain([minYear, maxYear]);
  
      const colors = {};
      years.forEach(year => {
        colors[year] = colorScale(year);
      });
  
      setYearColors(colors);
    }
  }, [years]);

  useEffect(() => {
    // Initialize map only once on component mount
    mapRef.current = MapInitialization.initializeMap('map', countyData);
    const bounds = [[-10, -200], [85, -30]];
    MapInitialization.setMaxBounds(mapRef.current, bounds);

    // Setup base layers and custom controls
    MapInitialization.setupBaseLayers(mapRef.current, stateData);
    MapInitialization.setupCustomControl(mapRef.current, toggleFocus);
    countyLayerRef.current = MapInitialization.addCountyLayer(mapRef.current, countyData, handleCountyClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  useEffect(() => {
    if (mapData && mapData.length > 0) {
      setInitialBoundsSet(false);
    }
  }, [mapData]);

  useEffect(() => {
    MarkerHandler.handleMarkers(mapRef.current, markersRef, mapData, selectedDataType, initialBoundsSet, highlightedYear, yearColors, targetYear);
    setInitialBoundsSet(true);
  }, [mapData, selectedDataType, highlightedYear]);

  useEffect(() => {
    if (countyLayerRef.current) {
      MapInitialization.highlightCounty(countyLayerRef.current, selectedCounty, countyData);
    }
  }, [selectedCounty]);

  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay loading={loading} />
      <div id="map" style={{ height: showChart ? '70vh' : '98vh', width: menuVisible ? 'calc(100vw - 365px)' : 'calc(100vw - 40px)' }}></div>
      {mapData && targetYear === 'top_analogs' && (
        <div className="sliderDiv" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 1000 }}>
          <Slider
            highlightedYear={highlightedYear}
            years={years}
            onChange={(year) => setHighlightedYear(year)}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            selectedDataType={selectedDataType}
            yearColors={yearColors} // Pass yearColors to the Slider component
          />
        </div>
      )}
    </div>
  );
};

export default MapComponent;
