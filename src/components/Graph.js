import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/Graph.css';
const {
  TARGET_STATE_ABBR,
} = require('../utils/constants');


// Register Chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Programmatically show a chart's tooltip at a given data index (used to mirror
// hover from the partner chart). Activates every visible dataset that has a point.
function showTooltipAtIndex(chart, index) {
  if (!chart) return;
  const elements = chart.data.datasets
    .map((_, datasetIndex) => ({ datasetIndex, index }))
    .filter(e => chart.isDatasetVisible(e.datasetIndex)
      && chart.getDatasetMeta(e.datasetIndex).data[index]);
  if (!elements.length) return;
  const point = chart.getDatasetMeta(elements[0].datasetIndex).data[index];
  chart.setActiveElements(elements);
  chart.tooltip.setActiveElements(elements, { x: point.x, y: point.y });
  chart.update();
}

// Clear any programmatically-shown tooltip/highlight on a chart.
function clearTooltip(chart) {
  if (!chart) return;
  chart.setActiveElements([]);
  chart.tooltip.setActiveElements([], { x: 0, y: 0 });
  chart.update();
}

const Graph = ({ graphData, years, menuVisible, onSelectTargetYear, graphMode }) => {
  // Refs to each chart instance so hovering one can drive the other's tooltip.
  const precipRef = useRef(null);
  const tempRef = useRef(null);

  // Only consider rows whose Year is actually shown on the X-axis. This drops the
  // current incomplete season (e.g. Summer/Fall of the present year), whose row
  // carries a missing-data sentinel (~ -100) that would otherwise corrupt the
  // Y-axis min/max and the average lines. Fall back to graphData if years isn't set yet.
  const visibleData = years.length > 0
    ? graphData.filter(item => years.includes(Number(item.Year)))
    : graphData;

  // Raw target values per year
  const rawPrecip = visibleData.map(item => Number(item.TargetPrecipValue));
  const rawTemp = visibleData.map(item => Number(item.TargetTempValue));

  // Climate normals (a single reference value per selection) for anomaly mode.
  const firstFinite = (vals) => vals.find(v => Number.isFinite(v));
  const precipNorm = firstFinite(visibleData.map(item => Number(item.TargetPrecipNormal)));
  const tempNorm = firstFinite(visibleData.map(item => Number(item.TargetTempNormal)));

  // In anomaly mode, plot (value - norm); fall back to raw if the norm is unavailable.
  const precipAnomaly = graphMode === 'anomalies' && Number.isFinite(precipNorm);
  const tempAnomaly = graphMode === 'anomalies' && Number.isFinite(tempNorm);
  const precipitationValues = precipAnomaly
    ? rawPrecip.map(v => Number.isFinite(v) ? parseFloat((v - precipNorm).toFixed(2)) : v)
    : rawPrecip;
  const temperatureValues = tempAnomaly
    ? rawTemp.map(v => Number.isFinite(v) ? parseFloat((v - tempNorm).toFixed(2)) : v)
    : rawTemp;

  // Determine the county name for the chart title, ensuring graphData is not empty
  const targetCountyName = graphData.length > 0 && graphData[0]?.TargetCountyName ? graphData[0].TargetCountyName : 'Unknown County';

  // Check if precipitation and temperature data exist
  const hasPrecipitationData = precipitationValues.some(value => !isNaN(value));
  const hasTemperatureData = temperatureValues.some(value => !isNaN(value));

  // --- Helpers to build flat average lines (same length as labels) ---
  function buildAverageLine(values, len) {
    const valid = values.filter(v => !isNaN(v));
    if (valid.length === 0 || !Array.isArray(len ? [] : years)) return null;
    const avg = parseFloat(
      (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2)
    );
    return Array.from({ length: len }, () => avg);
  }

  const precipAvgData = hasPrecipitationData ? buildAverageLine(precipitationValues, years.length) : null;
  const tempAvgData = hasTemperatureData ? buildAverageLine(temperatureValues, years.length) : null;

  // Flat zero baseline shown in anomaly mode so values read against "normal".
  const zeroLine = Array.from({ length: years.length }, () => 0);

  // --- Per-chart data objects (one chart for precipitation, one for temperature) ---
  const precipChartData = {
    labels: years,
    datasets: [
      hasPrecipitationData && {
        label: 'Precipitation',
        data: precipitationValues,
        fill: false,
        borderColor: 'blue',
        tension: 0.1,
        yAxisID: 'y',
        pointStyle: 'circle',
        pointBackgroundColor: 'blue',
        borderWidth: 1,
        pointRadius: 2
      },
      precipAvgData && {
        label: `Avg Precipitation (${years[0]} - ${years[years.length - 1]})`,
        data: precipAvgData,
        fill: false,
        borderColor: '#6baed6', // lighter blue
        borderDash: [6, 6],
        pointRadius: 0,
        borderWidth: 2,
        yAxisID: 'y',
        hidden: false
      },
      precipAnomaly && {
        label: 'Normal (baseline)',
        data: zeroLine,
        fill: false,
        borderColor: '#999',
        borderDash: [4, 4],
        pointRadius: 0,
        borderWidth: 1,
        yAxisID: 'y'
      }
    ].filter(Boolean)
  };

  const tempChartData = {
    labels: years,
    datasets: [
      hasTemperatureData && {
        label: 'Temperature',
        data: temperatureValues,
        fill: false,
        borderColor: 'red',
        tension: 0.1,
        yAxisID: 'y',
        pointStyle: 'circle',
        pointBackgroundColor: 'red',
        borderWidth: 1,
        pointRadius: 2
      },
      tempAvgData && {
        label: `Avg Temperature (${years[0]} - ${years[years.length - 1]})`,
        data: tempAvgData,
        fill: false,
        borderColor: '#fc9272', // lighter red
        borderDash: [6, 6],
        pointRadius: 0,
        borderWidth: 2,
        yAxisID: 'y',
        hidden: false
      },
      tempAnomaly && {
        label: 'Normal (baseline)',
        data: zeroLine,
        fill: false,
        borderColor: '#999',
        borderDash: [4, 4],
        pointRadius: 0,
        borderWidth: 1,
        yAxisID: 'y'
      }
    ].filter(Boolean)
  };

  // --- Shared options factory; each chart gets its own left Y-axis ---
  const makeOptions = ({ yTitle, min, max, getPartnerChart }) => ({
    responsive: true,
    maintainAspectRatio: false,
    // Mirror this chart's hover onto its partner so both years' tooltips show,
    // and show a pointer cursor over clickable points.
    onHover: (event, elements) => {
      if (event?.native?.target) {
        event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
      }
      const partner = getPartnerChart();
      if (!partner) return;
      if (elements.length) showTooltipAtIndex(partner, elements[0].index);
      else clearTooltip(partner);
    },
    // Clicking a point sets the app's target year (updates the sidebar + map).
    onClick: (event, elements) => {
      if (!elements.length || !onSelectTargetYear) return;
      const year = years[elements[0].index];
      if (year != null) onSelectTargetYear(String(year));
    },
    plugins: {
      legend: {
        display: true,
        position: 'top', // Position the legend at the top
        align: 'center', // Center-align the legend items
        labels: {
          usePointStyle: true, // Use point style for legend
          pointStyle: 'circle', // Circle style for legend points
          fontSize: 10, // Legend font size
          boxWidth: 5, // Width of legend box
          boxHeight: 5 // Height of legend box
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = '';
            const datasetLabel = context.dataset.label || '';
            if (datasetLabel) {
              label += `${datasetLabel}: `;
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          },
          title: function (tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            return `${years[index]} - ${targetCountyName}, ${TARGET_STATE_ABBR}`;
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Tooltip background color
        titleColor: 'black', // Tooltip title color
        bodyColor: 'black', // Tooltip body color
        displayColors: true, // Show color boxes in tooltip
        caretPadding: 80 // Padding for tooltip caret
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year' // X-axis label
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: yTitle
        },
        min,
        max,
        ticks: {
          stepSize: 1 // Define the tick interval size
        },
        grid: {
          drawOnChartArea: false // Disable grid lines on chart area
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  });

  const precipOptions = makeOptions({
    yTitle: precipAnomaly ? 'Precipitation anomaly (in)' : 'Precipitation (in)',
    min: hasPrecipitationData ? Math.floor(Math.min(...precipitationValues.filter(Number.isFinite)) - 0.5) : undefined,
    max: hasPrecipitationData ? Math.ceil(Math.max(...precipitationValues.filter(Number.isFinite)) + 0.5) : undefined, // Reduced buffer
    getPartnerChart: () => tempRef.current
  });

  const tempOptions = makeOptions({
    yTitle: tempAnomaly ? 'Temperature anomaly (°F)' : 'Temperature (°F)',
    min: hasTemperatureData ? Math.floor(Math.min(...temperatureValues.filter(Number.isFinite)) - 0.5) : undefined,
    max: hasTemperatureData ? Math.ceil(Math.max(...temperatureValues.filter(Number.isFinite)) + 0.5) : undefined, // Reduced buffer
    getPartnerChart: () => precipRef.current
  });

  // Clear tooltips on both charts when the mouse leaves either one, so a
  // mirrored tooltip on the partner chart doesn't linger.
  const clearBothTooltips = () => {
    clearTooltip(precipRef.current);
    clearTooltip(tempRef.current);
  };

  return (
    <div className="graph-container" style={{ width: menuVisible ? 'calc(100vw - 365px)' : '98vw' }}>
      <div className="graph-split">
        {/* Left: Temperature chart */}
        {hasTemperatureData && (
          <div className="graph-half" onMouseLeave={clearBothTooltips}>
            <Line ref={tempRef} data={tempChartData} options={tempOptions} />
          </div>
        )}
        {/* Right: Precipitation chart */}
        {hasPrecipitationData && (
          <div className="graph-half" onMouseLeave={clearBothTooltips}>
            <Line ref={precipRef} data={precipChartData} options={precipOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Graph;
