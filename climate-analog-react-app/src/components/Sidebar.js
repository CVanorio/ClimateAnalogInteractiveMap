// src/components/Sidebar.js
import React from 'react';
import TargetCountySelector from './TargetCountySelector';
import TimeScaleSelector from './TimeScaleSelector';
import DataTypeSelector from './DataTypeSelector';

const Sidebar = ({
  onSelectCounty,
  onToggleTimeScale,
  onSelectScaleValue,
  setFetchTemperature,
  setFetchPrecipitation
}) => {
  return (
    <div>
      <TargetCountySelector onSelectCounty={onSelectCounty} />
      <TimeScaleSelector
        onToggleTimeScale={onToggleTimeScale}
        onSelectScaleValue={onSelectScaleValue}
      />
      <DataTypeSelector
        setFetchTemperature={setFetchTemperature}
        setFetchPrecipitation={setFetchPrecipitation}
      />
    </div>
  );
};

export default Sidebar;
