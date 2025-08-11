// components/MethodologyOverlay.js
import React from 'react';
import '../styles/MethodologyOverlay.css'; // Optional for styling

const MethodologyOverlay = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className='methodology-overlay'>
        <div className="methodology-content">
            <div className="methodology-header">
                <h3>Methodology</h3>
                <button onClick={onClose}>Close</button>
            </div>
            <div className="methodology-body">
                <details>
                    <summary>Introduction to Climate Analogs</summary>
                    <p>A climate analog is a geographical area that has similar climatic conditions to a target geographical area, but may be separated in time or location. Identifying these analogs helps us understand how the climate of one region compares to the past, present, or future climate of another, aiding in planning and adaptation for agriculture, water resources, and urban development.</p>
                </details>

                <details>
                    <summary>Data Sources</summary>
                    <p>The climate data for this project is obtained from the National Oceanic and Atmospheric Administration (NOAA). Specifically, we utilized the <strong>nClimDiv-monthly</strong> dataset, which includes detailed monthly climate records at the county level across the contiguous United States and Alaska.</p>
                    <p>For our analysis, we focused on the county-scale temperature and precipitation files within this dataset. These files provide comprehensive and accurate climate data, enabling us to effectively compare and rank potential analog counties based on their climate similarity to the target county.</p>
                </details>

                <details>
                    <summary>Target and Analog Counties</summary>
                    <ul>
                        <li><strong>Target Counties:</strong> The analysis focuses on counties located within Wisconsin. Users select the target county and its climate data through a menu in the application.</li>
                        <li><strong>Analog Counties:</strong> Potential analog counties include all counties in the contiguous United States and Alaska. For comparisons involving both temperature and precipitation, the top 50 analog counties are displayed. For comparisons involving only temperature or only precipitation, the top 100 analog counties are shown.</li>
                    </ul>
                </details>

                <details>
                    <summary>Time Frames</summary>
                    <ul>
                        <li><strong>By Year:</strong> Analyzes annual climate data to identify long-term trends over the selected year.</li>
                        <li><strong>By Season:</strong> Divides the year into four seasons—Winter (December of the previous year, January, and February), Spring (March, April, and May), Summer (June, July, and August), and Fall (September, October, and November)—to capture seasonal climate patterns.</li>
                        <li><strong>By Month:</strong> Offers a detailed analysis of climate data on a monthly basis to observe finer temporal variations.</li>
                    </ul>
                    <p>For each time frame, we calculate the average climate value for the target county within the selected year. This value is then compared to the climate normal for potential analog counties during the same time period, using the average climate values of those analog counties from 1991-2020.</p>
                </details>

                <details>
                    <summary>Climate Variables</summary>
                    <ul>
                        <li><strong>Temperature and Precipitation:</strong> Average temperature values and total precipitation amounts are analyzed over the specified time frames.</li>
                        <li><strong>Temperature Only:</strong> Average temperature values are analyzed over the specified time frames, focusing solely on temperature variations.</li>
                        <li><strong>Precipitation Only:</strong> Total precipitation amounts are analyzed over the specified time frames, focusing solely on precipitation patterns.</li>
                    </ul>
                </details>

                <details>
                    <summary>Algorithms</summary>
                    <strong>Data Collection:</strong> Monthly climate data is sourced from NOAA. This data is parsed to extract values for Wisconsin counties, and averages are computed for seasonal and annual periods. Historical monthly data is also used to calculate climate normal values for potential analog counties, which are then averaged over the years 1991-2020. Additionally, a standard deviation for these climate normal values is calculated and stored.<br />

                    <strong>Distance Calculation:</strong> A standardized Euclidean distance (SED) algorithm is used to quantify the difference between the target county’s climate data and that of potential analogs:
                    <ul>
                        <li>For temperature-only comparisons: <code className="code-inline">SED = SQRT((Analog County Normal Temperature - Target County Temperature Value)² / Analog County Temperature Standard Deviation²)</code></li>
                        <li>For precipitation-only comparisons: <code className="code-inline">SED = SQRT((Analog County Normal Precipitation - Target County Precipitation Value)² / Analog County Precipitation Standard Deviation²)</code></li>
                        <li>For combined temperature and precipitation comparisons: <code className="code-inline">SED = SQRT(Precipitation SED² + Temperature SED²)</code>, where the distance values are derived from the individual standardized Euclidean distance calculations for each variable.</li>
                    </ul>
                    <br />

                    <strong>Ranking:</strong> Analog counties are ranked based on their SED values, sorted from lowest to highest.<br />

                    <strong>Tie Breaker:</strong> In cases where multiple analog counties have identical SED values, physical distance serves as a tie breaker. The physical distance is calculated using the Euclidean distance formula: <code className="code-inline">ED = SQRT((Target County Latitude - Analog County Latitude)² + (Target County Longitude - Analog County Longitude)²)</code>, where latitude and longitude refer to the centroid of each county.<br />

                    <strong>Selection:</strong> The top 50 analog counties are selected for Temperature and Precipitation comparisons, while the top 100 are chosen for Temperature Only and Precipitation Only. For annual comparisons, the best analog match from each year is displayed.
                </details>
                
            </div>
        </div>
    </div>
  );
};

export default MethodologyOverlay;
