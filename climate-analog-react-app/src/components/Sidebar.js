import React from 'react';
import TargetCountySelector from './TargetCountySelector';
import TimeScaleSelector from './TimeScaleSelector';
import DataTypeSelector from './DataTypeSelector';
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
  onSelectTargetYear
}) => {
  return (
    <div>
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
    </div>
  );
};

export default Sidebar;
