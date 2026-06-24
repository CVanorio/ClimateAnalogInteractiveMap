import React from 'react';

const TimeScaleSelector = ({
  timeScale,
  onToggleTimeScale,
  scaleValue,
  onSelectScaleValue,
}) => {
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

      {/* Season / Month period sub-selection */}
      {(timeScale === 'by_season' || timeScale === 'by_month') && (
        <div className="time-scale-options">
          {timeScale === 'by_season' && (
            <select
              className="sidebar-select"
              value={scaleValue}
              onChange={(e) => onSelectScaleValue(e.target.value)}
              required
            >
              <option className="selectPrompt" value="">-Select a season-</option>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
            </select>
          )}
          {timeScale === 'by_month' && (
            <select
              className="sidebar-select"
              value={scaleValue}
              onChange={(e) => onSelectScaleValue(e.target.value)}
              required
            >
              <option className="selectPrompt" value="">-Select a month-</option>
              {Array.from({ length: 12 }, (_, i) => {
                const monthNumber = i + 1;
                const formattedMonthNumber = monthNumber.toString().padStart(2, '0');
                const monthName = new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' });
                return (
                  <option key={formattedMonthNumber} value={formattedMonthNumber}>
                    {monthName} ({formattedMonthNumber})
                  </option>
                );
              })}
            </select>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeScaleSelector;
