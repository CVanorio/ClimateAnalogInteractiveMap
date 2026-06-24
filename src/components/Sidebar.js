import React, { useState } from 'react';
import TargetCountySelector from './TargetCountySelector';
import TimeScaleSelector from './TimeScaleSelector';
import YearSelector from './YearSelector';
import DataTypeSelector from './DataTypeSelector';
import { Tooltip } from 'react-tooltip';
import WSCO_Logo from '../assets/WSCO_Logo.png';
import '../styles/Sidebar.css';
const {
  TARGET_STATE_ABBR,
} = require('../utils/constants');

const Sidebar = ({
  selectedCounty,
  onSelectCounty,
  onSelectState,
  selectedState,
  selectedStateName,
  onSelectStateName,
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
  onIntroClick,
  graphMode,
  onGraphModeChange
}) => {
  const [advancedOpen, setAdvancedOpen] = useState(false);

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
      ? `${selectedCounty.replace(/\s+/g, '_')}_${TARGET_STATE_ABBR}`
      : TARGET_STATE_ABBR;

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

  // Progressive disclosure: later steps unlock as earlier ones are completed.
  const countyDone = !!selectedCounty;
  const periodDone = countyDone && (timeScale === 'by_year' || !!scaleValue);
  const yearDone = periodDone && !!targetYear;

  return (
    <div>
      <div className='sidebarContentContainter'>
        <div>
          <div className='menuSection'>
            <p><span className='step-badge'>1</span> Target County</p>
            <span className='step-subtitle'>Pick a county from the list or click it on the map</span>
            <div className='menuOption'>
              <TargetCountySelector
                selectedCounty={selectedCounty}
                onSelectCounty={onSelectCounty}
                selectedState={selectedState}
                onSelectState={onSelectState}
                selectedStateName={selectedStateName}
                onSelectStateName={onSelectStateName}
              />
            </div>
          </div>

          <div className={`menuSection ${countyDone ? '' : 'step-disabled'}`} id='TimeFrameMenuSection'>
            <p><span className='step-badge'>2</span> Time Frame</p>
            <div className='menuOption'>
              <TimeScaleSelector
                timeScale={timeScale}
                onToggleTimeScale={handleToggleTimeScale}
                scaleValue={scaleValue}
                onSelectScaleValue={onSelectScaleValue}
              />
            </div>
          </div>

          <div className={`menuSection ${periodDone ? '' : 'step-disabled'}`} id='YearMenuSection'>
            <p><span className='step-badge'>3</span> Year</p>
            <div className='menuOption'>
              <YearSelector
                timeScale={timeScale}
                scaleValue={scaleValue}
                targetYear={targetYear}
                onSelectTargetYear={onSelectTargetYear}
              />
            </div>
          </div>

          <div className={`menuSection ${yearDone ? '' : 'step-disabled'}`} id='climateVariablesMenuSection'>
            <p><span className='step-badge'>4</span> Climate Variables</p>
            <div className='menuOption'>
              <DataTypeSelector
                selectedDataType={selectedDataType}
                onDataTypeChange={onDataTypeChange}
              />
            </div>
          </div>

          {/* --- Advanced Settings (collapsible) --- */}
          {targetYear === 'top_analogs' && (
            <div className='menuSection advanced-section'>
              <button
                type='button'
                className='advanced-header'
                onClick={() => setAdvancedOpen(o => !o)}
                aria-expanded={advancedOpen}
              >
                <span>Advanced Settings</span>
                <i className={`fa-solid fa-chevron-${advancedOpen ? 'up' : 'down'}`}></i>
              </button>
              {advancedOpen && (
                <div className='advanced-body'>
                  <label
                    className={`addon-checkbox ${!mapData ? 'disabled' : ''}`}
                    data-tip={!mapData ? 'Graph is available after data is displayed on the map' : ''}
                  >
                    <input type='checkbox' checked={showChart} onChange={toggleChart} disabled={!mapData} />
                    <span>Show time series graph</span>
                  </label>
                  {showChart && (
                    <div className='mode-toggle graph-mode-toggle'>
                      <button
                        type='button'
                        className={`mode-toggle-button ${graphMode === 'raw' ? 'active' : ''}`}
                        onClick={() => onGraphModeChange('raw')}
                      >
                        Raw Data
                      </button>
                      <button
                        type='button'
                        className={`mode-toggle-button ${graphMode === 'anomalies' ? 'active' : ''}`}
                        onClick={() => onGraphModeChange('anomalies')}
                      >
                        Anomalies
                      </button>
                    </div>
                  )}
                  <Tooltip place='top' type='dark' effect='solid' />
                </div>
              )}
            </div>
          )}

          {/* --- Data Export section --- */}
          <div className='menuSection'>
            <p>Download Data</p>
            <div
              className='menuOption'
              style={{ display: 'flex', gap: 32, marginLeft: '10%' }} // shift start by ~1/3
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  downloadJSON(buildDataFilename('json'));
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  textDecoration: 'none',
                  color: '#002fa3',
                  cursor: 'pointer',
                  opacity: (!Array.isArray(mapData) || mapData.length === 0) ? 0.5 : 1,
                  pointerEvents: (!Array.isArray(mapData) || mapData.length === 0) ? 'none' : 'auto',
                  paddingBottom: '10px'
                }}
                title="Download current map data as JSON"
              >
                <i className="fa-solid fa-file-arrow-down" style={{ fontSize: '1.5rem', color: '#002fa3' }}></i>
                <span style={{ fontSize: '1rem' }}>JSON</span>
              </a>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  downloadCSV(buildDataFilename('csv'));
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  textDecoration: 'none',
                  color: '#002fa3',
                  cursor: 'pointer',
                  opacity: (!Array.isArray(mapData) || mapData.length === 0) ? 0.5 : 1,
                  pointerEvents: (!Array.isArray(mapData) || mapData.length === 0) ? 'none' : 'auto',
                  paddingBottom: '10px'
                }}
                title="Download current map data as CSV"
              >
                <i className="fa-solid fa-file-arrow-down" style={{ fontSize: '1.5rem', color: '#002fa3' }}></i>
                <span style={{ fontSize: '1rem' }}>CSV</span>
              </a>
            </div>
          </div>
          {/* --------------------------- */}


          {/* --- About section --- */}
          <div className='menuSection'>
            <p>About</p>
            <div
              className='menuOption'
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',   // center buttons horizontally
                gap: '6px'
              }}
            >
              <button
                className={`methodology-toggle ${showMethodology ? 'active' : ''}`}
                onClick={toggleMethodology}
                style={{ width: '80%', margin: 5 }}
              >
                <span className="methodology-label">View Methodology</span>
              </button>

              <button
                className="intro-toggle"
                onClick={onIntroClick}
                style={{ width: '80%', margin: 5 }}
              >
                <span className="intro-label">View Tutorial</span>
              </button>
            </div>

            <div className='menuOption'>
              <p style={{ fontSize: '0.9rem', marginTop: '20px', marginBottom: '50px' }}>
                <a
                  className='surveyLink'
                  href="https://forms.gle/4fmWqfaXX9tvDdBu6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click here to submit your feedback
                </a>
              </p>
            </div>
          </div>
          {/* --------------------------- */}




        </div>

      </div>
      {menuVisible && (
        <div>
          <div className="logoContainer">
            <img src={WSCO_Logo} alt="WSCO Logo" className="responsive-image" />
            <p style={{ fontSize: '0.8rem', marginTop: '-15px', opacity: 0.7, backgroundColor: 'transparent', textAlign: 'center', marginBottom: '2px' }}>
              Created by{' '}
              <a
                href="https://courtneyvanor.io"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'underline' }}
              >
                Courtney Vanorio
              </a>
            </p>

          </div>
          <div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
