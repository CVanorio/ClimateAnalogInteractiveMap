import React, { useRef, useEffect, useState } from 'react';
import '../../styles/Slider.css';

const Slider = ({ years, highlightedYear, onChange, isPlaying, togglePlayPause, selectedDataType, yearColors }) => {
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);
  const speedOptionsRef = useRef(null); // Ref for speed options dropdown
  const [thumbPosition, setThumbPosition] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!highlightedYear && years.length > 0) {
      onChange(years[0]);
    }
  }, [highlightedYear, years, onChange]);

  const handleSliderChange = (event) => {
    const year = parseInt(event.target.value);
    onChange(year);
    updateThumbPosition(event.target);
  };

  const handleSpeedChange = (event) => {
    const selectedSpeed = parseFloat(event.target.value);
    setSpeed(selectedSpeed);

    // Update interval immediately if playing
    if (isPlaying) {
      updateInterval(selectedSpeed);
    }
  };

  const updateInterval = (selectedSpeed) => {
    let interval = 1000; // Default interval
    if (selectedSpeed === 2) {
      interval = 500;
    } else if (selectedSpeed === 3) {
      interval = 300;
    }

    clearInterval(intervalRef.current); // Clear previous interval
    intervalRef.current = setInterval(() => {
      const currentIndex = years.findIndex((year) => year === highlightedYear);
      const nextIndex = (currentIndex + 1) % years.length;
      onChange(years[nextIndex]);
      updateThumbPosition(sliderRef.current);
    }, interval);
  };

  const updateThumbPosition = (slider) => {
    const max = slider.max;
    const min = slider.min;
    const value = slider.value;

    const percent = ((value - min) / (max - min)) * 100;
    const thumbWidth = 45; // Same width as the thumb
    const offset = (percent / 100) * (slider.clientWidth - thumbWidth);

    setThumbPosition(offset + thumbWidth / 2); // Center the label
  };

  useEffect(() => {
    if (sliderRef.current) {
      updateThumbPosition(sliderRef.current);
    }
  }, [highlightedYear, sliderRef.current]);

  useEffect(() => {
    if (isPlaying) {
      updateInterval(speed); // Initial update with current speed
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isPlaying, highlightedYear, onChange, years, speed]);

  const togglePlay = () => {
    togglePlayPause();
  };

  const generateSliderBackground = () => {
    const colorStops = years.map(year => `${yearColors[year]} ${(year - years[0]) / (years[years.length - 1] - years[0]) * 100}%`).join(', ');
    return `linear-gradient(to right, ${colorStops})`;
  };

  return (
    <div className="slider-container">
      <div className="playPauseButton" onClick={togglePlay}>
        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
      </div>
      <div className="speedControl">
        <div className="speedSelector">
          {speed}x
          <div className="speedOptions" ref={speedOptionsRef}>
            <div className="speedOption" onClick={() => handleSpeedChange({ target: { value: 1 } })}>1x</div>
            <div className="speedOption" onClick={() => handleSpeedChange({ target: { value: 2 } })}>2x</div>
            <div className="speedOption" onClick={() => handleSpeedChange({ target: { value: 3 } })}>3x</div>
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
        style={{ background: generateSliderBackground() }} // Set the slider background dynamically
      />
      <div className="custom-thumb" style={{ left: `${thumbPosition}px` }}>
        {highlightedYear}
      </div>
    </div>
  );
};

export default Slider;
