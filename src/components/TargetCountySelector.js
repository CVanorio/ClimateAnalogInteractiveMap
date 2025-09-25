import React from 'react';

const counties = [
  "Adams County", "Ashland County", "Barron County", "Bayfield County", "Brown County", "Buffalo County", "Burnett County",
  "Calumet County", "Chippewa County", "Clark County", "Columbia County", "Crawford County", "Dane County", "Dodge County",
  "Door County", "Douglas County", "Dunn County", "Eau Claire County", "Florence County", "Fond du Lac County",
  "Forest County", "Grant County", "Green County", "Green Lake County", "Iowa County", "Iron County", "Jackson County",
  "Jefferson County", "Juneau County", "Kenosha County", "Kewaunee County", "La Crosse County", "Lafayette County",
  "Langlade County", "Lincoln County", "Manitowoc County", "Marathon County", "Marinette County", "Marquette County",
  "Menominee County", "Milwaukee County", "Monroe County", "Oconto County", "Oneida County", "Outagamie County",
  "Ozaukee County", "Pepin County", "Pierce County", "Polk County", "Portage County", "Price County", "Racine County",
  "Richland County", "Rock County", "Rusk County", "Sauk County", "Sawyer County", "Shawano County", "Sheboygan County",
  "St. Croix County", "Taylor County", "Trempealeau County", "Vernon County", "Vilas County", "Walworth County",
  "Washburn County", "Washington County", "Waukesha County", "Waupaca County", "Waushara County", "Winnebago County", "Wood County"
];

const states = [
  { code: 47, name: "WI" }
];

const TargetCountySelector = ({ selectedCounty, onSelectCounty, selectedState, onSelectState }) => {
  return (
    <div className="target-county-options">
      {/* County selector */}
      <select
        id="target-county-selector"
        value={selectedCounty}
        onChange={(e) => onSelectCounty(e.target.value)}
      >
        <option className='selectPrompt' value="">-Select a county-</option>
        {counties.map((county) => {
          const countyName = county.replace(" County", "");
          return (
            <option key={county} value={county}>
              {countyName}
            </option>
          );
        })}
      </select>

      {/* State selector (hidden, defaults to WI / 47) */}
      <select
        id="target-state-selector"
        value={selectedState || states[0].code}
        onChange={(e) => onSelectState && onSelectState(e.target.value)}
        style={{ display: "none" }} // hide from view
      >
        {states.map((state) => (
          <option key={state.code} value={state.code}>
            {state.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TargetCountySelector;
