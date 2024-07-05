import React from 'react';

const TimeScaleSelector = ({ timeScale, onToggleTimeScale, scaleValue, onSelectScaleValue, targetYear, onSelectTargetYear }) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1894 }, (_, i) => {
    const year = (currentYear-1) - i;
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
        <label className="radioLabel" htmlFor="by_year">By Year</label>
        <div className='TimeScaleOption'>
          {timeScale === 'by_year' && (
            <select value={targetYear} onChange={(e) => onSelectTargetYear(e.target.value)} required>
              <option className='selectPrompt' value="">-Select a year-</option>
              <option key="top_analogs" value="top_analogs">Top analog from each year</option>
              {yearOptions}
            </select>
          )}
        </div>
      </div>
      <div>
        <input
          type="radio"
          id="by_season"
          value="by_season"
          checked={timeScale === 'by_season'}
          onChange={(e) => onToggleTimeScale(e.target.value)}
        />
        <label className="radioLabel" htmlFor="by_season">By Season</label>
        <div className='TimeScaleOption'>
          {timeScale === 'by_season' && (
            <>
              <select value={scaleValue} onChange={(e) => onSelectScaleValue(e.target.value)} required>
                <option className='selectPrompt' value="">-Select a season-</option>
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
              </select>
              <br /><label>For year: </label><br />
              <select value={targetYear} onChange={(e) => onSelectTargetYear(e.target.value)} required>
                <option className='selectPrompt' value="">-Select a year-</option>
                <option value="top_analogs">Top analog from each year</option>
                {yearOptions}
              </select>
            </>
          )}
        </div>
      </div>
      <div>
        <input
          type="radio"
          id="by_month"
          value="by_month"
          checked={timeScale === 'by_month'}
          onChange={(e) => onToggleTimeScale(e.target.value)}
        />
        <label className="radioLabel" htmlFor="by_month">By Month</label>
        <div className='TimeScaleOption'>
          {timeScale === 'by_month' && (
            <>
              <select value={scaleValue} onChange={(e) => onSelectScaleValue(e.target.value)} required>
                <option className='selectPrompt' value="">-Select a month-</option>
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
              <br /><label>For year: </label><br />
              <select value={targetYear} onChange={(e) => onSelectTargetYear(e.target.value)} required>
                <option className='selectPrompt' value="">-Select a year-</option>
                <option value="top_analogs">Top analog from each year</option>
                {yearOptions}
              </select>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeScaleSelector;