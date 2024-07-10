import React from 'react';

const DataTypeSelector = ({ selectedDataType, onDataTypeChange }) => {
  return (
    <div className="data-type-selector">
      <button
        className={`data-type-button ${selectedDataType === 'both' ? 'active' : ''}`}
        onClick={() => onDataTypeChange('both')}
      >
        <span>Temperature and Precipitation</span>
      </button>
      <button
        className={`data-type-button ${selectedDataType === 'temperature' ? 'active' : ''}`}
        onClick={() => onDataTypeChange('temperature')}
      >
        <span>Temperature Only</span>
      </button>
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
