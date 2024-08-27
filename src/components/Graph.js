import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import '../styles/Graph.css';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Graph = ({ graphData, years, menuVisible }) => {
  // Extract the precipitation and temperature values from the data
  const precipitationValues = graphData.map(item => Number(item.TargetPrecipValue));
  const temperatureValues = graphData.map(item => Number(item.TargetTempValue));

  // State to track the index of the active point for highlighting
  const [activeIndex, setActiveIndex] = useState(null);

  // Ref for accessing the chart instance
  const chartRef = useRef(null);

  // Determine the county name for the chart title
  const targetCountyName = graphData[0].TargetCountyName;

  // Check if precipitation and temperature data exist
  const hasPrecipitationData = precipitationValues.some(value => !isNaN(value));
  const hasTemperatureData = temperatureValues.some(value => !isNaN(value));

  // Create the chart data object
  const chartData = {
    labels: years,
    datasets: [
      hasPrecipitationData && {
        label: 'Precipitation',
        data: precipitationValues,
        fill: false,
        borderColor: 'blue',
        tension: 0.1,
        yAxisID: 'y-axis-precipitation',
        pointStyle: 'circle',
        pointBackgroundColor: 'blue',
        borderWidth: 1,
        pointRadius: 2 // Adjust point radius for graph
      },
      hasTemperatureData && {
        label: 'Temperature',
        data: temperatureValues,
        fill: false,
        borderColor: 'red',
        tension: 0.1,
        yAxisID: 'y-axis-temperature',
        pointStyle: 'circle',
        pointBackgroundColor: 'red',
        borderWidth: 1,
        pointRadius: 2 // Adjust point radius for graph
      }
    ].filter(Boolean) // Filter out undefined datasets
  };

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
          label: function(context) {
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
          title: function(tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            return `${years[index]} - ${targetCountyName}, WI`;
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
      'y-axis-precipitation': {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Precipitation (in)' // Y-axis label for precipitation
        },
        min: hasPrecipitationData ? Math.min(...precipitationValues) - 3 : undefined,
        max: hasPrecipitationData ? Math.max(...precipitationValues) + 3 : undefined,
        grid: {
          drawOnChartArea: false // Disable grid lines on chart area
        }
      },
      'y-axis-temperature': {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Temperature (°F)' // Y-axis label for temperature
        },
        min: hasTemperatureData ? Math.min(...temperatureValues) - 1 : undefined,
        max: hasTemperatureData ? Math.max(...temperatureValues) + 1 : undefined,
        grid: {
          drawOnChartArea: false // Disable grid lines on chart area
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  };

  // Custom hover event handler to synchronize highlight
  const handleHover = (event, chart) => {
    const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
    if (points.length > 0) {
      const index = points[0].index;
      setActiveIndex(index); // Set active index to synchronize highlight
    }
  };

  // Update chart reference and add event listener on component mount
  useEffect(() => {
    if (chartRef && chartRef.current && chartRef.current.chartInstance) {
      const chartInstance = chartRef.current.chartInstance;

      // Disable default tooltip and add custom hover event listener
      chartInstance.options.plugins.tooltip.enabled = false; // Disable default tooltip
      chartInstance.chart.canvas.addEventListener('mousemove', event => handleHover(event, chartInstance));

      return () => {
        // Clean up event listener on component unmount
        chartInstance.chart.canvas.removeEventListener('mousemove', handleHover);
      };
    }
  }, []);

  return (
    <div className="graph-container" style={{ width: menuVisible ? 'calc(100vw - 365px)' : '98vw' }}>
      {/* Render Line chart */}
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default Graph;
