// src/components/DataTypeSelector.js
import React from 'react';

const DataTypeSelector = ({ selectedDataType, onChange }) => {
  return (
    <div>
      <input
        type="radio"
        id="temperature"
        value="temperature"
        checked={selectedDataType === 'temperature'}
        onChange={onChange}
      />
      <label htmlFor="temperature">Temperature</label>

      <input
        type="radio"
        id="precipitation"
        value="precipitation"
        checked={selectedDataType === 'precipitation'}
        onChange={onChange}
      />
      <label htmlFor="precipitation">Precipitation</label>

      <input
        type="radio"
        id="both"
        value="both"
        checked={selectedDataType === 'both'}
        onChange={onChange}
      />
      <label htmlFor="both">Both</label>
    </div>
  );
};

export default DataTypeSelector;
