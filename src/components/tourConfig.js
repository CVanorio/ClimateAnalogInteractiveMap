import introJs from 'intro.js';
import 'intro.js/introjs.css'; // Default intro.js styles
import '../App.css'; // Import your custom CSS file

export const startTour = () => {

  // Check if the user has opted out of the tutorial
  if (localStorage.getItem('dontShowTutorial') === 'true') {
    return; // Don't start the tutorial if the user opted out
  }

  const intro = introJs();
  intro.setOptions({
    steps: [
      {
        element: '.body',
        intro: `
          <div style="text-align: center;">
            <h2>How has the Climate in Wisconsin Changed Over Time?</h2>
            <p>This site is designed to help you explore and understand climate analogs. A climate analog is a location with a climate that is similar to a target location's climate at a specific point in time.</p>
            
            <p>With this interactive map, you can gain insights into climate patterns and see how your chosen location's climate stacks up against others. Explore our features and discover the climate analogs that match your county's weather!</p>
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
            <h3>Let's begin with a walkthrough of the tool and features.</h3>
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
            <p>On the left, there is a menu where you can select different data options to display.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: true,
      },
      {
        element: '#menuToggle',
        intro: `
          <div style="text-align: center;">
            <p>The arrow button allows you to show and hide the menu.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: true,
      },
      {
        element: '#target-county-selector',
        intro: `
          <div style="text-align: center;">
            <p>The target counties include all counties in Wisconsin.</p>
            <p>Click the drop-down to select the target county to analyze.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: false, // Allow interaction with this element
        highlightClass: 'size-wide',
        scrollTo: 'tooltip', // Scroll the page to the tooltip if needed
      },
      {
        element: '#TimeFrameMenuSection',
        intro: `
          <div style="text-align: center;">
            <p>Next, you can select the time period you want to investigate for the target county.</p>
            <p>The options allow you to analyze the climate conditions for your chosen target county for yearly averages, seasonal averages, and monthly averages. You are the able to pick the specific year, season and year, or month and year to look at.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: true, // Allow interaction with this element
        highlightClass: 'size-wide',
        scrollTo: 'tooltip', // Scroll the page to the tooltip if needed
      },
      {
        element: '#yearSelect',
        intro: `
          <div style="text-align: center;">
            <p>For now, we will stick with the default of data by year. The years start at 1895 and end at the current year.</p>
            <p> Click the drop down to select a year you would like to analyze.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: false, // Allow interaction with this element
        highlightClass: 'size-wide',
        scrollTo: 'tooltip', // Scroll the page to the tooltip if needed
      },
      {
        element: '#climateVariablesMenuSection',
        intro: `
          <div style="text-align: center;">
            <p>The climate variables included in this tool include precipitation and temperature. You have the option to view combined or individual climate variables.</p>
            <p>For now, we will stick with the default of combined precipitation and temperature data.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: true, // Allow interaction with this element
        highlightClass: 'size-wide',
        scrollTo: 'tooltip', // Scroll the page to the tooltip if needed
      },
      {
        element: '.map-container',
        intro: `
          <div style="text-align: center;">
            <p>On the right is the map window.</p>
            <p>The data is populated based on the options selected in the menu.</p>
          </div>
        `,
        position: 'left',
        disableInteraction: true, // Allow interaction with this element
        highlightClass: 'size-wide',
        scrollTo: 'tooltip', // Scroll the page to the tooltip if needed
      },
      {
        element: '.map-container',
        intro: `
          <div style="text-align: center;">
            <p>A map pin is added indicating the target county.</p>
            <p>Click the map pin to view details about the select target county and time frame.</p>
          </div>
        `,
        position: 'left',
        disableInteraction: false, // Allow interaction with this element
        highlightClass: 'size-wide',
        scrollTo: 'tooltip', // Scroll the page to the tooltip if needed
      },
      {
        element: '.map-container',
        intro: `
          <div style="text-align: center;">
            <p>The target county's climate variables for the chosen time period are compared to the typical climates of every other county in the contiguous U.S. and Alaska. The typical climate is defined as the average for a specific climate variable from 1991-2020.</p>
            <p>The top 50 counties with typical climates that best match the target county are highlighted on the map. A crown icon is added to the #1 match out of all the counties.</p>
            <p>Scroll or use the plus and minus controls to zoom out on the map. Click different highlighted counties or the crown icon to learn more.</p>
          </div>
        `,
        position: 'left',
        disableInteraction: false, // Allow interaction with this element
        highlightClass: 'size-wide',
        scrollTo: 'tooltip', // Scroll the page to the tooltip if needed
      },
      {
        element: '#yearSelect',
        intro: `
          <div style="text-align: center;">
            <p>To continue the tour, click the year drop down and selext the first option "Top analogs from each year".</p>
            <p>Instead of displaying the best analogs for a specific year, this will display the #1 analogs for every year in the dataset.</p>
          </div>
        `,
        position: 'left',
        disableInteraction: false, // Allow interaction with this element
        highlightClass: 'size-wide',
        scrollTo: 'tooltip', // Scroll the page to the tooltip if needed
      },
      {
        element: '.map-container',
        intro: `
          <div style="text-align: center;">
            <p>Here you will see markers for every county that has been a top analog. The markers without number correspond to analogs that have only been a top analog for a single year and markers with numbers indicate that county has been a top analog for that many years.</p>
            <p>There is a color ramp applied to the markers with lighter colors corresponding to earlier years and darker colors corresponding to more recent years. If a county was the top analog for multple years, an average of the colors for each year is applied.</p>
            <p>Zoom in or out to see all of the markers and click on a few of the markers to learn more.</p>
          </div>
        `,
        position: 'left',
        disableInteraction: false, // Allow interaction with this element
        highlightClass: 'size-wide',
        scrollTo: 'tooltip', // Scroll the page to the tooltip if needed
      },
      {
        element: '.map-container',
        intro: `
          <div style="text-align: center;">
            <p>This slider is also available at the bottom when viewing the top analogs from each year.</p>
            <p>You can click and drag the slider control to select a specific year. When a year is selected, that marker will be highlighed with a black outline.</p>
            <p>The play button allows you to start an animation that sequences through each of the markers by year. You can click the 1x button beside the play/pause button to change the speed of the animation.</p>
          </div>
        `,
        position: 'left',
        disableInteraction: false, // Allow interaction with this element
        highlightClass: 'size-wide',
        scrollTo: 'tooltip', // Scroll the page to the tooltip if needed
      },
      {
        element: '.chart-toggle',
        intro: `
          <div style="text-align: center;">
            <p>When viewing the top analogs from each year data, you have the option to show a graph of the climate variables. This plots the average of the current cliamte variables selected over the selected time frame for each year for the target county.</p>
            <p>Click the button to show or hide the chart.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: false, // Allow interaction with this element
        highlightClass: 'size-wide',
        scrollTo: 'tooltip', // Scroll the page to the tooltip if needed
      },
      {
        element: '.buttonGroup',
        intro: `
          <div style="text-align: center;">
            <p>Clicking the tabs at the top of the menu allow you to switch between the map setting and methodology views.</p>
          </div>
        `,
        position: 'right',
        disableInteraction: false, // Allow interaction with this element
        highlightClass: 'size-wide',
        scrollTo: 'tooltip', // Scroll the page to the tooltip if needed
        
      },
      
      // Other steps...
    ],
    // Optional: Adjust tour configuration to prevent tooltips from blocking interactions
    tooltipClass: 'custom-intro-tooltip',
    nextLabel: 'Next',
    prevLabel: 'Back',
    doneLabel: 'Finish',
    exitOnOverlayClick: false,
    dontShowAgain: true,
    dontShowAgainLabel: "Don't show tutorial again",
  });

  intro.start();
};