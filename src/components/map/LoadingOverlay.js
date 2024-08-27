import React, { useState, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import '../../styles/LoadingOverlay.css'; // Import the CSS file for styling

const LoadingOverlay = ({ loading }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      // Delay showing the overlay to avoid flickering for brief loading states
      timer = setTimeout(() => {
        setShowOverlay(true);
      }, 500); // Show overlay after 0.5 seconds
    } else {
      setShowOverlay(false); // Hide overlay immediately if loading is false
    }

    // Cleanup the timer when the component unmounts or loading state changes
    return () => clearTimeout(timer);
  }, [loading]); // Effect runs when `loading` state changes

  return (
    showOverlay && (
      <div className='overlayContainer'>
        <div className='box'>
          {/* Spinner indicating loading state */}
          <div className='spinner'>
            <PulseLoader size={15} color={"#007bff"} loading={loading} />
          </div>
          {/* Main text to display during loading */}
          <div className='text'>Calculating Climate Patterns...</div>
          {/* Subtext for additional information */}
          <div className='subtext'>Please wait, this could take a few seconds</div>
        </div>
      </div>
    )
  );
};

export default LoadingOverlay;
