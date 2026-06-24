import React from 'react';
import YearPicker from './YearPicker';

// Step: choose Single Year vs All Years (time series), and pick the year.
const YearSelector = ({ timeScale, scaleValue, targetYear, onSelectTargetYear }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Months are 0-based

  // --- Year option builders (return [{ value, label }], newest first) ---

  // Winter years in "YYYY-YYYY" format, including the current year if the season has ended.
  const getWinterYearOptions = () => {
    const options = [];
    if (currentMonth > 2) { // Winter season ends in February
      for (let i = currentYear; i >= 1895; i--) {
        if (i === 1895) continue; // Skip 1894-1895
        options.push({ value: i, label: `${i - 1}-${i}` });
      }
    } else {
      for (let i = currentYear - 1; i >= 1895; i--) {
        options.push({ value: i, label: `${i - 1}-${i}` });
      }
    }
    return options;
  };

  const getYearOptionsFrom1895 = () =>
    Array.from({ length: currentYear - 1894 }, (_, i) => {
      const year = currentYear - i;
      return { value: year, label: String(year) };
    });

  const getYearOptionsFrom1895ToCurrentYearMinusOne = () =>
    Array.from({ length: currentYear - 1895 }, (_, i) => {
      const year = currentYear - 1 - i;
      return { value: year, label: String(year) };
    });

  const hasSeasonEnded = () => {
    switch (scaleValue) {
      case 'Winter': return currentMonth > 2;
      case 'Spring': return currentMonth > 5;
      case 'Summer': return currentMonth > 8;
      case 'Fall': return currentMonth > 11;
      default: return false;
    }
  };

  // Year option list appropriate for the current scale / sub-selection.
  const getYearOptions = () => {
    if (timeScale === 'by_year') {
      return getYearOptionsFrom1895ToCurrentYearMinusOne();
    }
    if (timeScale === 'by_season') {
      if (scaleValue === 'Winter') return getWinterYearOptions();
      return hasSeasonEnded() ? getYearOptionsFrom1895() : getYearOptionsFrom1895ToCurrentYearMinusOne();
    }
    if (timeScale === 'by_month') {
      return parseInt(scaleValue, 10) <= currentMonth - 1
        ? getYearOptionsFrom1895()
        : getYearOptionsFrom1895ToCurrentYearMinusOne();
    }
    return [];
  };

  const options = getYearOptions();

  // Single vs all-years (time series) mode is derived from targetYear.
  const mode = targetYear === 'top_analogs' ? 'all' : 'single';
  const selectAllYears = () => onSelectTargetYear('top_analogs');
  const selectSingleYear = () => {
    if (targetYear === 'top_analogs') onSelectTargetYear(''); // prompt the user to pick a year
  };

  // --- +/- year steppers (clamped to the available range) ---
  const values = options.map(o => Number(o.value));
  const minYear = values.length ? Math.min(...values) : null;
  const maxYear = values.length ? Math.max(...values) : null;
  const currentNum = Number(targetYear);
  const hasValidYear = mode === 'single' && Number.isFinite(currentNum) && targetYear !== '';

  const stepYear = (delta) => {
    if (!hasValidYear) return;
    const next = currentNum + delta;
    if (next >= minYear && next <= maxYear) onSelectTargetYear(String(next));
  };

  return (
    <div className="period-selection">
      <div className="mode-toggle">
        <button
          type="button"
          className={`mode-toggle-button ${mode === 'single' ? 'active' : ''}`}
          onClick={selectSingleYear}
        >
          Single Year
        </button>
        <button
          type="button"
          className={`mode-toggle-button ${mode === 'all' ? 'active' : ''}`}
          onClick={selectAllYears}
        >
          All Years<br />(time series)
        </button>
      </div>

      {mode === 'single' && (
        <div className="year-stepper">
          <button
            type="button"
            className="year-step-btn"
            onClick={() => stepYear(-1)}
            disabled={!hasValidYear || currentNum <= minYear}
            title="Previous year"
          >
            &minus;
          </button>
          <YearPicker
            value={targetYear}
            options={options}
            onSelect={onSelectTargetYear}
            placeholder="Type or select a year"
          />
          <button
            type="button"
            className="year-step-btn"
            onClick={() => stepYear(1)}
            disabled={!hasValidYear || currentNum >= maxYear}
            title="Next year"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default YearSelector;
