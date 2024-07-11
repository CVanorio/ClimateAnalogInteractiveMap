import React, { useRef, useEffect, useState } from 'react';
import '../../styles/Slider.css';

const Slider = ({ years, highlightedYear, onChange, isPlaying, togglePlayPause, selectedDataType, yearColors }) => {
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);
  const [thumbPosition, setThumbPosition] = useState(0);

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
      intervalRef.current = setInterval(() => {
        const currentIndex = years.findIndex((year) => year === highlightedYear);
        const nextIndex = (currentIndex + 1) % years.length;
        onChange(years[nextIndex]);
        updateThumbPosition(sliderRef.current);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isPlaying, highlightedYear, onChange, years]);

  const togglePlay = () => {
    togglePlayPause();
  };

  return (
    <div className="slider-container">
      <div className="playPauseButton" onClick={togglePlay}>
        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
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
      />
      <div className="custom-thumb" style={{ left: `${thumbPosition}px` }}>
        {highlightedYear}
      </div>
    </div>
  );
};

export default Slider;
