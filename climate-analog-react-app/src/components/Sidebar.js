import React from 'react';
import TargetCountySelector from './TargetCountySelector';
import TimeScaleSelector from './TimeScaleSelector';
import DataTypeSelector from './DataTypeSelector';

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
      <TargetCountySelector
        selectedCounty={selectedCounty}
        onSelectCounty={onSelectCounty}
      />
      <TimeScaleSelector
        timeScale={timeScale}
        onToggleTimeScale={onToggleTimeScale}
        scaleValue={scaleValue}
        onSelectScaleValue={onSelectScaleValue}
        onSelectTargetYear={onSelectTargetYear}
      />
      <DataTypeSelector
        selectedDataType={selectedDataType}
        onDataTypeChange={onDataTypeChange}
      />
    </div>
  );
};

export default Sidebar;
