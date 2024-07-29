import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import '../styles/Graph.css';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Graph = ({ graphData, years, menuVisible }) => {
  // Extract the precipitation and temperature values from the data
  const precipitationValues = graphData.map(item => Number(item.TargetPrecipValue));
  const temperatureValues = graphData.map(item => Number(item.TargetTempValue));

  // State to track the active point index
  const [activeIndex, setActiveIndex] = useState(null);

  // Ref for chart instance
  const chartRef = useRef(null);

  // Determine the county name for the title
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
    ].filter(Boolean) // Filter out false values
  };

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top', // Adjust position as needed
        align: 'center', // Center align the legend items
        labels: {
          usePointStyle: true, // Use line with circle for legend
          pointStyle: 'circle', // Use circle as point style
          fontSize: 10, // Adjust legend font size
          boxWidth: 5, // Width of legend marker
          boxHeight: 5 // Height of legend marker
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: 'black',
        bodyColor: 'black',
        displayColors: true,
        caretPadding: 80
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      },
      'y-axis-precipitation': {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Precipitation (in)'
        },
        min: hasPrecipitationData ? Math.min(...precipitationValues) - 3 : undefined,
        max: hasPrecipitationData ? Math.max(...precipitationValues) + 3 : undefined,
        grid: {
          drawOnChartArea: false // To avoid grid lines overlapping
        }
      },
      'y-axis-temperature': {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Temperature (°F)'
        },
        min: hasTemperatureData ? Math.min(...temperatureValues) - 1 : undefined,
        max: hasTemperatureData ? Math.max(...temperatureValues) + 1 : undefined,
        grid: {
          drawOnChartArea: false // To avoid grid lines overlapping
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  };

  // Custom hover event handler
  const handleHover = (event, chart) => {
    const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
    if (points.length > 0) {
      const index = points[0].index;
      setActiveIndex(index); // Set active index to synchronize highlight
    }
  };

  // Update chart reference on component mount
  useEffect(() => {
    if (chartRef && chartRef.current && chartRef.current.chartInstance) {
      const chartInstance = chartRef.current.chartInstance;

      // Add event listener for hover
      chartInstance.options.plugins.tooltip.enabled = false; // Disable default tooltip for synchronization
      chartInstance.chart.canvas.addEventListener('mousemove', event => handleHover(event, chartInstance));

      return () => {
        // Clean up event listener
        chartInstance.chart.canvas.removeEventListener('mousemove', handleHover);
      };
    }
  }, []);

  return (
    <div className="graph-container" style = {{width: menuVisible ? '77vw' : '98vw'}}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default Graph;
