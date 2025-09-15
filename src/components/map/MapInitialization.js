import L from 'leaflet';
import '../../styles/MapStyles.css';
import 'leaflet-easyprint';
import { TARGET_STATE_ABBR } from '../../utils/constants';

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

    // Download control
    L.easyPrint({
      title: 'Download Map',
      position: 'topleft',
      sizeModes: ['A4Landscape'],
      exportOnly: true,
    }).addTo(map);

    // --- panes & stacking order ---
    // Default Leaflet tile pane z-index ~200
    // Polygon vectors will sit above base tiles
    map.createPane('polygons');                // for states & counties
    map.getPane('polygons').style.zIndex = 450;

    // Labels-only tiles (transparent raster text) should sit above vectors
    map.createPane('labels');
    map.getPane('labels').style.zIndex = 650;  // above polygons
    map.getPane('labels').style.pointerEvents = 'none'; // keep vectors clickable

    // --- base tiles ---
    // Shaded relief (no labels)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
      }
    ).addTo(map);

    // Labels-only overlay (cities/places)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
      {
        pane: 'labels',
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
      }
    ).addTo(map);

    return map;
  },

  // Setup base layers for the map
  setupBaseLayers: (map, stateData) => {
    L.geoJSON(stateData, {
      pane: 'polygons',
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
      pane: 'polygons',
      style: (feature) => {
        // Differentiate style for Target State counties
        if (feature.properties.STATEABBR === TARGET_STATE_ABBR) {
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
        let originalColor; // store original color
        let originalOpacity;

        if (feature.properties.STATEABBR === TARGET_STATE_ABBR) {
          // Mouseover: show tooltip and change fill
          layer.on('mouseover', function () {
            originalColor = layer.options.fillColor;
            originalOpacity = layer.options.fillOpacity;

            tooltip = L.tooltip({
              permanent: true,
              direction: 'right',
              className: 'leaflet-tooltip',
            }).setContent(`${feature.properties.COUNTYNAME}, ${feature.properties.STATEABBR}`);

            this.bindTooltip(tooltip).openTooltip();

            layer.setStyle({
              fillColor: 'blue',
              fillOpacity: 0.25,
            });
          });

          // Mouseout: hide tooltip and reset style
          layer.on('mouseout', function () {
            if (tooltip) {
              this.unbindTooltip();
              tooltip = null;
            }

            layer.setStyle({
              fillColor: originalColor,
              fillOpacity: originalOpacity,
            });
          });

          // Click for Target State counties only
          layer.on('click', function () {
            handleCountyClick(feature.properties.COUNTYNAME);
          });

          // Prevent drag-box selection interference
          layer.on('mousedown', function (e) {
            L.DomEvent.stopPropagation(e);
          });
        }
      },
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
  },
};

export default MapInitialization;
