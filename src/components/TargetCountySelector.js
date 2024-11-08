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

const TargetCountySelector = ({ selectedCounty, onSelectCounty }) => {
  return (
    <div className="target-county-options">
      <select id="target-county-selector" value={selectedCounty} onChange={(e) => onSelectCounty(e.target.value)}>
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
    </div>
  );
};

export default TargetCountySelector;
