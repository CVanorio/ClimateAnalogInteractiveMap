import React from 'react';

const DataTypeSelector = ({ selectedDataType, onDataTypeChange }) => {
  return (
    <div>
      <label>
        <input
          type="radio"
          value="temperature"
          checked={selectedDataType === 'temperature'}
          onChange={(e) => onDataTypeChange(e.target.value)}
        />
        Temperature
      </label>
      <label>
        <input
          type="radio"
          value="precipitation"
          checked={selectedDataType === 'precipitation'}
          onChange={(e) => onDataTypeChange(e.target.value)}
        />
        Precipitation
      </label>
      <label>
        <input
          type="radio"
          value="both"
          checked={selectedDataType === 'both'}
          onChange={(e) => onDataTypeChange(e.target.value)}
        />
        Both
      </label>
    </div>
  );
};

export default DataTypeSelector;
