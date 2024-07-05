import React from 'react';
import '../../styles/Slider.css';

const Slider = ({ years, highlightedYear, onChange }) => {
  const handleSliderChange = (event) => {
    const year = parseInt(event.target.value);
    onChange(year);
  };

  return (
    <div className="slider-container">
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
