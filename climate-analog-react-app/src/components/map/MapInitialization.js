import L from 'leaflet';
import '../../styles/MapStyles.css';

const MapInitialization = {
  initializeMap: (id, countyData) => {
    const map = L.map(id, {
      center: [44.5, -89.5],
      zoom: 7,
      zoomDelta: 0.50,
      zoomSnap: 0,
      minZoom: 3,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    return map;
  },

  setupBaseLayers: (map, stateData) => {
    L.geoJSON(stateData, {
      style: {
        color: '#4F4F4F',
        weight: 2.5,
        fillColor: 'transparent',
        fillOpacity: 0,
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

  addCountyLayer: (map, countyData) => {
    const countyLayer = L.geoJSON(countyData, {
      style: (feature) => {
        // Differentiate style for WI counties
        if (feature.properties.STATEABBR === 'WI') {
          return {
            weight: 8,
            color: '#pink', // Blue for WI counties
            fillColor: '#3366ff',
            fillOpacity: 0.4,
          };
        } else {
          return {
            weight: 0.8,
            color: '#696969',
            fillColor: 'transparent',
            fillOpacity: 0,
          };
        }
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

    return countyLayer;
  },

  getCountyStyle: () => {
    return {
      weight: 0.8,
      color: '#696969',
      fillColor: 'transparent',
      fillOpacity: 0,
    };
  },

  highlightCounty: (countyLayer, selectedCounty, countyData) => {
    countyLayer.eachLayer(layer => {
      const isTargetCounty = (layer.feature.properties.COUNTYNAME === `${selectedCounty} County` && layer.feature.properties.STATEABBR === 'WI');

      if (isTargetCounty) {
        layer.setStyle({
          weight: 4,
          color: 'yellow',
          fillColor: 'yellow',
          fillOpacity: 0.25,
        });
      } else {
        layer.setStyle(MapInitialization.getCountyStyle());
      }
    });
  },

  setMaxBounds: (map, bounds) => {
    map.setMaxBounds(bounds);
  }
};

export default MapInitialization;
