import L from 'leaflet';
import '../../styles/MapStyles.css';
import 'leaflet-easyprint';

const MapInitialization = {
  // Initialize the map with given parameters and base layer
  initializeMap: (id, countyData) => {
    const map = L.map(id, {
      center: [44.5, -89.5],
      zoom: 7,
      zoomDelta: 0.25,
      zoomSnap: 0.25,
      minZoom: 3,
    });

    // Add base tile layer to the map
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
    }).addTo(map);

    // Add EasyPrint control to the map
    L.easyPrint({
      title: 'Download Map',
      position: 'topleft',
      sizeModes: ['map-container','A4Portrait', 'A4Landscape'],
      exportOnly: true,
    }).addTo(map);

    return map;
  },

  // Setup base layers for the map
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

  // Add custom control to toggle focus
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



  // Add and style the county layer on the map
  addCountyLayer: (map, countyData, handleCountyClick) => {
    const countyLayer = L.geoJSON(countyData, {
      style: (feature) => {
        // Differentiate style for Wisconsin (WI) counties
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
            // Store current style
            originalColor = layer.options.fillColor;
            originalOpacity = layer.options.fillOpacity;

            tooltip = L.tooltip({
              permanent: true,
              direction: 'right',
              className: 'leaflet-tooltip'
            }).setContent(`${feature.properties.COUNTYNAME}, ${feature.properties.STATEABBR}`);

            this.bindTooltip(tooltip).openTooltip();

            // Highlight WI counties on mouseover
            layer.setStyle({
              fillColor: 'blue',
              fillOpacity: 0.25
            });
          });

          // Mouseout event to hide tooltip and reset fill color
          layer.on('mouseout', function (e) {
            if (tooltip) {
              this.unbindTooltip();
              tooltip = null;
            }

            // Reset style for WI counties
            layer.setStyle({
              fillColor: originalColor,
              fillOpacity: originalOpacity
            });
          });

          // Click event for WI counties only
          if (feature.properties.STATEABBR === 'WI') {
            layer.on('click', function (e) {
              handleCountyClick(feature.properties.COUNTYNAME); // Trigger callback on click
            });
          }

          // Prevent default behavior on mousedown to disable selection box
          layer.on('mousedown', function (e) {
            L.DomEvent.stopPropagation(e); // Stop event propagation
          });
        }
      }
    }).addTo(map);

    return countyLayer;
  },

  // Default style for counties
  getCountyStyle: () => {
    return {
      weight: 0.7,
      color: 'grey',
      fillColor: 'transparent',
      fillOpacity: 0,
      zIndex: 1,
    };
  },

  // Set maximum bounds for the map
  setMaxBounds: (map, bounds) => {
    map.setMaxBounds(bounds);
  }
};

export default MapInitialization;
