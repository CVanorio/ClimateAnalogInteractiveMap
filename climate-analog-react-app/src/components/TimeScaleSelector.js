import React from 'react';

const TimeScaleSelector = ({ timeScale, onToggleTimeScale, scaleValue, onSelectScaleValue, targetYear, onSelectTargetYear }) => {
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
          onChange={(e) => onToggleTimeScale(e.target.value)}
        />
        <label htmlFor="by_year">By Year</label>
        {timeScale === 'by_year' && (
          <select value={targetYear} onChange={(e) => onSelectTargetYear(e.target.value)}>
            <option value="">Select a year</option>
            {yearOptions}
            <option key="top_analogs" value="top_analogs">Top analogs from each year</option>
          </select>
        )}
      </div>
      <div>
        <input
          type="radio"
          id="by_season"
          value="by_season"
          checked={timeScale === 'by_season'}
          onChange={(e) => onToggleTimeScale(e.target.value)}
        />
        <label htmlFor="by_season">By Season</label>
        {timeScale === 'by_season' && (
          <>
            <select value={scaleValue} onChange={(e) => onSelectScaleValue(e.target.value)}>
              <option value="">Select a season</option>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
            </select>
            <select value={targetYear} onChange={(e) => onSelectTargetYear(e.target.value)}>
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
          onChange={(e) => onToggleTimeScale(e.target.value)}
        />
        <label htmlFor="by_month">By Month</label>
        {timeScale === 'by_month' && (
          <>
            <select value={scaleValue} onChange={(e) => onSelectScaleValue(e.target.value)}>
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
            <select value={targetYear} onChange={(e) => onSelectTargetYear(e.target.value)}>
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