import introJs from 'intro.js';
import 'intro.js/introjs.css';
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


const preloadImages = async () => {
    const images = [
        selectACounty,
        climateVariables,
        timeFrameYear,
        timeFrameSeason,
        timeFrameMonth,
        topAnalogsOption,
        filledCounties,
        countyPopups,
        NormalTempPrecip,
        topAnalogsSlider,
        chart,
        chartToggle
    ];

    const promises = images.map((src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
        });
    });

    await Promise.all(promises);
};


export const startIntro = async () => {
    await preloadImages();

    // Initialize intro.js with options and steps
    const intro = introJs();
    intro.setOptions({
        steps: [
            {
                element: '.body', // Ensure this class exists in your HTML
                intro: `
                    <div style="text-align: left;">
                        <h2 style="text-align: center;">How Does Wisconsin’s Historical Climate Compare to the Rest of the United States?</h2>

                        <p>
                            Climate change is affecting our world, and understanding how Wisconsin’s climate has changed over time helps us predict what might happen in the future.
                        </p>

                        <p>
                            Imagine being able to experience what Wisconsin’s climate was like in the past. While we can’t travel back in time, our tool uses “climate analogs”—places that had similar weather in different time periods—to show how Wisconsin’s climate compares to other locations today. This helps us see long-term changes and patterns in the climate.
                        </p>

                        <p style="text-align: center;">
                            Click <strong>"Next"</strong> to begin the tutorial.
                        </p>
                    </div>
                `,
                position: 'center',
                disableInteraction: true,
                highlightClass: 'size-wide', // Ensure this CSS class is defined
            },
            {
                element: '.body',
                intro: `
            <div>
                <h3 style="text-align: center;">Why It Matters</h3>
                <p>
                    Understanding these climate comparisons is important for seeing how climate changes have impacted different areas over time. It helps us make informed decisions about how to deal with current and future climate challenges. By looking at the past, we can learn more about climate change and find ways to address the challenges ahead.
                </p>
                <p>
                    This tool supports the Wisconsin State Climatology Office’s goal of providing useful climate information for everyone in Wisconsin. It makes it easier to explore and understand Wisconsin’s climate history.
                </p>
            </div>
    `,
                position: 'top',
            },

            // Step 2: How It Works
            {
                element: '.body',
                intro: `
        <div>
            <h3 style="text-align: center;">How It Works</h3>
            <p>Our tool compares Wisconsin’s past climate to current climates in other U.S. locations. For example:</p>
            <ul>
                <li>In January 1904, Dane County, Wisconsin was colder and drier. The closest match today is central North Dakota, showing how the climate has changed.</li>
                <li>In September 2019, Dane County was warmer and wetter. Western North Carolina today matches Dane County’s conditions at that time.</li>
            </ul>
            <p>This approach reveals how Wisconsin’s climate has shifted over time, providing insight into historical climate trends and variability.</p>
            <p style="text-align: center;">
                Click <strong>"Next"</strong> to learn how to use the map.
            </p>
        </div>
    `,
                position: 'top',
            },

            // Step 3: Selecting a County
            {
                element: '.body',
                intro: `
        <div>
            <h3 style="text-align: center;">Selecting a County</h3>
            <img src="${selectACounty}" alt="Select a county" style="width: 50%; height: auto; margin: 20px auto; display: block; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);" />
            <p>Begin by selecting a Wisconsin county to explore its climate analogs. Use the drop-down menu to choose a county, and the app will display climate matches based on that location.</p>
        </div>
    `,
                position: 'top',
            },

            // Step 4: Choosing a Time Frame
            {
                element: '.body',
                intro: `
        <div>
            <h3 style="text-align: center;">Choosing a Time Frame</h3>
            <img src="${timeFrameYear}" alt="Select a time frame: by year" style="width: 32%; height: auto; margin: 20px auto; display: inline; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);" />
            <img src="${timeFrameSeason}" alt="Select a time frame: by season" style="width: 32%; height: auto; margin: 20px auto; display: inline; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);" />
            <img src="${timeFrameMonth}" alt="Select a time frame: by season" style="width: 32%; height: auto; margin: 20px auto; display: inline; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);" />
            <p>Next, select a time period: By Year, By Season, or By Month. You can choose a specific year, a season from a specific year, or a month from a specific year to investigate.</p>
            <p> The climate data for your chosen county and time period will then be compared to the "typical climate" for every county in the contiguous U.S. and Alaska. The "typical climate" is the average climate for the same year, season, or month, based on data from 1991 to 2020.</p>

        </div>
    `,
                position: 'top',
            },

            // Step 5: Viewing Climate Analogs on the Map
            {
                element: '.body',
                intro: `
        <div>
            <h3 style="text-align: center;">Viewing Climate Analogs</h3>
            <img src="${filledCounties}" alt="Climate analogs map" style="width: 75%; height: auto; margin: 20px auto; display: block; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);" />
            <p>The map displays the top 150 climate analogs for your chosen county and time frame. Counties with deeper red colors are the closest matches, while shades closer to blue indicate less similar climates. The top match is highlighted with a star icon <i class="fa-solid fa-star"></i>.</p>

        </div>
    `,
                position: 'top',
            },

            // Step 8: Interacting with the Map
            {
                element: '.body', // Update selector based on clickable areas on the map
                intro: `
        <div>
            <h3 style="text-align: center;">Interacting with the Map</h3>
            <img src="${countyPopups}" alt="Popups for matched counties" style="width: 75%; height: auto; margin: 20px auto; display: block; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);" />
            <p>Click on any highlighted county to view detailed climate data, including temperature and precipitation information for your selected time frame.</p>
        </div>
    `,
                position: 'top',
            },

            // Step 7: Selecting a Climate Variable
            {
                element: '.body', // Update selector based on your HTML structure
                intro: `
                <div>
                    <h3 style="text-align: center;">Selecting a Climate Variable</h3>
                    <img src="${climateVariables}" alt="Select a climate variable" style="width: 50%; height: auto; margin: 20px auto; display: block; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);" />
                    <p>Choose between temperature and precipitation combined, temperature only, or precipitation only to refine the climate analog results.</p>
                </div>
            `,
                position: 'top',
            },

            // Step 9: Interpreting Analog Patterns
            {
                element: '.body', // Update selector based on your HTML structure
                intro: `
                <div style="display: flex; align-items: center; gap: 20px;">
                    <a href="https://www.climate.gov/news-features/featured-images/new-maps-annual-average-temperature-and-precipitation-us-climate" target="_blank">
                        <img src="${NormalTempPrecip}" alt="Temperature and Precipitation Normals" style="width: 115%; height: auto; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);" />
                    </a>
                    <div style="padding-left: 3vw;">
                        <h3 style="text-align: left;">Interpreting Analog Locations</h3>
                        <p>Use climate patterns to understand climate similarities: drier analogs are found close to the Great Plains, wetter ones near coasts, hotter analogs in the South, and colder in the North.</p>
                    </div>
                </div>


    `,
                position: 'top',
            },


            // Step 5: Using the Top Analogs by Year Feature
            {
                element: '.body', // Update selector based on your HTML structure
                intro: `
                <div>
                    <h3 style="text-align: center;">Using the Top Analogs by Year Feature</h3>
                    <img src="${topAnalogsOption}" alt="Top Analogs By Year Option" style="width: 50%; height: auto; margin: 20px auto; display: block; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);" />
                    <p>For yearly, seasonal, or monthly data, explore how your county’s climate has shifted over time by selecting the <strong>Top analogs from each year</strong> option in the year drop down.</p>
                    <img src="${topAnalogsSlider}" alt="Top analogs slider and legend" style="width: 85%; height: auto; margin: 20px auto; display: block; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);" />
                    <p>Each marker represents the top climate match for a specific year. Use the slider to navigate through all years. Larger circles represent counties that were top matches for multiple years, while darker colors indicate more recent years.</p>
                </div>
            `,
                position: 'top',
            },

            // Step 6: Viewing Climate Data on the Chart
            {
                element: '.body', // Update selector based on your HTML structure
                intro: `
                <div>
                    <h3 style="text-align: center;">Viewing Climate Data on the Chart</h3>
                    <img src="${chart}" alt="Climate data chart" style="width: 100%; height: auto; margin: 20px auto; display: block; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);" />
                    <p>Additionally in the top analogs map, you will see a chart to view temperature and precipitation data by year, offering insight into historical climate trends.</p>
                    <img src="${chartToggle}" alt="Climate data chart toggle" style="width: 20%; height: auto; margin: 20px auto; display: block; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);" />
                    <p>You can hide or show the chart using this button in the menu.</p>
                </div>
            `,
                position: 'top',
            },

            

            // Step 10: Summary and Tips
            {
                element: '.body', // Update selector based on your HTML structure
                intro: `
                <div>
                    <h3 style="text-align: center;">You’ve completed the tutorial!</h3>
                    <p>Experiment with the settings to explore the climate data, compare counties, and understand climate changes over time.</p>

                        <h6>Credits</h6>
                        <p style="font-size: 14px;">This app was created by <a href="https://courtneyvanor.io/" target="_blank">Courtney Vanorio</a> through the <a href="https://nelson.wisc.edu/" target="_blank">Nelson Institute for Environmental Studies</a> at the <a href="https://www.wisc.edu/" target="_blank">University of Wisconsin-Madison</a> in collaboration with the <a href="https://climatology.nelson.wisc.edu/" target="_blank">Wisconsin State Climatology Office</a>.</p>


                </div>
            `,
                position: 'top',
                disableInteraction: true,
            },
            // Additional Steps: Detailed Exploration Options

        ],
        showStepNumbers: false,
        disableInteraction: true,
        scrollToElement: true,
        exitOnEsc: true,
        exitOnOverlayClick: true,
    });
    intro.start();
};