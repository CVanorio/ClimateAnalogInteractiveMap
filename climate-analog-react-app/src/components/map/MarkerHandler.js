import L from 'leaflet';

const MarkerHandler = {
  handleMarkers: (map, markersRef, mapData, selectedDataType, focusToMarkers, highlightedYear) => {
    console.log(highlightedYear);
    
    if (!mapData || !Array.isArray(mapData)) {
      // If mapData is null or undefined, do nothing and return
      return;
    }

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const markerMap = new Map();
    const latLngs = [];

    mapData.forEach((item) => {
      const lat = Number(item.AnalogCountyLatitude);
      const lng = Number(item.AnalogCountyLongitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        const latlng = new L.LatLng(lat, lng);
        latLngs.push(latlng);

        let popupHeader = `<strong>${item.AnalogCountyName} County, ${item.AnalogCountyStateAbbr}</strong><br>`;
        let popupContent = '';

        switch (selectedDataType) {
          case 'precipitation':
            popupContent = `<i class="fas fa-cloud-rain"></i> Precipitation Norm: ${Number(item.AnalogPrecipNormal)} in<br>`;
            break;
          case 'temperature':
            popupContent = `<i class="fas fa-thermometer-half"></i> Temperature Norm: ${Number(item.AnalogTempNormal)} °F<br>`;
            break;
          case 'both':
            popupContent = `<i class="fas fa-cloud-rain"></i> Precipitation Norm: ${Number(item.AnalogPrecipNormal)} in<br><i class="fas fa-thermometer-half"></i> Temperature Norm: ${Number(item.AnalogTempNormal)} °F<br>`;
            break;
          default:
            popupContent = `Data Type Not Recognized<br>`;
            break;
        }

        const yearAndDistance = `<tr><td>${item.Year}</td><td>${item.Distance}</td></tr>`;

        if (markerMap.has(latlng.toString())) {
          const existingMarkerData = markerMap.get(latlng.toString());
          const existingYearsAndDistances = existingMarkerData.yearsAndDistances ? existingMarkerData.yearsAndDistances : [];
          const newYearsAndDistances = [...existingYearsAndDistances, yearAndDistance];

          const updatedPopupContent = `${popupHeader}<br>
                                       <table>
                                         <thead>
                                           <tr><th>Year</th><th>Difference Score</th></tr>
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
            year: existingMarkerData.year
          });
        } else {
          markerMap.set(latlng.toString(), {
            count: 1,
            popupContent: `${popupHeader}<br>
                           <table>
                             <thead>
                               <tr><th>Year</th><th>Difference Score</th></tr>
                             </thead>
                             <tbody>
                               ${yearAndDistance}
                             </tbody>
                           </table>
                           <br>
                           ${popupContent}`,
            yearsAndDistances: [yearAndDistance],
            year: item.Year // Store year for this marker
          });
        }
      } else {
        console.error("Invalid coordinates:", item.AnalogCountyLatitude, item.AnalogCountyLongitude);
      }
    });

    // Add markers to map
    markerMap.forEach((data, latlngString) => {
      const latLngArray = latlngString.slice(7, -1).split(',').map(Number);
      if (latLngArray.length === 2 && !isNaN(latLngArray[0]) && !isNaN(latLngArray[1])) {
        const marker = L.marker(latLngArray, {
          icon: L.divIcon({
            html: data.count > 1 ? `<div class="circular-marker">${data.count}</div>` : `<div class="circular-marker"></div>`,
            className: `circular-marker ${highlightedYear === data.year ? 'highlighted' : ''}`,
          })
        }).bindPopup(data.popupContent);

        markersRef.current.push(marker);
        marker.addTo(map);
      } else {
        console.error("Invalid coordinates:", latlngString);
      }
    });

    // Fit map bounds with buffer
if (latLngs.length > 0) {
  if (focusToMarkers) {
    const bounds = L.latLngBounds(latLngs);
    const buffer = 0.2; // Adjust the buffer as needed
    map.fitBounds(bounds.pad(buffer));
  } else {
    map.setView([44.5, -89.5], 7);
  }
}
  },
};

export default MarkerHandler;
