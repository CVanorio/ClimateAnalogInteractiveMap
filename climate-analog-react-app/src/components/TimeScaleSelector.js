// src/components/TimeScaleSelector.js
import React, { useState } from 'react';

const TimeScaleSelector = ({ onToggleTimeScale, onSelectScaleValue }) => {
  const [timeScale, setTimeScale] = useState('by_year');
  const [season, setSeason] = useState('');
  const [month, setMonth] = useState('');
  const [targetYear, setTargetYear] = useState('');

  const handleTimeScaleChange = (e) => {
    const scale = e.target.value;
    setTimeScale(scale);
    onToggleTimeScale(scale);
  };

  const handleSeasonChange = (e) => {
    const selectedSeason = e.target.value;
    setSeason(selectedSeason);
    onSelectScaleValue(selectedSeason);
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setMonth(selectedMonth);
    onSelectScaleValue(selectedMonth);
  };

  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setTargetYear(selectedYear);
    onSelectScaleValue(selectedYear);
  };

  const yearOptions = Array.from({ length: new Date().getFullYear() - 1894 }, (_, i) => {
    const year = 1895 + i;
    return (
      <option key={year} value={year}>
        {year}
      </option>
    );
  });

  return (
    <div>
      <div>
        <input
          type="radio"
          id="by_year"
          value="by_year"
          checked={timeScale === 'by_year'}
          onChange={handleTimeScaleChange}
        />
        <label htmlFor="by_year">By Year</label>
        {timeScale === 'by_year' && (
          <select onChange={handleYearChange}>
            <option value="">Select a year</option>
            {yearOptions}
            <option value="top_analogs">Top analogs from each year</option>
          </select>
        )}
      </div>
      <div>
        <input
          type="radio"
          id="by_season"
          value="by_season"
          checked={timeScale === 'by_season'}
          onChange={handleTimeScaleChange}
        />
        <label htmlFor="by_season">By Season</label>
        {timeScale === 'by_season' && (
          <>
            <select onChange={handleSeasonChange}>
              <option value="">Select a season</option>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
            </select>
            <select onChange={handleYearChange}>
              <option value="">Select a year</option>
              {yearOptions}
              <option value="top_analogs">Top analogs from each year</option>
            </select>
          </>
        )}
      </div>
      <div>
        <input
          type="radio"
          id="by_month"
          value="by_month"
          checked={timeScale === 'by_month'}
          onChange={handleTimeScaleChange}
        />
        <label htmlFor="by_month">By Month</label>
        {timeScale === 'by_month' && (
          <>
            <select onChange={handleMonthChange}>
              <option value="">Select a month</option>
              {Array.from({ length: 12 }, (_, i) => {
                const monthNumber = i + 1;
                return (
                  <option key={monthNumber} value={monthNumber}>
                    {monthNumber}
                  </option>
                );
              })}
            </select>
            <select onChange={handleYearChange}>
              <option value="">Select a year</option>
              {yearOptions}
              <option value="top_analogs">Top analogs from each year</option>
            </select>
          </>
        )}
      </div>
    </div>
  );
};

export default TimeScaleSelector;
