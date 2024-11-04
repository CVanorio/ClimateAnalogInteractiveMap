import React from 'react';
import '../../styles/TopAnalogsLegend.css';

const TopAnalogsLegend = ({ yearColors }) => {
  // Generate a CSS gradient string from `yearColors`
  const gradient = Object.values(yearColors).join(',');

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Calculate the marker radius based on counts
  const getMarkerRadius = (count) => Math.pow(count + 1, 0.5) * 15; // Adjust multiplier as needed

  // Example marker sizes
  const markerCount1 = 1;
  const markerCount6 = 6;

  // Get colors for the current year
  const markerColor = yearColors[currentYear]; // Default color

  return (
    <div className="legend-container">
      <div className="legend-title">Top Analogs</div>

      {/* Example for count 1 */}
      <div className="legend-example" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '5px' }}>
        <div
          className="circular-marker"
          style={{
            backgroundColor: markerColor,
            color: '#000000',
            width: `${getMarkerRadius(markerCount1)}px`,
            height: `${getMarkerRadius(markerCount1)}px`,
            borderRadius: '50%',
            display: 'inline-block',
            opacity: 1, // Set opacity to 1 to make the marker visible
            marginRight: '5px' // Add some spacing between marker and label
          }}
        ></div>
        <div>{`1`}</div>
      </div>

      {/* Example for count 6 */}
      <div className="legend-example" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '5px' }}>
        <div
          className="circular-marker"
          style={{
            backgroundColor: markerColor,
            color: '#000000',
            width: `${getMarkerRadius(markerCount6)}px`,
            height: `${getMarkerRadius(markerCount6)}px`,
            borderRadius: '50%',
            display: 'inline-block',
            opacity: 1, // Set opacity to 1 to make the marker visible
            marginRight: '5px' // Add some spacing between marker and label
          }}
        ></div>
        <div>{`6`}</div>
      </div>

      <div className="legend-rectangle-container">
        <div className="legend-labels">
          {/* Display the current year dynamically */}
          <div className="legend-high">{currentYear}</div>
          {/* Apply the generated gradient as the background of the rectangle */}
          <div
            className="legend-rectangle"
            style={{ background: `linear-gradient(to top, ${gradient})` }}
          ></div>
          <div className="legend-low">1895</div>
        </div>
      </div>
    </div>
  );
};

export default TopAnalogsLegend;
