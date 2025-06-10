import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet CSS is imported
import { ColorRampCollection } from "@maptiler/sdk";
import { scaleSequential } from 'd3-scale';
import {interpolateTurbo} from 'd3-scale-chromatic';
import '../../styles/MapStyles.css';

let coloredCounties = []; // Maintain a list of colored counties
let currentTargetLayer = null; // Global variable to keep track of the current target county layer
let currentMarker = null; // Global variable to keep track of the current marker

// Get current date details
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1; // Months are 0-based, so add 1

// Define completed seasons based on the current month
const completedSeasons = {
  Winter: currentMonth > 2, // Winter is considered complete after February
  Spring: currentMonth > 5, // Spring is complete after May
  Summer: currentMonth > 8, // Summer is complete after August
  Fall: currentMonth > 11, // Fall is complete after November
};

const MarkerHandler = {
  handleMarkers: (map, markersRef, mapData, selectedDataType, initialBoundsSet, highlightedYear, yearColors, targetYear, timeScale, scaleValue) => {
    if (!mapData || !Array.isArray(mapData)) {
      return; // If mapData is null or undefined, do nothing and return
    }

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const markerMap = new Map();
    let latLngs = [];

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
      let latLngs = [];
      const averagedMarkers = [];
      
      mapData.forEach((item) => {
        const lat = Number(item.AnalogCountyLatitude);
        const lng = Number(item.AnalogCountyLongitude);
        const itemYear = Number(item.Year);
        const isCurrentYear = itemYear === currentYear;
    
        // Skip invalid markers based on the time scale and current date
        if (timeScale === 'by_year' && isCurrentYear) {
          return;
        } else if (timeScale === 'by_month' && isCurrentYear && Number(scaleValue) > currentMonth - 1) {
          return;
        } else if (timeScale === 'by_season' && isCurrentYear && !completedSeasons[scaleValue]) {
          return;
        }
    
        // Determine opacity based on whether the year is <= or > the highlighted year
        const opacity = itemYear > highlightedYear ? 0 : 1;
        let latlng = null;
        if (lat !== null && lng !== null){
          latlng = new L.LatLng(lat, lng);
          latLngs.push(latlng);
        }
        
    
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        const monthName = timeScale === 'by_month' && !isNaN(scaleValue)
          ? monthNames[parseInt(scaleValue, 10) - 1]
          : scaleValue;
    
        let timeFrameString = '';
        if (timeScale === 'by_season') {
          timeFrameString = `<strong>${scaleValue}</strong>`;
        } else if (timeScale === 'by_month') {
          timeFrameString = `<strong>${monthName}</strong>`;
        } else if (timeScale === 'by_year') {
          timeFrameString = `<strong>annual</strong>`;
        }
    
        let temperatureText = selectedDataType === 'temperature' || selectedDataType === 'both'
          ? `an <strong>average temperature</strong> of <i class="fas fa-thermometer-half"></i> <strong>${Number(item.AnalogTempNormal)} °F</strong>`
          : '';
        let precipitationText = selectedDataType === 'precipitation' || selectedDataType === 'both'
          ? `a <strong>total precipitation</strong> of <i class="fas fa-cloud-rain"></i> <strong>${Number(item.AnalogPrecipNormal)} in</strong>`
          : '';
    
        const sentence = `The ${timeFrameString} <strong>${itemYear}</strong> climate in <strong>${item.TargetCountyName}, WI</strong> had ${temperatureText}${temperatureText && precipitationText ? ' and ' : ''}${precipitationText}.`;
    
        const existingMarkerData = markerMap.get(latlng.toString());
    
        let yearsArray;
        let popupHeader;
        let expandableContent = '';
    
        if (existingMarkerData) {
          // Update years array to include the new year
          yearsArray = [...new Set([...existingMarkerData.years, itemYear])];
    
          const yearsForPopupHeader = yearsArray.length === 1
            ? `<strong>${yearsArray[0]}</strong>`
            : yearsArray.length === 2
              ? `<strong>${yearsArray[0]}</strong> and <strong>${yearsArray[1]}</strong>`
              : `<strong>${yearsArray.slice(0, -1).join(', ')}</strong>, and <strong>${yearsArray[yearsArray.length - 1]}</strong>`;
    
          popupHeader = `The ${timeFrameString} climate of <strong>${item.AnalogCountyName}, ${item.AnalogCountyStateAbbr}</strong> has ${temperatureText}${temperatureText && precipitationText ? ' and ' : ''}${precipitationText}. It was the best analog match for ${item.TargetCountyName}, WI for the following years:<br><br>`;
    
          // Add new sentence to existingMarkerData.yearsAndDistances
          existingMarkerData.yearsAndDistances.push(sentence);
    
          // Construct expandable content for each year if there are multiple years
          expandableContent = yearsArray.map((year, index) => {
            const yearDetails = existingMarkerData.yearsAndDistances[index];
            return `<details><summary class="expanded-summary"><strong>${year}</strong></summary><p>${yearDetails}</p></details>`;
          }).join('');
    
          // Update marker data
          markerMap.set(latlng.toString(), {
            count: existingMarkerData.count + 1,
            popupContent: `${popupHeader}${expandableContent}`,
            yearsAndDistances: existingMarkerData.yearsAndDistances,
            years: yearsArray
          });
        } else {
          // Create new entry for markers without existing data
          yearsArray = [itemYear];
    
          popupHeader = `The climate of <strong>${item.AnalogCountyName}, ${item.AnalogCountyStateAbbr}</strong> ${timeFrameString} has ${temperatureText}${temperatureText && precipitationText ? ' and ' : ''}${precipitationText}. It was the <strong>best analog match</strong> for <strong>${item.TargetCountyName}, WI</strong> in <strong>${itemYear}</strong>.<br><br>`;
    
          expandableContent = sentence;
    
          markerMap.set(latlng.toString(), {
            count: 1,
            popupContent: `${popupHeader}${expandableContent}`,
            yearsAndDistances: [sentence],
            years: yearsArray
          });
        }
    
        const markerRadius = existingMarkerData ? Math.pow(existingMarkerData.count + 1, 0.5) * 15 : 15;
        const markerColor = yearsArray.includes(itemYear) ? yearColors[itemYear] : '#000000';
        const className = yearsArray.includes(highlightedYear) ? 'circular-marker highlighted' : 'circular-marker';
        const fontColor = getContrastColor(markerColor);
        const markerOpacity = yearsArray.some(year => year > highlightedYear) ? 0 : 1;
    
        const marker = L.marker(latlng, {
          icon: L.divIcon({
            html: `<div class="${className}" style="background-color: ${markerColor}; color: ${fontColor}; opacity: ${markerOpacity}; width: ${markerRadius}px; height: ${markerRadius}px; border-radius: 50%;"></div>`,
            className: '',
            iconSize: [markerRadius, markerRadius],
            popupAnchor: [0, -markerRadius / 2]
          }),
          interactive: true
        }).bindPopup(`${popupHeader}${expandableContent}`, {
          className: 'analog-county-popup',
          closeButton: true
        });
    
        averagedMarkers.push(marker);
      });
    
      averagedMarkers.forEach(marker => {
        markersRef.current.push(marker);
        marker.addTo(map);
      });
    
      if (latLngs.length > 0) {
        const bounds = L.latLngBounds(latLngs);
        const buffer = 0.2;
        map.fitBounds(bounds.pad(buffer));
      }
    }
    
    
    
    
    
    
    else {
      // When targetYear is not 'top_analogs', fill counties with colors based on distance
      let latlngs = [];
      mapData.forEach((item) => {
        if (item.AnalogCountyName !== null){
          const countyKey = `${item.AnalogCountyName}`;
        const stateKey = `${item.AnalogCountyStateAbbr}`;
        const fillColor = getColorForDistance(Number(item.Distance));
        const lat = Number(item.AnalogCountyLatitude);
        const lng = Number(item.AnalogCountyLongitude);
        let latlng = null;
        if (lat !== null && !isNaN(lat) && lng !== null && !isNaN(lng)) {
          latlng = new L.LatLng(lat, lng);
          latLngs.push(latlng);
        }
        

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
          timeFrameString = `<strong>${scaleValue}</strong>`;
        } else if (timeScale === 'by_month') {
          timeFrameString = `<strong>${monthName}</strong>`;
        } else if (timeScale === 'by_year') {
          timeFrameString = `<strong>annual</strong>`
        }

        // Construct popup content based on selectedDataType
        let temperatureText = selectedDataType === 'temperature' || selectedDataType === 'both'
          ? `an <strong>average temperature</strong> of <i class="fas fa-thermometer-half"></i> <strong>${Number(item.AnalogTempNormal)} °F</strong>`
          : '';
        let precipitationText = selectedDataType === 'precipitation' || selectedDataType === 'both'
          ? `a <strong>total precipitation</strong> of <i class="fas fa-cloud-rain"></i> <strong>${Number(item.AnalogPrecipNormal)} in</strong>`
          : '';
        //let differenceScoreText = `a <strong>Climate Difference Score</strong> of <strong>${Number(item.Distance)}</strong>`;

        // Update the rankText variable
        //let rankText = `the <strong>${getOrdinal(Number(item.AnalogRank))}</strong> best analog match`;

        // Combine the text parts
        const popupContent = `The ${timeFrameString} climate of <strong>${item.AnalogCountyName}, ${item.AnalogCountyStateAbbr}</strong> has ${temperatureText}${temperatureText && precipitationText ? ' and ' : ''}${precipitationText}.`; /*</br>When compared to ${item.TargetCountyName}, WI ${timeFrameString} <strong>${targetYear}</strong> it has ${differenceScoreText} and is ${rankText}.`;*/
        // Update the existing county layer's style and popup
        map.eachLayer((layer) => {
          if (layer.feature && layer.feature.properties && layer.feature.properties.COUNTYNAME === countyKey && layer.feature.properties.STATEABBR === stateKey) {
            if (Number(item.AnalogRank) === 1) {
              // Extract latitude and longitude from feature properties
              const latitude = layer.feature.properties.LAT;
              const longitude = layer.feature.properties.LONG;

              // Create a custom icon for the top analog marker
              const topAnalogIcon = L.divIcon({
                html: '<i class="fa-solid fa-star"></i>',
                className: 'topAnalogMarker',
                iconAnchor: [12, 10], // Center horizontally and bottom vertically
                popupAnchor: [0, -10] // Adjust this value to position the popup above the icon
              });

              // Add marker with the custom icon to the specified latitude and longitude
              const topAnalogMarker = L.marker([latitude, longitude], { icon: topAnalogIcon })
                .bindPopup(popupContent, {
                  className: 'analog-county-popup', // Add this line
                  closeButton: true // Disable close button but keep popup open
                })
                .addTo(map)
                .openPopup(); // Automatically open the popup

              markersRef.current.push(topAnalogMarker);

              // Apply a style to the layer for the top analog
              layer.setStyle({
                fillColor: fillColor,
                fillOpacity: 0.7,
                // color: 'black', // Set border color
                // weight: 3, // Set border width
                opacity: 1,
                zIndex: 5000,
              });
            } else {
              layer.setStyle({
                fillColor: fillColor,
                fillOpacity: 0.7
              });
            }

            layer.bindPopup(popupContent, {
              className: 'analog-county-popup'
            }); // Set popup content

            // Add the layer to the colored counties list
            coloredCounties.push({ layer });
          }
        });
        }
        
      });
      if (latLngs.length > 0) {
        let bounds = L.latLngBounds(latLngs);
        let buffer = 0.2;
        map.fitBounds(bounds.pad(buffer));
      }
     
    }

  },

  highlightCounty: (map, selectedCounty, countyData, mapData, timeScale, scaleValue, targetYear, selectedDataType) => {
    if (selectedCounty) {
      const targetCounty = `${selectedCounty}`;

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
            html: '<i class="fa-solid fa-location-dot" id="targetCountyPin"></i>',
            className: 'target-icon',
            iconAnchor: [8, 24], // Center horizontally and bottom vertically
            popupAnchor: [0, -20] // Adjust this value to position the popup above the icon
          });

          // Create the popup content based on mapData
          let popupContent = '';
          if (mapData.length > 0) {
            const data = mapData.find(item => `${item.TargetCountyName}` === targetCounty);

            if (data) {
              if (targetYear === 'top_analogs') {
                popupContent = `<strong>${data.TargetCountyName}, WI</strong>`
              } else {

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
                popupContent = `<strong>${data.TargetCountyName}, WI</strong> in ${timeFrameString} <strong>${targetYear}</strong> had ${temperatureText}${temperatureText && precipitationText ? ' and ' : ''}${precipitationText}.`;
              }
            } else {
              console.error('No matching data found in mapData for the selected feature.');
            }
          }

          if (mapData.length === 0)
          {
            currentMarker = L.marker([latitude, longitude], { icon })
            .addTo(map);
          }
          
          // Open the popup if it has content
          if (mapData.length > 0) {
            // Add a new marker with the popup
            currentMarker = L.marker([latitude, longitude], { icon })
            .bindPopup(popupContent, {
              className: 'target-county-popup', // Add this line
              closeButton: true, // Disable close button but keep popup open
            })
            .addTo(map);

            //currentMarker.openPopup();
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
    // Set variables to null for garbage collection
    // coloredCounties = null;
    // currentTargetLayer = null;
    // currentMarker = null;
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

function getContrastColor(rgbColor) {
  if (!rgbColor) {
    console.error('RGB color is not provided');
    return '#000000'; // Return black for missing input
  }

  // Extract RGB values from the string format "rgb(r, g, b)"
  const rgbMatch = rgbColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!rgbMatch) {
    console.error('Invalid RGB color format:', rgbColor);
    return '#000000'; // Return black for invalid format
  }

  const r = parseInt(rgbMatch[1], 10);
  const g = parseInt(rgbMatch[2], 10);
  const b = parseInt(rgbMatch[3], 10);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    console.error('Invalid RGB color values:', rgbColor);
    return '#000000'; // Return black for invalid values
  }

  // Calculate YIQ ratio for contrast
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  // Return black or white based on YIQ ratio
  return yiq >= 140 ? '#000000' : '#ffffff';
}

const colorScale = scaleSequential(interpolateTurbo)
  .domain([2, -0.1]);

// Function to get color for a given distance
const getColorForDistance = (distance) => {
  return colorScale(Number(distance));
};

export default MarkerHandler;