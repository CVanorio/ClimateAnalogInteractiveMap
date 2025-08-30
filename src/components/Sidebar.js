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

  // ----- Filename builder (concise, underscore-separated) -----
  const buildDataFilename = (ext = 'json') => {
    const base = targetYear === 'top_analogs' ? 'top_analogs' : 'analogs';

    const typeToken =
      selectedDataType === 'both' ? 'temp_precip'
      : selectedDataType === 'temperature' ? 'temp'
      : selectedDataType === 'precipitation' ? 'precip'
      : 'all';

    const countyToken = selectedCounty
      ? `${selectedCounty.replace(/\s+/g, '_')}_WI`
      : 'WI';

    const safe = (v) => String(v ?? '').trim().replace(/\s+/g, '_');

    let tf = '';
    if (targetYear === 'top_analogs') {
      const endYear = new Date().getFullYear() - 1;
      if (timeScale === 'by_season' && scaleValue) {
        tf = `season_${safe(scaleValue)}_1895-${endYear}`;
      } else if (timeScale === 'by_month' && scaleValue) {
        tf = `month_${safe(scaleValue)}_1895-${endYear}`;
      } else {
        tf = `years_1895-${endYear}`;
      }
    } else {
      if (timeScale === 'by_season' && scaleValue) {
        tf = `season_${safe(scaleValue)}_${safe(targetYear)}`;
      } else if (timeScale === 'by_month' && scaleValue) {
        tf = `month_${safe(scaleValue)}_${safe(targetYear)}`;
      } else {
        tf = `year_${safe(targetYear)}`;
      }
    }

    const name = [base, typeToken, countyToken, tf]
      .filter(Boolean)
      .join('_')
      .replace(/[^\w\-]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');

    return `${name}.${ext}`;
  };
  // ------------------------------------------------------------

  // ----- SIMPLE DOWNLOAD HELPERS (no reordering, no type changes) -----
  const downloadJSON = (filename = 'mapData.json') => {
    if (!Array.isArray(mapData) || mapData.length === 0) return;
    const blob = new Blob([JSON.stringify(mapData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (filename = 'mapData.csv') => {
    if (!Array.isArray(mapData) || mapData.length === 0) return;
    const keys = Object.keys(mapData[0]); // use first row's key order

    const esc = (v) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      return `"${s.replace(/"/g, '""')}"`; // quote everything
    };

    const header = keys.map(esc).join(',');
    const rows = mapData.map(row => keys.map(k => esc(row[k])).join(',')).join('\n');
    const csv = `${header}\n${rows}`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  // --------------------------------------------------------------------

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
                  <span className="toggle-label">{showChart ? 'Hide Graph' : 'Show Graph'}</span>
                </button>

                <Tooltip place="top" type="dark" effect="solid" />
              </div>
            )}
          </div>

          {/* --- Data Export section --- */}
          <div className='menuSection'>
            <p>Data</p>
            <div className='menuOption' style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => downloadJSON(buildDataFilename('json'))}
                disabled={!Array.isArray(mapData) || mapData.length === 0}
                title="Download current data as JSON"
              >
                Download JSON
              </button>
              <button
                onClick={() => downloadCSV(buildDataFilename('csv'))}
                disabled={!Array.isArray(mapData) || mapData.length === 0}
                title="Download current data as CSV"
              >
                Download CSV
              </button>
            </div>
          </div>
          {/* --------------------------- */}

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
