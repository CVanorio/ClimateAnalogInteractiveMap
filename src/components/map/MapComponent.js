import React, { useRef, useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as d3 from 'd3';
import { scaleSequential } from 'd3-scale';
import { interpolatePurples, interpolateBlues, interpolateReds } from 'd3-scale-chromatic';
import stateData from '../../data/us-states.json';
import countyData from '../../data/us-counties.json';
import MapInitialization from './MapInitialization';
import MarkerHandler from './MarkerHandler';
import LoadingOverlay from './LoadingOverlay';
import Slider from './Slider';
import Legend from './Legend'; // Import the Legend component
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
  const [highlightedYear, setHighlightedYear] = useState(years[0] || null); // Initialize with the first year or null
  const [initialBoundsSet, setInitialBoundsSet] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [yearColors, setYearColors] = useState({}); // State to store year colors

  const togglePlayPause = () => {
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
  };

  const toggleFocus = () => {
    setFocusToMarkers(prevFocusToMarkers => !prevFocusToMarkers);
  };

  const handleCountyClick = (countyName) => {
    // Implement logic to set selectedCounty here
  };

  useEffect(() => {
    // Initialize map only once on component mount
    mapRef.current = MapInitialization.initializeMap('map', countyData);
    const bounds = [[-10, -200], [85, -30]];
    MapInitialization.setMaxBounds(mapRef.current, bounds);

    // Setup base layers and custom controls
    MapInitialization.setupBaseLayers(mapRef.current, stateData);
    countyLayerRef.current = MapInitialization.addCountyLayer(mapRef.current, countyData, handleCountyClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  useEffect(() => {
    if (years && years.length > 0) {
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      let colorScale;

      if (selectedDataType === 'both') {
        colorScale = scaleSequential(interpolatePurples).domain([minYear, maxYear]);
      } else if (selectedDataType === 'precipitation') {
        colorScale = scaleSequential(interpolateBlues).domain([minYear, maxYear]);
      } else {
        colorScale = scaleSequential(interpolateReds).domain([minYear, maxYear]);
      }

      const colors = {};
      years.forEach(year => {
        colors[year] = colorScale(year);
      });

      setYearColors(colors);
    }
  }, [years, selectedDataType]);

  useEffect(() => {
    if (mapData && yearColors && Object.keys(yearColors).length > 0) {
      MarkerHandler.handleMarkers(mapRef.current, markersRef, mapData, selectedDataType, initialBoundsSet, highlightedYear, yearColors, targetYear, timeScale, scaleValue);
      setInitialBoundsSet(true);
    }
  }, [mapData, selectedDataType, highlightedYear, yearColors, targetYear, timeScale, scaleValue]);

  useEffect(() => {
    if (countyLayerRef.current) {
      MarkerHandler.highlightCounty(countyLayerRef.current, selectedCounty, countyData, mapData, timeScale, scaleValue, targetYear, selectedDataType);
    }
  }, [selectedCounty, mapData]);

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
      {targetYear && targetYear !== 'top_analogs' && (
        <Legend />
      )}
    </div>
  );
};

export default MapComponent;
