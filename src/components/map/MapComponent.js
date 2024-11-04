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
import Legend from './Legend'; // Import the Legend component for the map's legend display
import '../../styles/MapStyles.css'; // Import CSS file for map styles

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
  const [yearColors, setYearColors] = useState({}); // State to store year colors for the map

  // Toggle between play and pause for the slider
  const togglePlayPause = () => {
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
  };

  // Toggle focus on markers
  const toggleFocus = () => {
    setFocusToMarkers(prevFocusToMarkers => !prevFocusToMarkers);
  };

  // Handle click on county to select it
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

    // Clean up map instance on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  useEffect(() => {
    if (years && years.length > 0) {
      const minYear = 1895; //Math.min(...years);
      const maxYear = new Date().getFullYear() - 1; //Math.max(...years);
      let colorScale;

      // Determine color scale based on selected data type
      if (selectedDataType === 'both') {
        colorScale = scaleSequential(interpolatePurples).domain([minYear, maxYear]);
      } else if (selectedDataType === 'precipitation') {
        colorScale = scaleSequential(interpolateBlues).domain([minYear, maxYear]);
      } else {
        colorScale = scaleSequential(interpolateReds).domain([minYear, maxYear]);
      }

      // Create a color mapping for each year
      const colors = {};
      years.forEach(year => {
        colors[year] = colorScale(year);
      });

      setYearColors(colors);
    }
  }, [years, selectedDataType]); // Recalculate colors when `years` or `selectedDataType` changes

  useEffect(() => {
    if (mapData && yearColors && Object.keys(yearColors).length > 0) {
      // Update markers based on new data and selected year
      MarkerHandler.handleMarkers(mapRef.current, markersRef, mapData, selectedDataType, initialBoundsSet, highlightedYear, yearColors, targetYear, timeScale, scaleValue);
      setInitialBoundsSet(true);
    }
  }, [mapData, selectedDataType, highlightedYear, yearColors, targetYear, timeScale, scaleValue]); // Re-render markers when relevant data changes

  useEffect(() => {
    if (countyLayerRef.current) {
      // Highlight selected county on the map
      MarkerHandler.highlightCounty(countyLayerRef.current, selectedCounty, countyData, mapData, timeScale, scaleValue, targetYear, selectedDataType);
    }
  }, [selectedCounty, mapData]); // Update highlighted county when `selectedCounty` or `mapData` changes

  // Convert month number to month name
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthName = timeScale === 'by_month' && !isNaN(scaleValue)
    ? monthNames[parseInt(scaleValue, 10) - 1] // Convert "01" to "January", "02" to "February", etc.
    : scaleValue;

    let timeFrameString = '';

  if (timeScale === 'by_season') {
    timeFrameString = scaleValue && ['Winter', 'Spring', 'Summer', 'Fall'].includes(scaleValue) ? `for ${scaleValue}` : '';
  } else if (timeScale === 'by_month') {
    timeFrameString = scaleValue ? `for ${monthName}` : '';
  } else if (timeScale === 'by_year') {
    timeFrameString = ``
  }

  let dataTypeString = ''

  if (selectedDataType === 'both') {
    dataTypeString = `Temperature and Precipitation`;
  } else if (selectedDataType === 'temperature') {
    dataTypeString = 'Temperature';
  } else if (selectedDataType === 'precipitation') {
    dataTypeString = 'Precipitation';
  }

  const targetYearString = timeScale === 'by_season' && scaleValue === 'Winter' ? `${targetYear-1}-${targetYear}` : targetYear;

  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay loading={loading} />
      <div id="map" style={{ height: showChart ? '70vh' : '98vh', width: menuVisible ? 'calc(100vw - 365px)' : 'calc(100vw - 40px)' }}>
      {mapData && targetYear !== '' && (
        <div className="map-title-overlay">
          <h3 className="map-title-text">{targetYear === 'top_analogs' ? `Top ${dataTypeString} Climate Analogs by year from 1895 ${highlightedYear === 1895 ? '' : `- ${highlightedYear}`} ${timeFrameString} for ${selectedCounty}, WI` : `${dataTypeString} Climate Analogs for ${selectedCounty}, WI ${timeFrameString} ${targetYearString}`}</h3>
        </div>
        )}
        {targetYear && targetYear !== 'top_analogs' && (
          <Legend className="legend"/> // Show Legend component when not viewing top analogs
        )}
      </div>
      {mapData && targetYear === 'top_analogs' && (
        <div className="sliderDiv" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 1000 }}>
          <Slider
            highlightedYear={highlightedYear}
            years={years}
            onChange={(year) => setHighlightedYear(year)}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            selectedDataType={selectedDataType}
            yearColors={yearColors} // Pass yearColors to the Slider component for color updates
          />
        </div>
      )}
    </div>
  );
};

export default MapComponent;
