import React, { useRef, useEffect, useState } from 'react';
import '../../styles/Slider.css';

const Slider = ({ years, highlightedYear, onChange, isPlaying, togglePlayPause }) => {
  const intervalRef = useRef(null);

  const handleSliderChange = (event) => {
    const year = parseInt(event.target.value);
    onChange(year);
  };

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
      />
      <div className="ticks">
        {years.map((year) => (
          <div
            key={year}
            className={`tick ${highlightedYear === year ? 'highlighted' : ''}`}
            style={{ left: `${((year - years[0]) / (years[years.length - 1] - years[0])) * 100}%` }}
          >
            {highlightedYear === year && (
              <span className="tick-label">{year}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
