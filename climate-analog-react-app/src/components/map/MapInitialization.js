import L from 'leaflet';
import '../../styles/MapStyles.css';

let currentTargetLayer = null; // Global variable to keep track of the current target county layer
let currentMarker = null; // Global variable to keep track of the current marker

const MapInitialization = {
  initializeMap: (id, countyData) => {
    const map = L.map(id, {
      center: [44.5, -89.5],
      zoom: 7,
      zoomDelta: 0.25,
      zoomSnap: 0,
      minZoom: 3,
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
    }).addTo(map);

    return map;
  },

  setupBaseLayers: (map, stateData) => {
    L.geoJSON(stateData, {
      style: {
        color: 'grey',
        weight: 1.5,
        fillColor: 'transparent',
        fillOpacity: 0,
        zIndex: 1,
      },
    }).addTo(map);
  },

  setupCustomControl: (map, toggleFocus) => {
    const focusControl = L.control({ position: 'topright' });
    focusControl.onAdd = function () {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      container.innerHTML = `<button class="leaflet-control-button" title="Toggle Focus"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Font_Awesome_5_solid_expand.svg/1200px-Font_Awesome_5_solid_expand.svg.png" alt="Toggle Focus" style="width: 20px; height: 20px;" /></button>`;
      L.DomEvent.on(container, 'click', toggleFocus.bind(this));
      return container;
    };
    focusControl.addTo(map);
  },

 addCountyLayer: (map, countyData, handleCountyClick) => {
  const countyLayer = L.geoJSON(countyData, {
    style: (feature) => {
      // Differentiate style for WI counties
      if (feature.properties.STATEABBR === 'WI') {
        return {
          weight: 0.7,
          color: 'grey',
          fillColor: 'transparent',
          fillOpacity: 0.15,
          zIndex: 1,
        };
      } else {
        return {
          weight: 0.7,
          color: 'grey',
          fillColor: 'transparent',
          fillOpacity: 0,
          zIndex: 1,
        };
      }
    },
    onEachFeature: (feature, layer) => {
      let tooltip;
      let originalColor; // Variable to store the original color
      let originalOpacity;
    
      if (feature.properties.STATEABBR === 'WI') {
        // Mouseover event to show tooltip and change fill color
        layer.on('mouseover', function (e) {
          // Get the current style
          originalColor = layer.options.fillColor;
          originalOpacity = layer.options.fillOpacity;
    
          tooltip = L.tooltip({
            permanent: true,
            direction: 'right',
            className: 'leaflet-tooltip'
          }).setContent(`${feature.properties.COUNTYNAME}, ${feature.properties.STATEABBR}`);
    
          this.bindTooltip(tooltip).openTooltip();
    
          if (feature.properties.STATEABBR === 'WI') {
            layer.setStyle({
              fillColor: 'blue',
              fillOpacity: 0.25
            });
          }
        });
    
        // Mouseout event to hide tooltip and reset fill color
        layer.on('mouseout', function (e) {
          if (tooltip) {
            this.unbindTooltip();
            tooltip = null;
          }
    
          if (feature.properties.STATEABBR === 'WI') {
            layer.setStyle({
              fillColor: originalColor, // Reset to the original color
              fillOpacity: originalOpacity
            });
          }
        });
    
        // Enable click only for WI counties
        if (feature.properties.STATEABBR === 'WI') {
          layer.on('click', function (e) {
            handleCountyClick(feature.properties.COUNTYNAME); // Call the handleCountyClick function
          });
        }
    
        // Prevent default behavior on mousedown to disable selection box
        layer.on('mousedown', function (e) {
          L.DomEvent.stopPropagation(e); // Prevent default Leaflet behavior
        });
      }
    }
  }).addTo(map);

  return countyLayer;
},


  getCountyStyle: () => {
    return {
      weight: 0.7,
      color: 'grey',
      fillColor: 'transparent',
      fillOpacity: 0,
      zIndex: 1,
    };
  },

  highlightCounty: (map, selectedCounty, countyData) => {
    if (selectedCounty) {
      const targetCounty = `${selectedCounty} County`;

      // Remove the previous target county layer and marker if they exist
      if (currentTargetLayer) {
        map.removeLayer(currentTargetLayer);
        currentTargetLayer = null;
      }
      if (currentMarker) {
        map.removeLayer(currentMarker);
        currentMarker = null;
      }

      // Check if countyData is defined and has features
      if (countyData && countyData.features) {
        // Find the selected county feature from the county data
        const selectedFeature = countyData.features.find(
          feature => feature.properties.COUNTYNAME === targetCounty && feature.properties.STATEABBR === 'WI'
        );

        if (selectedFeature) {
          // Create a new layer for the selected county
          currentTargetLayer = L.geoJSON(selectedFeature, {
            style: {
              weight: 0.7,
              color: 'black',
              fillColor: 'transparent',
              fillOpacity: 0.25,
              zIndex: 1,
            },
            onEachFeature: (feature, layer) => {
              let tooltip;

              // Mouseover event to show tooltip
              layer.on('mouseover', function (e) {
                tooltip = L.tooltip({
                  permanent: true,
                  direction: 'right',
                  className: 'leaflet-tooltip'
                }).setContent(`${feature.properties.COUNTYNAME}, ${feature.properties.STATEABBR}`);

                this.bindTooltip(tooltip).openTooltip();
              });

              // Mouseout event to hide tooltip
              layer.on('mouseout', function (e) {
                if (tooltip) {
                  this.unbindTooltip();
                  tooltip = null;
                }
              });

              // Enable click only for WI counties
              if (feature.properties.STATEABBR === 'WI') {
                layer.on('click', function (e) {
                  // Handle click event for WI counties
                  // Example: map.removeLayer(this);
                });
              }

              // Prevent default behavior on mousedown to disable selection box
              layer.on('mousedown', function (e) {
                L.DomEvent.stopPropagation(e); // Prevent default Leaflet behavior
              });
            }
          }).addTo(map);

          // Extract latitude and longitude from feature properties
          const latitude = selectedFeature.properties.LAT;
          const longitude = selectedFeature.properties.LONG;

          // Add a marker with the custom icon to the specified latitude and longitude
          const icon = L.divIcon({
            html: '<i class="fa-solid fa-location-dot"></i>',
            className: 'target-icon',
            iconAnchor: [8, 24] // Center horizontally and bottom vertically
          });

          currentMarker = L.marker([latitude, longitude], { icon }).addTo(map);
        } else {
          console.error(`Cannot find feature for ${targetCounty} in countyData.`);
        }
      } else {
        console.error('County data is undefined or does not contain features.');
      }
    }
  },

  setMaxBounds: (map, bounds) => {
    map.setMaxBounds(bounds);
  }
};

export default MapInitialization;
