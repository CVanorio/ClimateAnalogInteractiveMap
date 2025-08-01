import React, { useState, useEffect } from 'react';
import TargetCountySelector from './TargetCountySelector';
import TimeScaleSelector from './TimeScaleSelector';
import DataTypeSelector from './DataTypeSelector';
import { Tooltip } from 'react-tooltip';
import WSCO_Logo from '../assets/WSCO_Logo.png';
import '../styles/Sidebar.css';

const Sidebar = ({
  selectedCounty,
  onSelectCounty,
  timeScale,
  onToggleTimeScale,
  scaleValue,
  onSelectScaleValue,
  selectedDataType,
  onDataTypeChange,
  targetYear,
  onSelectTargetYear,
  showChart,
  toggleChart,
  mapData,
  menuVisible,
  showMethodology,
  toggleMethodology,
  onIntroClick
}) => {
  const [countyError, setCountyError] = useState('');
  const [timeFrameError, setTimeFrameError] = useState('');

  useEffect(() => {
    if (!selectedCounty) {
      setCountyError('Please select a county.');
    } else {
      setCountyError('');
    }

    if (timeScale === 'by_year' && !targetYear) {
      setTimeFrameError('Please select a year.');
    } else if ((timeScale === 'by_season') && (!targetYear || !scaleValue)) {
      setTimeFrameError('Please select a season and year.');
    } else if ((timeScale === 'by_month') && (!targetYear || !scaleValue)) {
      setTimeFrameError('Please select a month and year.');
    } else {
      setTimeFrameError('');
    }
  }, [selectedCounty, timeScale, scaleValue, targetYear, selectedDataType]);

  const handleToggleTimeScale = (newTimeScale) => {
    onToggleTimeScale(newTimeScale);
    onSelectScaleValue(''); // Reset scaleValue when time scale changes
  };

  return (
    <div>
      <div className='sidebarContentContainter'>
        <div>
          <div className='menuSection'>
            <p>Target County</p>
            <div className='menuOption'>
              <TargetCountySelector
                selectedCounty={selectedCounty}
                onSelectCounty={onSelectCounty}
              />
              {countyError && <div className="error-message"><i className={`fas fa-triangle-exclamation`}></i>{countyError}</div>}
            </div>
          </div>
          <div className='menuSection' id='TimeFrameMenuSection'>
            <p>Time Frame</p>
            <div className='menuOption'>
              <TimeScaleSelector
                timeScale={timeScale}
                onToggleTimeScale={handleToggleTimeScale}
                scaleValue={scaleValue}
                onSelectScaleValue={onSelectScaleValue}
                targetYear={targetYear}
                onSelectTargetYear={onSelectTargetYear}
              />
              {timeFrameError && <div className="error-message"><i className={`fas fa-triangle-exclamation`}></i>{timeFrameError}</div>}
            </div>
          </div>
          <div className='menuSection' id='climateVariablesMenuSection'>
            <p>Climate Variables</p>
            <div className='menuOption'>
              <DataTypeSelector
                selectedDataType={selectedDataType}
                onDataTypeChange={onDataTypeChange}
              />
            </div>
            {targetYear === 'top_analogs' && (
              <div>
                <button
                  className={`chart-toggle ${showChart ? 'active' : ''}`}
                  onClick={toggleChart}
                  disabled={!mapData || targetYear !== "top_analogs"}
                  data-tip={!mapData ? "Chart is available after data is displayed on the map" : (targetYear !== "top_analogs" ? "Chart is only available for top analogs by year" : "")}
                >
                  <span className="toggle-knob"></span>
                  <span className="toggle-label">{showChart ? 'Hide Chart' : 'Show Chart'}</span>
                </button>

                <Tooltip place="top" type="dark" effect="solid" />
              </div>
            )}
          </div>

          <div>
            <button
              className={`methodology-toggle ${showMethodology ? 'active' : ''}`}
              onClick={toggleMethodology}
            >
              <span className="methodology-label">{'View Methodology'}</span>
            </button>
            <button
              className="intro-toggle"
              onClick={onIntroClick}
            >
              <span className="intro-label">{'View Tutorial'}</span>
            </button>
            <p>
              <a
                className='surveyLink'
                href="https://forms.gle/4fmWqfaXX9tvDdBu6"
                target="_blank"
                rel="noopener noreferrer"
              >
                Click here to tell us what you think!
              </a>
            </p>
          </div>
        </div>
      </div>
      {menuVisible && (
        <div className="logoContainer">
          <img src={WSCO_Logo} alt="WSCO Logo" className="responsive-image" />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
