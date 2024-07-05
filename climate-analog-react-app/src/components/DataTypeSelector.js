import React from 'react';

const DataTypeSelector = ({ selectedDataType, onDataTypeChange }) => {
  return (
    <div>
      <label className="radioLabel">
        <input className='radio-button'
          type="radio"
          value="both"
          checked={selectedDataType === 'both'}
          onChange={(e) => onDataTypeChange(e.target.value)}
        />
        Temperature and Precipitation
      </label>
      <br/>
      <label className="radioLabel">
        <input className='radio-button'
          type="radio"
          value="temperature"
          checked={selectedDataType === 'temperature'}
          onChange={(e) => onDataTypeChange(e.target.value)}
        />
        Temperature Only
      </label>
      <br/>
      <label className="radioLabel">
        <input className='radio-button'
          type="radio"
          value="precipitation"
          checked={selectedDataType === 'precipitation'}
          onChange={(e) => onDataTypeChange(e.target.value)}
        />
        Precipitation Only
      </label>      
    </div>
  );
};

export default DataTypeSelector;
