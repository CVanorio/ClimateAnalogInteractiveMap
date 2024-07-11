import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet CSS is imported

const MarkerHandler = {
  handleMarkers: (map, markersRef, mapData, selectedDataType, initialBoundsSet, highlightedYear, yearColors) => {
    if (!mapData || !Array.isArray(mapData)) {
      return; // If mapData is null or undefined, do nothing and return
    }

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const markerMap = new Map();
    const latLngs = [];

    mapData.forEach((item) => {
      const lat = Number(item.AnalogCountyLatitude);
      const lng = Number(item.AnalogCountyLongitude);

      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates:", item.AnalogCountyLatitude, item.AnalogCountyLongitude);
        return;
      }

      const latlng = new L.LatLng(lat, lng);
      latLngs.push(latlng);

      const popupHeader = `<strong>${item.AnalogCountyName} County, ${item.AnalogCountyStateAbbr}</strong><br>`;
      let popupContent = '';

      if (selectedDataType === 'precipitation' || selectedDataType === 'both') {
        popupContent += `<i class="fas fa-cloud-rain"></i> Precipitation Norm: ${Number(item.AnalogPrecipNormal)} in<br>`;
      }

      if (selectedDataType === 'temperature' || selectedDataType === 'both') {
        popupContent += `<i class="fas fa-thermometer-half"></i> Temperature Norm: ${Number(item.AnalogTempNormal)} °F<br>`;
      }

      const yearAndDistance = `<tr><td>${Number(item.Year)}</td><td>${item.Distance}</td>`;
      const precipValue = selectedDataType === 'precipitation' || selectedDataType === 'both' ? `<td>${Number(item.TargetPrecipValue)} in</td>` : '';
      const tempValue = selectedDataType === 'temperature' || selectedDataType === 'both' ? `<td>${Number(item.TargetTempValue)} °F</td>` : '';
      const row = `${yearAndDistance}${precipValue}${tempValue}</tr>`;

      if (markerMap.has(latlng.toString())) {
        const existingMarkerData = markerMap.get(latlng.toString());
        const newYearsAndDistances = [...existingMarkerData.yearsAndDistances, row];

        const updatedPopupContent = `${popupHeader}<br>
                                     <table>
                                       <thead>
                                         <tr>
                                           <th>Year</th>
                                           <th>Difference Score</th>
                                           ${selectedDataType === 'precipitation' || selectedDataType === 'both' ? '<th>Precipitation</th>' : ''}
                                           ${selectedDataType === 'temperature' || selectedDataType === 'both' ? '<th>Temperature</th>' : ''}
                                         </tr>
                                       </thead>
                                       <tbody>
                                         ${newYearsAndDistances.join('')}
                                       </tbody>
                                     </table>
                                     <br>
                                     ${popupContent}`;

        markerMap.set(latlng.toString(), {
          count: existingMarkerData.count + 1,
          popupContent: updatedPopupContent,
          yearsAndDistances: newYearsAndDistances,
          years: [...existingMarkerData.years, Number(item.Year)]
        });
      } else {
        markerMap.set(latlng.toString(), {
          count: 1,
          popupContent: `${popupHeader}<br>
                         <table>
                           <thead>
                             <tr>
                               <th>Year</th>
                               <th>Difference Score</th>
                               ${selectedDataType === 'precipitation' || selectedDataType === 'both' ? '<th>Precipitation</th>' : ''}
                               ${selectedDataType === 'temperature' || selectedDataType === 'both' ? '<th>Temperature</th>' : ''}
                             </tr>
                           </thead>
                           <tbody>
                             ${row}
                           </tbody>
                         </table>
                         <br>
                         ${popupContent}`,
          yearsAndDistances: [row],
          years: [Number(item.Year)]
        });
      }
    });

    // Prepare markers with averaged colors
    const averagedMarkers = [];
    markerMap.forEach((data, latlngString) => {
      const latLngArray = latlngString.slice(7, -1).split(',').map(Number);
      if (latLngArray.length === 2 && !isNaN(latLngArray[0]) && !isNaN(latLngArray[1])) {
        var markerColor = '#000000'
        if (data.years.length > 1){
          const medianYear = getMedianYear(data.years);
          markerColor = yearColors[medianYear]
        } else {
           markerColor = yearColors[data.years]
        }

        const className = data.years.includes(highlightedYear) ? 'circular-marker highlighted' : 'circular-marker';

        // Calculate contrast color for text based on averagedColor
        const fontColor = getContrastColor(markerColor);

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
  },
};

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
  return yiq >= 1 ? '#000000' : '#ffffff';
}

export default MarkerHandler;
