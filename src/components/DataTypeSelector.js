import React from 'react';

const DataTypeSelector = ({ selectedDataType, onDataTypeChange }) => {
  return (
    <div className="data-type-selector">
      {/* Button to select 'Temperature and Precipitation' */}
      <button
        className={`data-type-button ${selectedDataType === 'both' ? 'active' : ''}`}
        onClick={() => onDataTypeChange('both')}
      >
        <span>Temperature and Precipitation</span>
      </button>
      {/* Button to select 'Temperature Only' */}
      <button
        className={`data-type-button ${selectedDataType === 'temperature' ? 'active' : ''}`}
        onClick={() => onDataTypeChange('temperature')}
      >
        <span>Temperature Only</span>
      </button>
      {/* Button to select 'Precipitation Only' */}
      <button
        className={`data-type-button ${selectedDataType === 'precipitation' ? 'active' : ''}`}
        onClick={() => onDataTypeChange('precipitation')}
      >
        <span>Precipitation Only</span>
      </button>
    </div>
  );
};

export default DataTypeSelector;
