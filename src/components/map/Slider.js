import React, { useRef, useState, useEffect } from 'react';
import '../../styles/Slider.css';

const Slider = ({
  years,
  highlightedYear,
  onChange,
  isPlaying,
  togglePlayPause,
  selectedDataType,
  yearColors
}) => {
  const intervalRef = useRef(null); // Reference for the interval timer
  const sliderRef = useRef(null); // Reference for the slider input
  const speedSelectorRef = useRef(null); // Reference for the speed selector dropdown
  const [thumbPosition, setThumbPosition] = useState(0); // State for the thumb position
  const [speed, setSpeed] = useState(1); // State for playback speed
  const [showSpeedOptions, setShowSpeedOptions] = useState(false); // State for showing speed options

  // Initialize the slider with the first year if no year is highlighted
  useEffect(() => {
    if (!highlightedYear && years.length > 0) {
      onChange(years[0]);
    }
  }, [highlightedYear, years, onChange]);

  // Update thumb position when highlightedYear or years change
  useEffect(() => {
    if (sliderRef.current) {
      updateThumbPosition(sliderRef.current);
    }
  }, [highlightedYear, years]);

  // Manage playback interval when playing status or speed changes
  useEffect(() => {
    if (isPlaying) {
      updateInterval(speed);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current); // Clean up interval on component unmount
  }, [isPlaying, speed, highlightedYear, years]);

  // Close speed options if clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (speedSelectorRef.current && !speedSelectorRef.current.contains(event.target)) {
        setShowSpeedOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle slider value change and update thumb position
  const handleSliderChange = (event) => {
    const year = parseInt(event.target.value, 10);
    onChange(year);
    updateThumbPosition(event.target);
  };

  // Update playback speed and adjust interval if playing
  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    setShowSpeedOptions(false);

    if (isPlaying) {
      updateInterval(newSpeed);
    }
  };

  // Update interval based on selected speed
  const updateInterval = (selectedSpeed) => {
    let interval = 1000;
    if (selectedSpeed === 2) {
      interval = 500;
    } else if (selectedSpeed === 3) {
      interval = 300;
    }

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const currentIndex = years.findIndex((year) => year === highlightedYear);
      const nextIndex = (currentIndex + 1) % years.length;
      onChange(years[nextIndex]);
      updateThumbPosition(sliderRef.current);
    }, interval);
  };

  // Update the thumb position based on the slider's value
  const updateThumbPosition = (slider) => {
    const max = slider.max;
    const min = slider.min;
    const value = slider.value;

    const percent = ((value - min) / (max - min)) * 100;
    const thumbWidth = 45; // Width of the thumb
    const offset = (percent / 100) * (slider.clientWidth - thumbWidth);

    setThumbPosition(offset + thumbWidth / 2);
  };

  // Toggle play/pause state
  const togglePlay = () => {
    togglePlayPause();
  };

  // Show or hide speed options dropdown
  const toggleSpeedOptions = () => {
    setShowSpeedOptions(!showSpeedOptions);
  };

  // Generate the slider background gradient based on years and colors
  const generateSliderBackground = () => {
    const colorStops = years.map(year => `${yearColors[year]} ${(year - years[0]) / (years[years.length - 1] - years[0]) * 100}%`).join(', ');
    return `linear-gradient(to right, ${colorStops})`;
  };

  return (
    <div className="slider-container">
      <div className="playPauseButton" onClick={togglePlay}>
        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
      </div>
      <div className="speedControl" ref={speedSelectorRef}>
        <div className="speedSelector" onClick={toggleSpeedOptions}>
          {speed}x
          <div className={`speedOptions ${showSpeedOptions ? 'show' : ''}`}>
            <div className="speedOption" onClick={() => handleSpeedChange(1)}>1x</div>
            <div className="speedOption" onClick={() => handleSpeedChange(2)}>2x</div>
            <div className="speedOption" onClick={() => handleSpeedChange(3)}>3x</div>
          </div>
        </div>
      </div>
      <input
        type="range"
        min={years[0]}
        max={years[years.length - 1]}
        step={1}
        value={highlightedYear || years[0]}
        onChange={handleSliderChange}
        className="slider"
        ref={sliderRef}
        style={{ background: generateSliderBackground() }}
      />
      <div className="custom-thumb" style={{ left: `${thumbPosition}px` }}>
        {highlightedYear}
      </div>
    </div>
  );
};

export default Slider;
