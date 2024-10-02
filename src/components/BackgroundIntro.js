import introJs from 'intro.js';
import 'intro.js/introjs.css'; // Default intro.js styles
import '../App.css'; // Import your custom CSS file
import '@fortawesome/fontawesome-free/css/all.min.css';

export const startIntro = () => {

    introJs().setOption("tooltipPosition", "top");
    
    const intro = introJs();
    intro.setOptions({
        steps: [
            {
                element: '.body', // Ensure this class exists in your HTML
                intro: `
                    <div style="text-align: left;">
                        <h2>How Does Wisconsin’s Historical Climate Compare to the Rest of the United States?</h2>

<p>
    Climate change is affecting our world, and understanding how Wisconsin’s climate has changed over time helps us predict what might happen in the future.
</p>

<p>
    Imagine being able to experience what Wisconsin’s climate was like in the past. While we can’t travel back in time, our tool uses “climate analogs”—places that had similar weather in different time periods—to show how Wisconsin’s climate compares to other locations today. This helps us see long-term changes and patterns in the climate.
</p>

<h3>How It Works</h3>

<p>
    Our tool compares Wisconsin’s past climate to today’s climate in other places across the U.S. For example:
</p>

<ul>
 <li>
    In January 1904, Dane County, Wisconsin was colder and drier than it is today. The climate of central North Dakota now is the closest match to what Dane County’s climate was like back then. This helps show how different the weather used to be.
</li>
<li>
    In September 2019, Dane County was warmer and wetter than usual. Today, the climate of western North Carolina is the closest match to what Dane County’s climate was like at that time. This gives a clearer idea of how much the weather had changed.
</li>


</ul>

<p>
    This approach helps show how Wisconsin’s climate has shifted over time, making it easier to understand today’s climate. You can use your own experiences with the current climate to better interpret the past data.
</p>

<h3>Explore Wisconsin’s Climate History</h3>

<p>
    Our tool provides several ways to explore the data:
</p>

<ul>
    <li>
        <strong>Historical Climate Comparisons:</strong> Discover times when Wisconsin had a climate similar to what other locations experience today. This lets you see how the climate has changed over time.
    </li>
    <li>
        <strong>Climate Over Time:</strong> Track changes in temperature and precipitation from 1895 to the present. Interactive maps and graphs make it easy to spot trends and understand their importance.
    </li>
    <li>
        <strong>Customized Analyses:</strong> Focus on specific years or weather factors you’re interested in. Look at data averages for different years, seasons, or months, and explore the information in a way that is most impactful for you.
    </li>
</ul>

<h3>Why It Matters</h3>

<p>
    Understanding these climate comparisons is important for seeing how climate changes have impacted different areas over time. It helps us make informed decisions about how to deal with current and future climate challenges. By looking at the past, we can learn more about climate change and find ways to address the challenges ahead.
</p>
<p>
    This tool supports the Wisconsin State Climatology Office’s goal of providing useful climate information for everyone in Wisconsin. It makes it easier to explore and understand Wisconsin’s climate history.
</p>







                        <h3>Further Reading</h3>
                        <p><i>link to article and/or additional methodology page?</i></p>
                        <br></br>

                        <h6>Credits</h6>
                        <p style="font-size: 14px;">This app was created by Courtney Vanorio through the <a href="https://nelson.wisc.edu/">Nelson Institute for Environmental Studies</a> at the <a href="https://www.wisc.edu/">University of Wisconsin-Madison</a> in collaboration with the <a href="https://climatology.nelson.wisc.edu/">Wisconsin State Climatology Office</a>.</p>


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
