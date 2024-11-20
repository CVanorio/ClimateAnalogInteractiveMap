import React, { useState, useEffect } from 'react';
import '../../styles/LoadingOverlay.css'; // Import the CSS file for styling

const NoDataOverlay = ({}) => {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    setShowOverlay(true);
    
  }, []); // Effect runs when `loading` state changes

  return (
    showOverlay && (
      <div className='overlayContainer'>
        <div className='box'>
          {/* Spinner indicating loading state */}
          <div className='noData'>
            <i class="fa-solid fa-cloud-sun-rain"></i>
          </div>
          {/* Main text to display during loading */}
          <div className='text'>Coming Soon!</div>
          {/* Subtext for additional information */}
          <div className='subtext'>The data for this time frame has not been published yet.</div>
        </div>
      </div>
    )
  );
};

export default NoDataOverlay;