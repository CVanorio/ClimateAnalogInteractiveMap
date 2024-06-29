import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import stateData from '../data/us-states.json';
import countyData from '../data/us-counties.json';

// CSS style for circular marker icon
const circleIconStyle = `
  .leaflet-marker-icon.circular-marker {
    background-color: red;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    margin-left: -6px; /* Half of width */
    margin-top: -6px; /* Half of height */
  }
`;

const MapComponent = ({ selectedCounty, timeScale, scaleValue, targetYear, selectedDataType, mapData }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const countyLayerRef = useRef(null);
  const [highlightedCountyLayer, setHighlightedCountyLayer] = useState(null);

  // Initialize map on component mount
  useEffect(() => {
    mapRef.current = L.map('map', {
      center: [44.5, -89.5], // Initial map center coordinates (Wisconsin)
      zoom: 7, // Initial zoom level
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    return () => {
      mapRef.current.remove();
    };
  }, []);

  // Update county and state layers when component mounts or selectedCounty changes
  useEffect(() => {
    if (mapRef.current) {
      // Clear previous layers
      mapRef.current.eachLayer(layer => {
        if (!layer._url) { // Check if it's a tile layer
          mapRef.current.removeLayer(layer);
        }
      });

      // Add state layer
      L.geoJSON(stateData, {
        style: {
          color: '#4F4F4F',
          weight: 2.5,
          fillColor: 'transparent',
          fillOpacity: 0,
        },
      }).addTo(mapRef.current);

      // Add county layer
      countyLayerRef.current = L.geoJSON(countyData, {
        style: getCountyStyle,
        onEachFeature: onEachCountyFeature,
      }).addTo(mapRef.current);
    }
  }, [selectedCounty]); // Update when selectedCounty changes

  // Update highlighted county layer style when selectedCounty changes
  useEffect(() => {
    if (highlightedCountyLayer) {
      highlightedCountyLayer.setStyle({
        weight: 0.8,
        color: '#696969', // Reset previous highlighted county style
        fillColor: 'transparent',
        fillOpacity: 0,
      });
    }

    // Find and highlight the selected county
    if (selectedCounty) {
      countyLayerRef.current.eachLayer(layer => {
        const countyName = layer.feature.properties.COUNTYNAME;
        const stateName = layer.feature.properties.STATEABBR;
        if (countyName === `${selectedCounty} County` && stateName === "WI") {
          setHighlightedCountyLayer(layer);
          layer.setStyle({
            weight: 4,
            color: 'yellow', // Highlighted county outline color
            fillColor: 'transparent',
            fillOpacity: 0,
          });
        }
      });
    }
  }, [selectedCounty]);

  // Define county style based on selectedCounty
  const getCountyStyle = (feature) => {
    const countyName = feature.properties.COUNTYNAME;
    const stateName = feature.properties.STATEABBR;
    if (countyName === `${selectedCounty} County` && stateName === "WI") {
      return {
        weight: 4,
        color: 'yellow', // Highlighted county color
        fillColor: 'transparent',
        fillOpacity: 0,
      };
    } else {
      return {
        weight: 0.8,
        color: '#696969',
        fillColor: 'transparent',
        fillOpacity: 0,
      };
    }
  };

  // Handle events on each county feature
  const onEachCountyFeature = (feature, layer) => {
    const countyName = feature.properties.COUNTYNAME;
    const stateName = feature.properties.STATEABBR;
    if (countyName === `${selectedCounty} County` && stateName === "WI") {
      setHighlightedCountyLayer(layer);
      layer.setStyle({
        weight: 4,
        color: 'yellow', // Highlighted county outline color
        fillColor: 'transparent', // Fill color for the highlighted county
        fillOpacity: 0, // Adjust opacity as needed (0.4 for example)
      });
    }

    // Attach click event to update highlighted county
    layer.on({
      click: () => {
        setHighlightedCountyLayer(layer);
      },
    });
  };

  // Add markers based on mapData
  useEffect(() => {
    if (mapRef.current && mapData) {
      // Clear previous markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Create marker map to track duplicate coordinates
      const markerMap = new Map();

      // Add new markers
      mapData.forEach((item) => {
        const latlng = new L.LatLng(item.AnalogCountyLatitude, item.AnalogCountyLongitude);
        
        let marker = L.marker(latlng, {
          icon: L.divIcon({
            className: 'circular-marker', // Use the circular marker class
          })
        })
        .bindPopup(`
          <strong>${item.AnalogCountyName} County, ${item.AnalogCountyStateAbbr}</strong><br>
          Year: ${item.Year}<br>
          Analog Precipitation Norm: ${Number(item.AnalogCountyPrecipitationNorm)} in
        `);

        // Check if coordinates already exist
        if (markerMap.has(latlng.toString())) {
          const existingMarker = markerMap.get(latlng.toString());
          const popupContent = existingMarker.getPopup().getContent() + '<br><br>' + marker.getPopup().getContent();
          existingMarker.bindPopup(popupContent);
          marker = existingMarker;
        } else {
          markerMap.set(latlng.toString(), marker);
        }

        markersRef.current.push(marker);
      });

      // Add markers to the map
      markersRef.current.forEach(marker => marker.addTo(mapRef.current));
    }
  }, [mapData]);

  // Add the custom style for circular marker to the document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = circleIconStyle;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Render map component
  return (
    <div>
      <div id="map" style={{ height: '90vh', width: 'calc(100vw - 300px)' }}></div>
    </div>
  );
};

export default MapComponent;
