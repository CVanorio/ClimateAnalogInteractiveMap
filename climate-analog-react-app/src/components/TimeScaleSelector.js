import React from 'react';

const TimeScaleSelector = ({
  timeScale,
  onToggleTimeScale,
  scaleValue,
  onSelectScaleValue,
  targetYear,
  onSelectTargetYear,
}) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1894 }, (_, i) => {
    const year = currentYear - 1 - i;
    return (
      <option key={year} value={year}>
        {year}
      </option>
    );
  });

  return (
    <div className="time-scale-selector">
      <div className="time-scale-button-group">
        <input
          type="button"
          id="by_year_button"
          className={`time-scale-button ${timeScale === 'by_year' ? 'active' : ''}`}
          value="By Year"
          onClick={() => onToggleTimeScale('by_year')}
        />
        <input
          type="button"
          id="by_season_button"
          className={`time-scale-button ${timeScale === 'by_season' ? 'active' : ''}`}
          value="By Season"
          onClick={() => onToggleTimeScale('by_season')}
        />
        <input
          type="button"
          id="by_month_button"
          className={`time-scale-button ${timeScale === 'by_month' ? 'active' : ''}`}
          value="By Month"
          onClick={() => onToggleTimeScale('by_month')}
        />
      </div>
      <div className="time-scale-options">
        {timeScale === 'by_year' && (
          <select value={targetYear} onChange={(e) => onSelectTargetYear(e.target.value)} required>
            <option className="selectPrompt" value="">
              -Select a year-
            </option>
            <option key="top_analogs" value="top_analogs">
              Top analog from each year
            </option>
            {yearOptions}
          </select>
        )}
        {timeScale === 'by_season' && (
          <>
            <select value={scaleValue} onChange={(e) => onSelectScaleValue(e.target.value)} required>
              <option className="selectPrompt" value="">
                -Select a season-
              </option>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
            </select>
            <br />
            <label>For:</label>
            <select value={targetYear} onChange={(e) => onSelectTargetYear(e.target.value)} required>
              <option className="selectPrompt" value="">
                -Select a year-
              </option>
              <option value="top_analogs">Top analog from each year</option>
              {yearOptions}
            </select>
          </>
        )}
        {timeScale === 'by_month' && (
          <>
            <select value={scaleValue} onChange={(e) => onSelectScaleValue(e.target.value)} required>
              <option className="selectPrompt" value="">
                -Select a month-
              </option>
              {Array.from({ length: 12 }, (_, i) => {
                const monthNumber = i + 1;
                const monthName = new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' });
                return (
                  <option key={monthNumber} value={monthNumber}>
                    {monthNumber} - {monthName}
                  </option>
                );
              })}
            </select>
            <br />
            <label>For:</label>
            <select value={targetYear} onChange={(e) => onSelectTargetYear(e.target.value)} required>
              <option className="selectPrompt" value="">
                -Select a year-
              </option>
              <option value="top_analogs">Top analog from each year</option>
              {yearOptions}
            </select>
          </>
        )}
      </div>
    </div>
  );
};

export default TimeScaleSelector;
