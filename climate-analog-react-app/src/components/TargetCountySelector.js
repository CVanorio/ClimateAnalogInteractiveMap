// src/components/TargetCountySelector.js
import React, { useState } from 'react';

const counties = [
  "Adams", "Ashland", "Barron", "Bayfield", "Brown", "Buffalo", "Burnett",
  "Calumet", "Chippewa", "Clark", "Columbia", "Crawford", "Dane", "Dodge",
  "Door", "Douglas", "Dunn", "Eau Claire", "Florence", "Fond du Lac",
  "Forest", "Grant", "Green", "Green Lake", "Iowa", "Iron", "Jackson",
  "Jefferson", "Juneau", "Kenosha", "Kewaunee", "La Crosse", "Lafayette",
  "Langlade", "Lincoln", "Manitowoc", "Marathon", "Marinette", "Marquette",
  "Menominee", "Milwaukee", "Monroe", "Oconto", "Oneida", "Outagamie",
  "Ozaukee", "Pepin", "Pierce", "Polk", "Portage", "Price", "Racine",
  "Richland", "Rock", "Rusk", "Sauk", "Sawyer", "Shawano", "Sheboygan",
  "St. Croix", "Taylor", "Trempealeau", "Vernon", "Vilas", "Walworth",
  "Washburn", "Washington", "Waukesha", "Waupaca", "Waushara", "Winnebago",
  "Wood"
];

const TargetCountySelector = ({ onSelectCounty, onToggleTimeScale, onSelectScaleValue, setFetchTemperature, setFetchPrecipitation }) => {
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

  const handleTargetYearChange = (e) => {
    const selectedYear = e.target.value;
    setTargetYear(selectedYear);
    onSelectScaleValue(selectedYear);
  };

  const handleTemperatureChange = (e) => {
    const checked = e.target.checked;
    setFetchTemperature(checked);

    // Ensure at least one of temperature or precipitation is checked
    if (!checked && !setFetchPrecipitation) {
      setFetchPrecipitation(true); // Set precipitation to true if temperature is unchecked
    }
  };

  const handlePrecipitationChange = (e) => {
    const checked = e.target.checked;
    setFetchPrecipitation(checked);

    // Ensure at least one of temperature or precipitation is checked
    if (!checked && !setFetchTemperature) {
      setFetchTemperature(true); // Set temperature to true if precipitation is unchecked
    }
  };

  return (
    <div>
      <select onChange={(e) => onSelectCounty(e.target.value)}>
        <option value="">Select a county</option>
        {counties.map((county) => (
          <option key={county} value={county}>
            {county}
          </option>
        ))}
      </select>
      <div>
        <input
          type="radio"
          id="by_year"
          value="by_year"
          checked={timeScale === 'by_year'}
          onChange={handleTimeScaleChange}
        />
        <label htmlFor="by_year">By Year</label>
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
          <select onChange={handleSeasonChange}>
            <option value="">Select a season</option>
            <option value="Winter">Winter</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
          </select>
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
          <select onChange={handleMonthChange}>
            <option value="">Select a month</option>
            {/* Assuming month options are dynamically generated */}
            {Array.from({ length: 12 }, (_, i) => {
              const monthNumber = i + 1;
              return (
                <option key={monthNumber} value={monthNumber}>
                  {monthNumber}
                </option>
              );
            })}
          </select>
        )}
      </div>
      <div>
        <select onChange={handleTargetYearChange}>
          <option value="">Select target county year</option>
          {/* Generate years from 1895 to current year */}
          {Array.from({ length: new Date().getFullYear() - 1894 }, (_, i) => {
            const year = 1895 + i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
          <option value="top_analogs">Top analogs from each year</option>
        </select>
      </div>   
    </div>
  );
};

export default TargetCountySelector;
