import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import '../styles/Graph.css';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Graph = ({ graphData, years}) => {
  // Extract the precipitation and temperature values from the data
  const precipitationValues = graphData.map(item => Number(item.TargetPrecipValue));
  const temperatureValues = graphData.map(item => Number(item.TargetTempValue));

  // State to track the active point index
  const [activeIndex, setActiveIndex] = useState(null);

  // Ref for chart instance
  const chartRef = useRef(null);

  // Determine the county name for the title
  const targetCountyName = graphData[0].TargetCountyName;


  // Create the chart data object
  const chartData = {
    labels: years,
    datasets: [
      {
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
      {
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
    ]
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
            return `${years[index]} - ${targetCountyName} County, WI`;
          }
        },
        backgroundColor: 'black',
        fontColor: 'black',
        displayColors: true
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
        min: Math.min(...precipitationValues) - 3,
        max: Math.max(...precipitationValues) + 3
      },
      'y-axis-temperature': {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Temperature (°F)'
        },
        min: Math.min(...temperatureValues) - 1,
        max: Math.max(...temperatureValues) + 1,
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
    <div className="graph-container">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default Graph;
