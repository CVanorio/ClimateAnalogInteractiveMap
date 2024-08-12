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
  const currentMonth = new Date().getMonth() + 1; // Months are 0-based (Jan is 0, Dec is 11)

  // Generate years in "YYYY-YYYY" format for Winter, including the current year if the season has ended
  const getYearOptionsForWinter = () => {
    const years = [];
    if (currentMonth > 2) { // Winter season ends in February
      for (let i = currentYear; i >= 1895; i--) {
        if (i === 1895) continue; // Skip 1894-1895
        const displayYear = `${i - 1}-${i}`;
        years.push(
          <option key={i} value={i}>
            {displayYear}
          </option>
        );
      }
    }
    // Otherwise, do not include the current year
    else {
      for (let i = currentYear - 1; i >= 1895; i--) {
        const displayYear = `${i - 1}-${i}`;
        years.push(
          <option key={i} value={i}>
            {displayYear}
          </option>
        );
      }
    }
    return years;
  };

  // Generate years from 1895 to current year
  const getYearOptionsFrom1895 = () => {
    return Array.from({ length: currentYear - 1894 }, (_, i) => {
      const year = currentYear - i;
      return (
        <option key={year} value={year}>
          {year}
        </option>
      );
    });
  };

  // Generate years from 1895 to current year - 1
  const getYearOptionsFrom1895ToCurrentYearMinusOne = () => {
    return Array.from({ length: currentYear - 1895 }, (_, i) => {
      const year = currentYear - 1 - i;
      return (
        <option key={year} value={year}>
          {year}
        </option>
      );
    });
  };

  // Determine if the current season has ended
  const hasSeasonEnded = () => {
    switch (scaleValue) {
      case 'Winter':
        return currentMonth > 2; // Winter ends in February
      case 'Spring':
        return currentMonth > 5; // Spring ends in May
      case 'Summer':
        return currentMonth > 8; // Summer ends in August
      case 'Fall':
        return currentMonth > 11; // Fall ends in November
      default:
        return false;
    }
  };

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
          <select id='yearSelect' value={targetYear} onChange={(e) => onSelectTargetYear(e.target.value)} required>
            <option className="selectPrompt" value="">
              -Select a year-
            </option>
            <option key="top_analogs" value="top_analogs">
              Top analog from each year
            </option>
            {getYearOptionsFrom1895ToCurrentYearMinusOne()}
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
              {scaleValue === 'Winter' ? getYearOptionsForWinter() : (hasSeasonEnded() ? getYearOptionsFrom1895() : getYearOptionsFrom1895ToCurrentYearMinusOne())}
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
                const formattedMonthNumber = monthNumber.toString().padStart(2, '0');
                const monthName = new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' });
                return (
                  <option key={formattedMonthNumber} value={formattedMonthNumber}>
                    {monthName} ({formattedMonthNumber})
                  </option>
                );
              })}
            </select>
            <br />
            <label>For: </label>
            <select value={targetYear} onChange={(e) => onSelectTargetYear(e.target.value)} required>
              <option className="selectPrompt" value="">
                -Select a year-
              </option>
              <option value="top_analogs">Top analog from each year</option>
              {getYearOptionsFrom1895()}
            </select>
          </>
        )}
      </div>
    </div>
  );
};

export default TimeScaleSelector;
