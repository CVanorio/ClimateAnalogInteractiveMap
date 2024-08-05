import React from 'react';
import * as d3 from 'd3';
import '../../styles/Legend.css';

const Legend = () => {
  // Create a color scale for the legend
  const colorScale = d3.scaleSequential(d3.interpolateTurbo).domain([0, 1]);

  // Generate CSS gradient string
  const gradient = d3.range(0, 1.01, 0.01).map(i => colorScale(i)).join(',');

  return (
    <div className="legend-container">
      <div className="legend-title">Climate Similarity</div>
      <div className="legend-best"><i class="fa-solid fa-crown"></i> Best</div>
      <div className="legend-rectangle-container">
        <div className="legend-labels">
          <div className="legend-high">High</div>
          <div className="legend-rectangle" style={{ background: `linear-gradient(to top, ${gradient})` }}></div>
          <div className="legend-low">Low</div>
        </div>
      </div>
    </div>
  );
};

export default Legend;
