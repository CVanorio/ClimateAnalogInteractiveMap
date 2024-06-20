// src/components/MapComponent.js
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ data }) => {
  const mapRef = useRef(null);

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
    if (mapRef.current && data) {
      data.forEach(item => {
        L.marker([item.latitude, item.longitude])
          .addTo(mapRef.current)
          .bindPopup(item.name); // Assuming each item has a 'name' property
      });
    }
  }, [data]);

  return <div id="map" style={{ height: '600px', width: '100%' }}></div>;
};

export default MapComponent;
