# Climate Analog Interactive Map

This interactive web application allows users to explore how Wisconsin’s historical climate compares to the present-day climate across the United States. By using “climate analogs,” the app helps visualize how Wisconsin’s climate in the past matches the current climate of other locations, providing insights into climate change and variability.

> **Note:** This project is designed to work with the backend repository [ClimateAnalogDBandAPI](https://github.com/CVanorio/ClimateAnalogDBandAPI), which provides the climate data and API endpoints used by the app.

## Features

- Interactive map of the U.S. with climate analogs for Wisconsin counties
- Compare historical climate (temperature and precipitation) to present-day analogs
- Select by county, year, season, or month
- Visualize top analogs and explore climate data trends
- Detailed popups and charts for climate data
- Guided onboarding/tutorial using react-joyride

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/CVanorio/ClimateAnalogInteractiveMap.git
   cd ClimateAnalogInteractiveMap/climate-analog-react-app
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

### Running the App

1. **Start the development server:**
   ```sh
   npm start
   ```
   This will launch the app in your default browser at [http://localhost:3000](http://localhost:3000).

2. **Build for production:**
   ```sh
   npm run build
   ```
   The optimized production build will be in the `build/` directory.

### Project Structure

- `climate-analog-react-app/` – Main React app source code
  - `src/` – React components, assets, styles, and utilities
  - `public/` – Static files and HTML template
- `index.html`, `manifest.json`, `robots.txt` – App metadata and configuration

### Customization

- **Tour steps:** Edit `src/components/BackgroundIntro.js` to customize the onboarding tutorial.
- **Map and data:** Update data files in `src/data/` or map components in `src/components/map/` as needed.

### Adapting for Other States

To use this app for a different state or multiple states:
- Update the county selector in `src/components/TargetCountySelector.js` to list counties for the new state(s). If supporting multiple states, add a state selector and update the county dropdown accordingly.
- Update the state abbreviation constant in `src/utils/constants.js` (e.g., `TARGET_STATE_ABBR`). For multiple states, make this dynamic based on the selected state.
- Update any hardcoded references to "Wisconsin" in UI text, intro, and documentation.
- Update map centering and boundaries in `src/components/map/MapComponent.js` if needed.

## Contact

If you have questions about the data, methods, or how to set up this project, please reach out.

### Wisconsin State Climatology Office (WI SCO)
- Email: **stclim@aos.wisc.edu**
- Website: [https://climatology.nelson.wisc.edu/](https://climatology.nelson.wisc.edu/)

### Project Author
- Name: **Courtney Vanorio**
- Email: **courtney.vanorio@gmail.com**
- Website: [https://courtneyvanor.io](https://courtneyvanor.io)
- Role: Project author for the Climate Analog Database & API
- Notes: Please direct all initial questions to the WI SCO

---