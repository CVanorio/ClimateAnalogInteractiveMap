import React, { useRef, useEffect, useState } from 'react';
import '../../styles/Slider.css';

const Slider = ({ years, highlightedYear, onChange, isPlaying, togglePlayPause }) => {
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);
  const [thumbPosition, setThumbPosition] = useState(0);

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
    const thumbWidth = 20; // Same width as the thumb
    const offset = (percent / 100) * (slider.clientWidth - thumbWidth);

    setThumbPosition(offset);
  };

  useEffect(() => {
    if (sliderRef.current) {
      updateThumbPosition(sliderRef.current);
    }
  }, [highlightedYear, sliderRef.current]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const currentIndex = years.findIndex(year => year === highlightedYear);
        const nextIndex = (currentIndex + 1) % years.length;
        onChange(years[nextIndex]);
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
        value={highlightedYear || ''}
        onChange={handleSliderChange}
        className="slider"
        ref={sliderRef}
      />
      {highlightedYear && (
        <div className="slider-label" style={{ left: `${thumbPosition}px` }}>
          {highlightedYear}
        </div>
      )}
    </div>
  );
};

export default Slider;
