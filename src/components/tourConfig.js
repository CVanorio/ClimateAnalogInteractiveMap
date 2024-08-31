import introJs from 'intro.js';
import 'intro.js/introjs.css'; // Default intro.js styles
import '../App.css'; // Import your custom CSS file
import '@fortawesome/fontawesome-free/css/all.min.css';

export const startTour = () => {

  const intro = introJs();
  intro.setOptions({
    steps: [
      {
        element: '.body',
        intro: `
          <div style="text-align: center;">
            <h2>Welcome to the Climate Analogs Explorer!</h2>
            <p>This tool helps you explore how Wisconsin's climate has changed over time by finding locations with similar historical climate patterns. These similar locations are referred to as climate analogs.</p>
            <p>A climate analog is a region that has a 'typical climate' that closely resembles the of climate of your selected location during the chosen time period. The typical climate is based on average conditions from 1991 to 2020. By examining these analogs, you can gain valuable insights into how historical climate conditions at your chosen location compare to those in other areas of the county.</p>

          </div>
        `,
        position: 'center',
        disableInteraction: true,
        highlightClass: 'size-wide',
      },
      {
        element: '.body',
        intro: `
          <div style="text-align: center;">
            <h3>Ready to get started?</h3>
            <p>Let's take a tour of all the features, starting with the basics.</p>
          </div>
        `,
        position: 'center',
        disableInteraction: true,
        highlightClass: 'size-wide',
      },
      {
        element: '.sidebar',
        intro: `
          <div style="text-align: center;">
            <p>This is the main menu where you can select different data and settings to display on the map.</p>
            <p>You can customize your view by choosing the location, time period, and climate variables you'd like to explore.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: true,
      },
      {
        element: '#menuToggle',
        intro: `
          <div style="text-align: center;">
            <p>The arrow button here lets you show or hide the menu.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: true,
      },
      {
        element: '#target-county-selector',
        intro: `
          <div style="text-align: center;">
            <p>This dropdown allows you to select the target county in Wisconsin that you'd like to analyze.</p>
            <p>Before you continue, <i class="fa-solid fa-arrow-pointer"></i> click here to choose the Wisconsin county you want to explore.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: false,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '#TimeFrameMenuSection',
        intro: `
          <div style="text-align: center;">
            <p>Next, you can analyze the target county climate data for a specific year, season, or month.</p>
            <p>For now, we'll use the default setting of analyzing data for a specific year.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: true,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '#yearSelect',
        intro: `
          <div style="text-align: center;">
            <p><i class="fa-solid fa-arrow-pointer"></i> Click the dropdown to select a specific year from 1895 to the present.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: false,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '#climateVariablesMenuSection',
        intro: `
          <div style="text-align: center;">
            <p>Here, you can choose which climate variables to display: precipitation, temperature, or a combination of both.</p>
            <p>We'll keep the default setting of displaying combined data for now.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: true,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '.map-container',
        intro: `
          <div style="text-align: center;">
            <p>This is the map view where the selected data will be displayed.</p>
            <p>The map will update based on your selections in the menu.</p>
          </div>
        `,
        position: 'left',
        disableInteraction: true,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '.map-container',
        intro: `
          <div style="text-align: center;">
            <p>The map pin <i class="fa-solid fa-location-dot"></i> indicates the location of your selected target county.</p>
            <p><i class="fa-solid fa-arrow-pointer"></i> Click the map pin to view detailed information about the climate of selected county and time frame.</p>
          </div>
        `,
        position: 'left',
        disableInteraction: false,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '.map-container',
        intro: `
          <div style="text-align: center;">
            <p>The tool compares the climate of the selected target county with every other county in the contiguous U.S. and Alaska for the chosen time period.</p>
            <p>The top 50 counties with climates that most closely match the target county are highlighted on the map, with a star icon <i class="fa-solid fa-star"></i> marking the best match.</p>
            <p><i class="fa-solid fa-arrow-pointer"></i> Use the zoom controls or scroll to explore the map. Click on different highlighted counties to learn more.</p>
          </div>
        `,
        position: 'left',
        disableInteraction: false,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '#yearSelect',
        intro: `
          <div style="text-align: center;">
            <p>To continue, let's explore the "Top analogs from each year" feature.</p>
            <p><i class="fa-solid fa-arrow-pointer"></i> Click the year dropdown and select the first option to see the top analogs for each year.</p>
          </div>
        `,
        position: 'left',
        disableInteraction: false,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '.map-container',
        intro: `
          <div style="text-align: center;">
            <p>You will now see markers for each county that has been a top analog over the years.</p>
            <p>Markers without numbers indicate a county that was a top analog for a single year, while markers with numbers show how many years that county was a top analog.</p>
            <p>The colors of the markers represent different years, with lighter colors for earlier years and darker colors for more recent ones. If a county was a top analog for multiple years, an average color is applied.</p>
            <p><i class="fa-solid fa-arrow-pointer"></i> Zoom in or out to view all markers, and click on them to learn more.</p>
          </div>
        `,
        position: 'left',
        disableInteraction: false,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '.map-container',
        intro: `
          <div style="text-align: center;">
            <p>This slider at the bottom allows you to select a specific year and see the top analog for that year.</p>
            <p>You can click and drag the slider control to choose a year. When a year is selected, its corresponding marker will be highlighted.</p>
            <p>The play button lets you animate the sequence of top analogs year by year. Click the 1x button beside the play/pause button to change the animation speed.</p>
          </div>
        `,
        position: 'left',
        disableInteraction: false,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '.chart-toggle',
        intro: `
          <div style="text-align: center;">
            <p>When viewing the top analogs from each year, you can also display a graph of the selected climate variables over time for the target county.</p>
            <p><i class="fa-solid fa-arrow-pointer"></i> Click this button to show or hide the graph.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: false,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '#climateVariablesMenuSection',
        intro: `
          <div style="text-align: center;">
            <p>Next, choose either "Temperature Only" or "Precipitation Only" to see the top analogs for each year based on the selected climate variable.</p>
            <p>By selecting one of these options, you can view how each variable influences the top analogs and gain insights into the specific climate patterns.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: false,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '.map-container',
        intro: `
          <div style="text-align: center;">
            <p>The map will refresh to display markers representing the top analogs according to the climate variable you've chosen.</p>
            <p><i class="fa-solid fa-arrow-pointer"></i> Zoom in or out to explore all the markers, and click on them for more details about each location.</p>
          </div>
        `,
        position: 'left',
        disableInteraction: false,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '.time-scale-button-group',
        intro: `
          <div style="text-align: center;">
            <p>Let's now refine your analysis by adjusting the time frame. <i class="fa-solid fa-arrow-pointer"></i> Select "By Season" or "By Month" to focus on specific periods.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: false,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '.time-scale-options',
        intro: `
          <div style="text-align: center;">
            <p><i class="fa-solid fa-arrow-pointer"></i> Choose a season or month, and then select a year or opt to view top analogs from each year.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: false,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '.map-container',
        intro: `
          <div style="text-align: center;">
            <p>The markers on the map will update based on your selected time frame and climate variables.</p>
            <p><i class="fa-solid fa-arrow-pointer"></i> Adjust the zoom level to see all markers and click on them to get detailed information about each top analog.</p>
          </div>
        `,
        position: 'left',
        disableInteraction: false,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },      
      {
        element: '.buttonGroup',
        intro: `
          <div style="text-align: center;">
            <p>Finally, the tabs at the top of the menu allow you to switch between the map settings and methodology views.</p>
            <p><i class="fa-solid fa-arrow-pointer"></i> Click the tabs to explore these different views.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: false,
        highlightClass: 'size-wide',
        scrollTo: 'tooltip',
      },
      {
        element: '.body',
        intro: `
          <div style="text-align: center;">
            <h3>That concludes our tour!</h3>
            <p>Now you're ready to explore climate analogs for Wisconsin. Feel free to adjust the settings to your preferences, and enjoy discovering how the climate has changed over the years.</p>
            <p>If you need any help, you can restart the tour by clicking the help button <i class="fa-solid fa-circle-question"></i> in the upper right corner of the page.</p>
            <h4>Happy exploring!</h4>
          </div>
        `,
        position: 'center',
        disableInteraction: true,
        highlightClass: 'size-wide',
      },
    ],
    showStepNumbers: false,
    disableInteraction: true,
    scrollToElement: true,
    exitOnEsc: true,
    exitOnOverlayClick: true,
  });
  intro.start();
};
