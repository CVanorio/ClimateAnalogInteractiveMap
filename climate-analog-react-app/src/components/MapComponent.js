// src/components/MapComponent.js
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import stateData from '../data/us-states.json';
import countyData from '../data/us-counties.json';
import { fetchData } from '../services/api';

const MapComponent = ({ selectedCounty, timeScale, scaleValue, targetYear, selectedDataType }) => {
  const mapRef = useRef(null);
  const statesLayerRef = useRef(null);
  const countiesLayerRef = useRef(null);
  const [mapData, setMapData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    mapRef.current = L.map('map', {
      center: [44.5, -89.5], // Initial map center coordinates (Wisconsin)
      zoom: 7, // Initial zoom level (adjust as necessary)
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    return () => {
      mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      if (!selectedCounty) {
        setError('Please select a county.');
        return;
      }

      if (timeScale === 'by_year' && !targetYear) {
        setError('Please select a year.');
        return;
      }

      if (timeScale === 'by_season' && !scaleValue) {
        setError('Please select a season.');
        return;
      }

      if (timeScale === 'by_month' && !scaleValue) {
        setError('Please select a month.');
        return;
      }

      setError(''); // Clear any previous errors

      try {
        const data = await fetchData(selectedCounty, timeScale, scaleValue, targetYear, selectedDataType);
        setMapData(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch data.');
      }
    };

    fetchDataFromApi();
  }, [selectedCounty, timeScale, scaleValue, targetYear, selectedDataType]);

  useEffect(() => {
    if (mapRef.current) {
      // Remove existing layers if they exist
      if (statesLayerRef.current) {
        mapRef.current.removeLayer(statesLayerRef.current);
      }
      if (countiesLayerRef.current) {
        mapRef.current.removeLayer(countiesLayerRef.current);
      }

      // Add county layer
      countiesLayerRef.current = L.geoJSON(countyData, {
        style: {
          color: '#696969',
          weight: 0.8,
          fillColor: 'transparent',
          fillOpacity: 0
        },
      }).addTo(mapRef.current);

      // Add state layer
      statesLayerRef.current = L.geoJSON(stateData, {
        style: {
          color: '#4F4F4F',
          weight: 2.5,
          fillColor: 'transparent',
          fillOpacity: 0
        },
      }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && mapData) {
      mapData.forEach(item => {
        L.marker([item.latitude, item.longitude])
          .addTo(mapRef.current)
          .bindPopup(item.name); // Assuming each item has a 'name' property
      });
    }
  }, [mapData]);

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <div id="map" style={{ height: '95vh', width: `calc(100vw - 300px)`}}></div>
    </div>
  );
};

export default MapComponent;
