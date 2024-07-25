import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet CSS is imported
import { ColorRampCollection } from "@maptiler/sdk";
import { scaleSequential } from 'd3-scale';
import { interpolateViridis, interpolateYlOrRd, interpolateSpectral } from 'd3-scale-chromatic';
import '../../styles/MapStyles.css';

let coloredCounties = []; // Maintain a list of colored counties
let currentTargetLayer = null; // Global variable to keep track of the current target county layer
let currentMarker = null; // Global variable to keep track of the current marker

const MarkerHandler = {
  handleMarkers: (map, markersRef, mapData, selectedDataType, initialBoundsSet, highlightedYear, yearColors, targetYear, timeScale, scaleValue) => {
    if (!mapData || !Array.isArray(mapData)) {
      return; // If mapData is null or undefined, do nothing and return
    }

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const markerMap = new Map();
    const latLngs = [];

    // Remove color and popups for previously colored counties
    coloredCounties.forEach((county) => {
      const layer = county.layer;

      if (layer && layer.setStyle && typeof layer.setStyle === 'function') {
        layer.setStyle({
          fillColor: '',
          fillOpacity: 0,
          weight: 0.7,
          color: 'grey',
          className: ''
        });
        layer.unbindPopup();
      }
    });
    coloredCounties = []; // Clear the list

    if (targetYear === 'top_analogs') {
      const latLngs = [];
      const markerMap = new Map();
      
      mapData.forEach((item) => {
        const lat = Number(item.AnalogCountyLatitude);
        const lng = Number(item.AnalogCountyLongitude);
    
        if (isNaN(lat) || isNaN(lng)) {
          console.error("Invalid coordinates:", item.AnalogCountyLatitude, item.AnalogCountyLongitude);
          return;
        }
    
        const latlng = new L.LatLng(lat, lng);
        latLngs.push(latlng);
    
        const popupHeader = `<strong>${item.AnalogCountyName} County, ${item.AnalogCountyStateAbbr}</strong>`;
        let popupContent = '';
    
        if (selectedDataType === 'precipitation' || selectedDataType === 'both') {
          popupContent += `<i class="fas fa-cloud-rain"></i> Precipitation Norm: ${Number(item.AnalogPrecipNormal)} in<br>`;
        }
    
        if (selectedDataType === 'temperature' || selectedDataType === 'both') {
          popupContent += `<i class="fas fa-thermometer-half"></i> Temperature Norm: ${Number(item.AnalogTempNormal)} °F<br>`;
        }
    
        const yearAndDistance = `${Number(item.Year)} with a Difference Score of ${item.Distance} and a rank of ${item.RowNumber}`;
        const precipValue = selectedDataType === 'precipitation' || selectedDataType === 'both' ? `Precipitation: ${Number(item.TargetPrecipValue)} in` : '';
        const tempValue = selectedDataType === 'temperature' || selectedDataType === 'both' ? `Temperature: ${Number(item.TargetTempValue)} °F` : '';
        
        const sentence = `In ${item.Year}, ${popupHeader} had ${yearAndDistance}. ${precipValue}${precipValue && tempValue ? ' and ' : ''}${tempValue}.`;
        
        if (markerMap.has(latlng.toString())) {
          const existingMarkerData = markerMap.get(latlng.toString());
          const newContent = `${existingMarkerData.popupContent}<br>${sentence}`;
    
          markerMap.set(latlng.toString(), {
            count: existingMarkerData.count + 1,
            popupContent: newContent,
            yearsAndDistances: existingMarkerData.yearsAndDistances.concat(sentence),
            years: existingMarkerData.years.concat(Number(item.Year))
          });
        } else {
          markerMap.set(latlng.toString(), {
            count: 1,
            popupContent: `${popupHeader}<br>${sentence}`,
            yearsAndDistances: [sentence],
            years: [Number(item.Year)]
          });
        }
      });
    
      // Prepare markers with averaged colors
      const averagedMarkers = [];
      markerMap.forEach((data, latlngString) => {
        if (latlngString && typeof latlngString === 'string' && latlngString.includes(',')) {
          const latLngArray = latlngString.slice(7, -1).split(',').map(Number);
          if (latLngArray.length === 2 && !isNaN(latLngArray[0]) && !isNaN(latLngArray[1])) {
            let markerColor = '#000000';
            if (data.years.length > 1) {
              const medianYear = getMedianYear(data.years);
              markerColor = yearColors[medianYear];
            } else {
              markerColor = yearColors[data.years];
            }
    
            const className = data.years.includes(highlightedYear) ? 'circular-marker highlighted' : 'circular-marker';
    
            // Calculate contrast color for text based on averagedColor
            const fontColor = 'white'; // Adjust contrast color if needed
    
            const marker = L.marker(latLngArray, {
              icon: L.divIcon({
                html: `<div class="${className}" style="background-color: ${markerColor}; color: ${fontColor};">${data.count > 1 ? data.count : ''}</div>`,
                className: '', // Leave className empty to avoid default styling
                iconSize: [16, 16], // Set size to avoid default size
                popupAnchor: [0, -8] // Adjust popup position if necessary
              }),
              interactive: true // Ensuring marker is interactive
            }).bindPopup(data.popupContent);
    
            averagedMarkers.push(marker);
          } else {
            console.error("Invalid coordinates:", latlngString);
          }
        } else {
          console.error("Invalid latlngString format:", latlngString);
        }
      });
    
      // Add averaged markers to map
      averagedMarkers.forEach(marker => {
        markersRef.current.push(marker);
        marker.addTo(map);
      });
    
      // Fit map bounds with buffer once, when data is first added
      if (!initialBoundsSet) {
        const bounds = L.latLngBounds(latLngs);
        const buffer = 0.2; // Adjust the buffer as needed
        map.fitBounds(bounds.pad(buffer));
      }
    }
     else {
      // When targetYear is not 'top_analogs', fill counties with colors based on distance
      mapData.forEach((item) => {
        const countyKey = `${item.AnalogCountyName} County`;
        const stateKey = `${item.AnalogCountyStateAbbr}`;
        const fillColor = getColorForDistance(Number(item.Distance));

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
          timeFrameString = `in the <strong>${scaleValue}</strong>`;
        } else if (timeScale === 'by_month') {
          timeFrameString = `in <strong>${monthName}</strong>`;
        } else if (timeScale === 'by_year') {
          timeFrameString = `for the year`
        }

        // Construct popup content based on selectedDataType
        let temperatureText = selectedDataType === 'temperature' || selectedDataType === 'both'
          ? `an <strong>average temperature</strong> of <i class="fas fa-thermometer-half"></i> <strong>${Number(item.AnalogTempNormal)} °F</strong>`
          : '';
        let precipitationText = selectedDataType === 'precipitation' || selectedDataType === 'both'
          ? `a <strong>total precipitation</strong> of <i class="fas fa-cloud-rain"></i> <strong>${Number(item.AnalogPrecipNormal)} in</strong>`
          : '';
        let differenceScoreText = `a <strong>Climate Difference Score</strong> of <strong>${Number(item.Distance)}</strong>`;

        // Update the rankText variable
        let rankText = `the <strong>${getOrdinal(Number(item.RowNumber))}</strong> best analog match`;

        // Combine the text parts
        const popupContent = `The typical climate of <strong>${item.AnalogCountyName} County, ${item.AnalogCountyStateAbbr}</strong> ${timeFrameString} has ${temperatureText}${temperatureText && precipitationText ? ' and ' : ''}${precipitationText}. </br>When compared to ${item.TargetCountyName} County, WI ${timeFrameString} ${targetYear} it has ${differenceScoreText} and is ${rankText}.`;
        // Update the existing county layer's style and popup
        map.eachLayer((layer) => {
          if (layer.feature && layer.feature.properties && layer.feature.properties.COUNTYNAME === countyKey && layer.feature.properties.STATEABBR === stateKey) {
            if (Number(item.RowNumber) === 1) {
              layer.setStyle({
                fillColor: fillColor,
                fillOpacity: 1,
                color: 'cyan', // Set border color
                weight: 3, // Set border width
                opacity: 1,
                zIndex: 5000,
              });
            } else {
              layer.setStyle({
                fillColor: fillColor,
                fillOpacity: 1
              });
            }

            layer.bindPopup(popupContent, {
              className: 'target-county-popup'
            }); // Set popup content

            // Add the layer to the colored counties list
            coloredCounties.push({ layer });
          }
        });
      });
    }

  },

  highlightCounty: (map, selectedCounty, countyData, mapData, timeScale, scaleValue, targetYear, selectedDataType) => {
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
            iconAnchor: [8, 24], // Center horizontally and bottom vertically
            popupAnchor: [0, -20] // Adjust this value to position the popup above the icon
          });
  
          // Create the popup content based on mapData
          let popupContent = '';
          if (mapData) {
            const data = mapData.find(item => `${item.TargetCountyName} County` === targetCounty);
            if (data) {
              let timeFrameString = '';
  
              // Convert month number to month name
              const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ];
  
              const monthName = timeScale === 'by_month' && !isNaN(scaleValue)
                ? monthNames[parseInt(scaleValue, 10) - 1] // Convert "01" to "January", "02" to "February", etc.
                : scaleValue;
  
              if (timeScale === 'by_season') {
                timeFrameString = `the <strong>${scaleValue}</strong>,`;
              } else if (timeScale === 'by_month') {
                timeFrameString = `<strong>${monthName}</strong>,`;
              }
  
              // Construct popup content based on selectedDataType
              let temperatureText = selectedDataType === 'temperature' || selectedDataType === 'both'
              ? `an <strong>average temperature</strong> of <i class="fas fa-thermometer-half"></i> <strong>${data.TargetTempValue} °F</strong>`
              : '';
            let precipitationText = selectedDataType === 'precipitation' || selectedDataType === 'both'
              ? `a <strong>total precipitation</strong> of <i class="fas fa-cloud-rain"></i> <strong>${data.TargetPrecipValue} in</strong>`
              : '';


            // Combine the text parts
            popupContent = `<strong>${data.TargetCountyName} County, WI</strong> in ${timeFrameString} <strong>${targetYear}</strong> had ${temperatureText}${temperatureText && precipitationText ? ' and ' : ''}${precipitationText}.`;
          } else {
            console.error('No matching data found in mapData for the selected feature.');
          }
          }
  
          // Add marker with popup
          currentMarker = L.marker([latitude, longitude], { icon })
            .bindPopup(popupContent, {
              className: 'target-county-popup', // Add this line
              closeButton: false // Disable close button but keep popup open
            })
            .addTo(map);
  
          // Open the popup manually
          if (mapData) {
            currentMarker.openPopup(); // Ensure the popup is visible immediately
          }
  
          // Add event listener to manage custom popup visibility
          map.on('popupopen', function (e) {
            if (e.popup !== currentMarker.getPopup()) {
              // If the opened popup is not the custom one, close the custom popup
              if (currentMarker && currentMarker.getPopup()) {
                currentMarker.closePopup();
              }
            }
          });
        } else {
          console.error(`Cannot find feature for ${targetCounty} in countyData.`);
        }
      } else {
        console.error('County data is undefined or does not contain features.');
      }
    }
  }
  

};

// Function to convert number to ordinal
function getOrdinal(number) {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = number % 100;
  return number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}


// Function to calculate median year
function getMedianYear(values) {
  if (values.length === 0) return 0;

  values.sort((a, b) => a - b);
  const half = Math.floor(values.length / 2);

  return values[half];
}

// Function to calculate contrast color for readability
function getContrastColor(hexColor) {
  if (!hexColor) {
    return '#000000'; // Default to black if hexColor is not provided
  }

  // Convert hex color to RGB
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) {
    console.error('Invalid hex color format:', hexColor);
    return '#000000'; // Return black for invalid format
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Calculate YIQ ratio for contrast
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  // Return black or white based on YIQ ratio
  return yiq >= 100 ? '#000000' : '#ffffff';
}

const colorScale = scaleSequential(interpolateSpectral)
  .domain([0, 2]);

// Function to get color for a given distance
const getColorForDistance = (distance) => {
  return colorScale(Number(distance));
};

export default MarkerHandler;
