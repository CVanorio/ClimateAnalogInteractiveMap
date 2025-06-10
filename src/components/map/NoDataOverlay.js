import React, { useState, useEffect } from 'react';
import '../../styles/LoadingOverlay.css'; // Import the CSS file for styling

const NoDataOverlay = ({ loading }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    let timer;

    if (!loading) {
      // Show overlay only when loading is false, with a delay to prevent flicker
      timer = setTimeout(() => {
        setShowOverlay(true);
      }, 500); // Delay for better user experience
    } else {
      // Hide the overlay immediately when loading starts
      setShowOverlay(false);
    }

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, [loading]);

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