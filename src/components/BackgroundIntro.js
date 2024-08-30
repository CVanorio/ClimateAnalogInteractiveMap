import introJs from 'intro.js';
import 'intro.js/introjs.css'; // Default intro.js styles
import '../App.css'; // Import your custom CSS file
import '@fortawesome/fontawesome-free/css/all.min.css';

export const startIntro = () => {
    const intro = introJs();
    intro.setOptions({
        steps: [
            {
                element: '.body', // Ensure this class exists in your HTML
                intro: `
                    <div style="text-align: left;">
                        <h2>How Does Wisconsin’s Historical Climate Compare to the Rest of the United States?</h2>
<h2>How Has Wisconsin’s Climate Evolved Over Time?</h2> <p>Climate change is reshaping our world, and understanding how Wisconsin’s climate has shifted over time is key to anticipating future trends. While we can’t literally travel through time, our tool offers a unique way to explore how Wisconsin’s climate history compares to climates across the U.S.</p> <p>Imagine if we could revisit different eras to experience Wisconsin’s climate firsthand. Although time travel isn’t possible, our tool utilizes climate analog mapping to offer insights into how Wisconsin’s historical climate compares to that of other regions. This technique identifies past climates in other locations that resemble Wisconsin’s climate at various points in history, helping us understand long-term climate shifts.</p> <h3>How It Works</h3> <p>Our tool compares Wisconsin’s historical climate data with climates from other locations to find “climate analogs”—regions that experienced similar climatic conditions during different historical periods. For example:</p> <ul> <li>If you’re curious about how Wisconsin’s climate in the 1950s compares to today’s conditions in different U.S. regions, the tool will identify locations with similar climates from that era.</li> </ul> <p>This comparative approach provides valuable context for how Wisconsin’s climate has changed over time and helps us understand current trends.</p> <h3>Explore Wisconsin’s Climate History</h3> <p>Our tool features several engaging options for exploring Wisconsin’s climate history:</p> <ul> <li><strong>Historical Climate Analog Mapping:</strong> Discover past periods when other locations had climates similar to what Wisconsin experiences today. This feature allows you to visualize how historical climates compare with current conditions.</li> <li><strong>Interactive Data Visualization:</strong> Examine changes in key climate factors such as temperature and rainfall over time. Interactive charts and graphs make it easy to see these changes and their significance.</li> <li><strong>Customized Analyses:</strong> Focus on specific years or climate factors that interest you. Tailor your exploration to delve deeper into the data based on your preferences.</li> </ul> <p>By offering this historical perspective, the tool helps you understand how Wisconsin’s climate has evolved and reveals how certain historical periods in Wisconsin might compare to regions experiencing significant climate changes today.</p> <h3>Why It Matters</h3> <p>Understanding historical climate analogs is crucial for seeing how climate changes have affected different regions over time. This knowledge aids in making informed decisions about adapting to current climate conditions and preparing for future changes. Reflecting on the past allows us to gain insights into the effects of climate change and work towards effective solutions for future challenges.</p>



                        <h3>Further Reading</h3>
                        <p>link to article?</p>

                        <h5>Credits</h5>
                        <p>This app was created by Courtney Vanorio through the <a href="https://nelson.wisc.edu/">Nelson Institute for Environmental Studies</a> at the <a href="https://www.wisc.edu/">University of Wisconsin-Madison</a> in collaboration with the <a href="https://climatology.nelson.wisc.edu/">Wisconsin State Climatology Office</a>.</p>


                    </div>
                `,
                position: 'center',
                disableInteraction: true,
                highlightClass: 'size-wide', // Ensure this CSS class is defined
            },
            {
                element: '.body', // Again, ensure this class exists
                intro: `
                    <div style="text-align: center;">
                        <h2>Next</h2>
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
