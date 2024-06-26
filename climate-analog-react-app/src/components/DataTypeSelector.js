// src/components/DataTypeSelector.js
import React from 'react';

const DataTypeSelector = ({ selectedDataType, onChange }) => {
  return (
    <div>
      <label>
        <input
          type="radio"
          value="temperature"
          checked={selectedDataType === 'temperature'}
          onChange={onChange}
        />
        Temperature
      </label>
      <label>
        <input
          type="radio"
          value="precipitation"
          checked={selectedDataType === 'precipitation'}
          onChange={onChange}
        />
        Precipitation
      </label>
      <label>
        <input
          type="radio"
          value="both"
          checked={selectedDataType === 'both'}
          onChange={onChange}
        />
        Both
      </label>
    </div>
  );
};

export default DataTypeSelector;
