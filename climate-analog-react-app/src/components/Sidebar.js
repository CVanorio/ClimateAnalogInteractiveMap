import React, { useState } from 'react';
import TargetCountySelector from './TargetCountySelector';
import TimeScaleSelector from './TimeScaleSelector';
import DataTypeSelector from './DataTypeSelector';
import { Tooltip } from 'react-tooltip';
import '../styles/Sidebar.css';

const NewComponent = () => {
  return <div>Methodology Content</div>;
};

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
  error
}) => {
  const [activeButton, setActiveButton] = useState('mapOptions');

  return (
    <div>
      <div className='buttonGroup'>
        <button
          className={`button ${activeButton === 'mapOptions' ? 'active' : ''}`}
          onClick={() => setActiveButton('mapOptions')}
          title="Map Options"
        >
          <i className="fa-solid fa-map-location-dot"></i>
        </button>
        <button
          className={`button ${activeButton === 'methodology' ? 'active' : ''}`}
          onClick={() => setActiveButton('methodology')}
          title="Methodology"
        >
          <i className="fa-solid fa-circle-info"></i>
        </button>
      </div>

      {activeButton === 'mapOptions' ? (
        <>
          <div className='menuSection'>
            <p>Target County</p>
            <div className='menuOption'>
              <TargetCountySelector
                selectedCounty={selectedCounty}
                onSelectCounty={onSelectCounty}
              />
            </div>
          </div>
          <div className='menuSection'>
            <p>Timeframe</p>
            <div className='menuOption'>
              <TimeScaleSelector
                timeScale={timeScale}
                onToggleTimeScale={onToggleTimeScale}
                scaleValue={scaleValue}
                onSelectScaleValue={onSelectScaleValue}
                targetYear={targetYear}
                onSelectTargetYear={onSelectTargetYear}
              />
            </div>
          </div>
          <div className='menuSection'>
            <p>Climate Variables</p>
            <div className='menuOption'>
              <DataTypeSelector
                selectedDataType={selectedDataType}
                onDataTypeChange={onDataTypeChange}
              />
            </div>
          </div>
          <div className='menuSection'>
            <button
              className={`chart-toggle ${showChart ? 'active' : ''}`}
              onClick={toggleChart}
              disabled={!mapData} // Disable button if mapData is null
              data-tip={!mapData ? "Chart is available after data is displayed on the map" : ""}
            >
              <span className="toggle-knob"></span>
              <span className="toggle-label">{showChart ? 'Hide Chart' : 'Show Chart'}</span>
            </button>

            <Tooltip place="top" type="dark" effect="solid" />
          </div>
          {error && <div className="error-message"><i className={`fas fa-triangle-exclamation`}></i>{error}</div>}
        </>
      ) : (
        <NewComponent />
      )}
    </div>
  );
};

export default Sidebar;
