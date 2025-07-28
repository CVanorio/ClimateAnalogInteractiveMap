import React from 'react';
import '../App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import images
import selectACounty from '../assets/tour/selectACounty.jpg';
import climateVariables from '../assets/tour/climateVariables.jpg';
import timeFrameYear from '../assets/tour/selectATimeFrame_year.jpg';
import timeFrameSeason from '../assets/tour/selectATimeFrame_season.jpg';
import timeFrameMonth from '../assets/tour/selectATimeFrame_month.jpg';
import topAnalogsOption from '../assets/tour/topAnalogsOption.png';
import filledCounties from '../assets/tour/filledCountiesExample.jpg';
import countyPopups from '../assets/tour/countyPopups.jpg';
import NormalTempPrecip from '../assets/tour/Normals_TotalPrecipAvgTemp_Annual_1991-2020_continuous_1400x2193.png';
import topAnalogsSlider from '../assets/tour/topAnalogSlider.jpg';
import chart from '../assets/tour/chart.jpg';
import chartToggle from '../assets/tour/chartToggle.jpg';

// Export Joyride steps for a fully centered tour
export const joyrideSteps = [
  {
    target: 'body',
    content: (
      <div style={{ textAlign: 'center' }}>
        <h2>How Does Wisconsin’s Historical Climate Compare to the Present Climate across the United States?</h2>
        <p>Climate change is affecting our world, and understanding how Wisconsin’s climate has changed over time helps us put future climate change into perspective.</p>
        <p>Imagine being able to experience what Wisconsin’s climate was like in the past. While we can’t travel back in time, our tool uses “climate analogs”—places whose present climate resembles past conditions in Wisconsin—to show how Wisconsin’s climate in a previous month, season, or year compares to the average present-day climate of other locations. The present day climate is an average from 1991-2020. The past climate is an average of any individual month, season, or year between 1895 to the current year. This helps us visualize long-term changes and short-term variability in the climate.</p>
        <p style={{ textAlign: 'center' }}><strong>Click "Next" to begin the tutorial.</strong></p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: (
      <div style={{ textAlign: 'center' }}>
        <h3>Why It Matters</h3>
        <p>These climate comparisons are important for interpreting how climate changes have impacted different areas over time.  It helps us make informed decisions about how to deal with current and future climate challenges. By looking at the past, we can learn more about climate change and find ways to address the challenges ahead.</p>
        <p>This tool supports the Wisconsin State Climatology Office’s goal of providing useful climate information for everyone in Wisconsin. It makes it easier to explore and understand Wisconsin’s climate history.</p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: (
      <div style={{ textAlign: 'center' }}>
        <h3>How It Works</h3>
        <p>Our tool compares variations in Wisconsin’s past climate (temperature and precipitation) to today's average climate in other places across the U.S. For example:</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>In January 1904, Dane County, Wisconsin, was colder and drier than most Januaries nowadays. The current climate of central North Dakota is the closest match to what Dane County's climate was like that month.</li>
          <li>In September 2019, Dane County was warmer and wetter than usual. The current climate of western North Carolina is the closest match to what Dane County's climate was like in that month.</li>
        </ul>
        <p>This approach reveals how Wisconsin’s climate compares to other regions in the United States and has varied and trended over time. You can use your own experiences with the current climate to interpret the past data.</p>
        <p><strong>Click "Next" to learn how to use the map.</strong></p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: (
      <div style={{ textAlign: 'center' }}>
        <h3>Selecting a County</h3>
        <img src={selectACounty} alt="Select a county" style={{ width: '60%', height: 'auto', margin: '20px auto', display: 'block', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)' }} />
        <p>Begin by selecting a Wisconsin county to explore its climate analogs. Use the drop-down menu to choose a county, and the app will display climate matches based on that location.</p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: (
      <div style={{ textAlign: 'center' }}>
        <h3>Choosing a Time Frame</h3>
        <img src={timeFrameYear} alt="Select a time frame: by year" style={{ width: '33%', height: 'auto', margin: '20px auto', display: 'inline', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)' }} />
        <img src={timeFrameSeason} alt="Select a time frame: by season" style={{ width: '33%', height: 'auto', margin: '20px auto', display: 'inline', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)' }} />
        <img src={timeFrameMonth} alt="Select a time frame: by month" style={{ width: '33%', height: 'auto', margin: '20px auto', display: 'inline', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)' }} />
        <p>Next, select a time period: By Year, By Season, or By Month. You can choose a specific year, a season from a specific year, or a month from a specific year to investigate.</p>
        <p>The climate data for your chosen county and time period will then be compared to the "typical climate" for every county in the contiguous U.S. and Alaska. The "typical climate" is the average climate for the same year, season, or month, based on data from 1991 to 2020.</p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: (
      <div style={{ textAlign: 'center' }}>
        <h3>Viewing Climate Analogs</h3>
        <img src={filledCounties} alt="Climate analogs map" style={{ width: '85%', height: 'auto', margin: '20px auto', display: 'block', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)' }} />
        <p>The map displays the top climate analogs for your chosen county and time frame. Counties with deeper red colors are the closest matches, while shades closer to blue indicate less similar climates. The top match is highlighted with a star icon <i className="fa-solid fa-star"></i>.</p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: (
      <div style={{ textAlign: 'center' }}>
        <h3>Interacting with the Map</h3>
        <img src={countyPopups} alt="Popups for matched counties" style={{ width: '85%', height: 'auto', margin: '20px auto', display: 'block', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)' }} />
        <p>Click on any highlighted county to view detailed climate data, including temperature and precipitation information for your selected time frame.</p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: (
      <div style={{ textAlign: 'center' }}>
        <h3>Selecting a Climate Variable</h3>
        <img src={climateVariables} alt="Select a climate variable" style={{ width: '50%', height: 'auto', margin: '20px auto', display: 'block', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)' }} />
        <p>The standard climate analog uses a combination of temperature and precipitation. You can dig deeper by exploring temperature or precipitation only.</p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: (
      <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <a href="https://www.climate.gov/news-features/featured-images/new-maps-annual-average-temperature-and-precipitation-us-climate" target="_blank" rel="noopener noreferrer">
          <img src={NormalTempPrecip} alt="Temperature and Precipitation Normals" style={{ width: '150%', height: 'auto', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)' }} />
        </a>
        <div style={{ paddingLeft: '8vw' }}>
          <h3 style={{ textAlign: 'center' }}>Interpreting Analog Locations</h3>
          <p>Use climate patterns to understand climate similarities: hotter analogs are found in the South, colder analogs in the North. Drier analogs are found close to the Great Plains, wetter analogs near coasts.</p>
        </div>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: (
      <div style={{ textAlign: 'center' }}>
        <h3>Using the Top Analogs by Year Feature</h3>
        <img src={topAnalogsOption} alt="Top Analogs By Year Option" style={{ width: '55%', height: 'auto', margin: '20px auto', display: 'block', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)' }} />
        <p>For yearly, seasonal, or monthly data, explore how your county’s climate has shifted over time by selecting the <strong>"Top analog from each year"</strong> option in the drop down menu.</p>
        <img src={topAnalogsSlider} alt="Top analogs slider and legend" style={{ width: '90%', height: 'auto', margin: '20px auto', display: 'block', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)' }} />
        <p>Each marker represents the top climate match for a specific year. Use the slider to navigate through all years. Larger circles represent counties that were top matches for multiple years. Lighter colors indicate earlier years and darker colors indicate more recent years.</p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: (
      <div style={{ textAlign: 'center' }}>
        <h3>Viewing Climate Data on the Chart</h3>
        <img src={chart} alt="Climate data chart" style={{ width: '100%', height: 'auto', margin: '20px auto', display: 'block', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)' }} />
        <p>In the top analogs map, you will see a chart to view temperature and precipitation data by year, offering insight into historical climate trends. This time series can be used to identify exceptional years like the record wet year of 2018 and the record hot year of 2012.</p>
        <img src={chartToggle} alt="Climate data chart toggle" style={{ width: '20%', height: 'auto', margin: '20px auto', display: 'block', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)' }} />
        <p>You can hide or show the chart using this button in the menu.</p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: (
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '60px' }}>You’ve completed the tutorial!</h3>
        <p>Experiment with the settings to explore the climate data, compare counties, and understand climate changes over time.</p>
        <br/>
        <br/>
        <h6>Credits</h6>
        <p style={{ fontSize: 14 }}>
          This app was created by <b>Courtney Vanorio</b> through the <a href="https://nelson.wisc.edu/" target="_blank" rel="noopener noreferrer">Nelson Institute for Environmental Studies</a> at the <a href="https://www.wisc.edu/" target="_blank" rel="noopener noreferrer">University of Wisconsin-Madison</a> in collaboration with the <a href="https://climatology.nelson.wisc.edu/" target="_blank" rel="noopener noreferrer">Wisconsin State Climatology Office</a>.
        </p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
];