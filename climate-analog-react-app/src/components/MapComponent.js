import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { PulseLoader } from 'react-spinners';
import stateData from '../data/us-states.json';
import countyData from '../data/us-counties.json';

const circleIconStyle = `
  .leaflet-marker-icon.circular-marker {
    background-color: red;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    line-height: 12px;
    text-align: center;
    color: white;
    font-weight: bold;
    border: 2px solid white;
  }
`;

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(128, 128, 128, 0.5)', // Slight grey with reduced opacity
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const textStyle = {
  color: '#ffffff',
  fontSize: '32px', // Increased font size
  marginBottom: '10px',
};

const MapComponent = ({ selectedCounty, timeScale, scaleValue, targetYear, selectedDataType, mapData, loading }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const countyLayerRef = useRef(null);
  const [highlightedCountyLayer, setHighlightedCountyLayer] = useState(null);
  const [focusToMarkers, setFocusToMarkers] = useState(false); // State for toggle

  const toggleFocus = () => {
    setFocusToMarkers(prevFocusToMarkers => !prevFocusToMarkers); // Toggle focus state
  };

  useEffect(() => {
    mapRef.current = L.map('map', {
      center: [44.5, -89.5],
      zoom: 7,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    const focusControl = L.control({ position: 'topright' });
    focusControl.onAdd = function () {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      container.innerHTML = `<button class="leaflet-control-button" title="Toggle Focus"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Font_Awesome_5_solid_expand.svg/1200px-Font_Awesome_5_solid_expand.svg.png" alt="Toggle Focus" style="width: 20px; height: 20px;" /></button>`;
      L.DomEvent.on(container, 'click', toggleFocus.bind(this));
      return container;
    };
    focusControl.addTo(mapRef.current);

    return () => {
      mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.eachLayer(layer => {
        if (!layer._url) {
          mapRef.current.removeLayer(layer);
        }
      });

      L.geoJSON(stateData, {
        style: {
          color: '#4F4F4F',
          weight: 2.5,
          fillColor: 'transparent',
          fillOpacity: 0,
        },
      }).addTo(mapRef.current);

      countyLayerRef.current = L.geoJSON(countyData, {
        style: getCountyStyle,
        onEachFeature: onEachCountyFeature,
      }).addTo(mapRef.current);
    }
  }, [selectedCounty]);

  useEffect(() => {
    if (highlightedCountyLayer) {
      highlightedCountyLayer.setStyle({
        weight: 0.8,
        color: '#696969',
        fillColor: 'transparent',
        fillOpacity: 0,
      });
    }

    if (selectedCounty) {
      countyLayerRef.current.eachLayer(layer => {
        const countyName = layer.feature.properties.COUNTYNAME;
        const stateName = layer.feature.properties.STATEABBR;
        if (countyName === `${selectedCounty} County` && stateName === "WI") {
          setHighlightedCountyLayer(layer);
          layer.setStyle({
            weight: 4,
            color: 'yellow',
            fillColor: 'transparent',
            fillOpacity: 0,
          });
        }
      });
    }
  }, [selectedCounty]);

  const getCountyStyle = (feature) => {
    const countyName = feature.properties.COUNTYNAME;
    const stateName = feature.properties.STATEABBR;
    if (countyName === `${selectedCounty} County` && stateName === "WI") {
      return {
        weight: 4,
        color: 'yellow',
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

  const onEachCountyFeature = (feature, layer) => {
    const countyName = feature.properties.COUNTYNAME;
    const stateName = feature.properties.STATEABBR;
    if (countyName === `${selectedCounty} County` && stateName === "WI") {
      setHighlightedCountyLayer(layer);
      layer.setStyle({
        weight: 4,
        color: 'yellow',
        fillColor: 'transparent',
        fillOpacity: 0,
      });
    }

    layer.on({
      click: () => {
        setHighlightedCountyLayer(layer);
      },
    });
  };

  useEffect(() => {
    if (mapRef.current && mapData) {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      const markerMap = new Map();
      const latLngs = [];

      mapData.forEach((item) => {
        const latlng = new L.LatLng(item.AnalogCountyLatitude, item.AnalogCountyLongitude);
        latLngs.push(latlng);

        let marker = L.marker(latlng, {
          icon: L.divIcon({
            className: 'circular-marker',
          })
        })
          .bindPopup(`
          <strong>${item.AnalogCountyName} County, ${item.AnalogCountyStateAbbr}</strong><br>
          Year: ${item.Year}<br>
          Analog Precipitation Norm: ${Number(item.AnalogCountyPrecipitationNorm)} in<br>
          Standardized Euclidean Distance: ${item.Distance}
        `);

        if (markerMap.has(latlng.toString())) {
          const existingMarkerData = markerMap.get(latlng.toString());
          const popupContent = existingMarkerData.popupContent + '<br><br>' + marker.getPopup().getContent();
          markerMap.set(latlng.toString(), {
            count: existingMarkerData.count + 1,
            popupContent: popupContent
          });
        } else {
          markerMap.set(latlng.toString(), {
            count: 1,
            popupContent: marker.getPopup().getContent()
          });
        }
      });

      markerMap.forEach((data, latlngString) => {
        const latLngArray = latlngString.slice(7, -1).split(',').map(Number);
        if (latLngArray.length === 2 && !isNaN(latLngArray[0]) && !isNaN(latLngArray[1])) {
          const marker = L.marker(latLngArray, {
            icon: L.divIcon({
              html: data.count > 1 ? `<div class="circular-marker">${data.count}</div>` : `<div class="circular-marker"></div>`,
              className: 'circular-marker',
            })
          })
            .bindPopup(data.popupContent);

          markersRef.current.push(marker);
          marker.addTo(mapRef.current);
        } else {
          console.error("Invalid coordinates:", latlngString);
        }
      });

      if (latLngs.length > 0) {
        if (focusToMarkers) {
          const bounds = L.latLngBounds(latLngs);
          mapRef.current.fitBounds(bounds);
        } else {
          mapRef.current.setView([44.5, -89.5], 7);
        }
      }
    }
  }, [mapData, focusToMarkers]);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = circleIconStyle;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Set focus to markers when mapData changes
  useEffect(() => {
    if (mapRef.current && mapData) {
      setFocusToMarkers(true); // Focus on markers
    }
  }, [mapData]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div style={overlayStyle}>
          <div style={textStyle}>Calculating Climate Patterns...</div>
          <PulseLoader size={15} color={"#ffffff"} loading={loading} />
        </div>
      )}
      <div id="map" style={{ height: '90vh', width: 'calc(100vw - 300px)' }}></div>
    </div>
  );
};

export default MapComponent;
