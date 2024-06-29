import React from 'react';

const counties = [
  "Adams", "Ashland", "Barron", "Bayfield", "Brown", "Buffalo", "Burnett",
  "Calumet", "Chippewa", "Clark", "Columbia", "Crawford", "Dane", "Dodge",
  "Door", "Douglas", "Dunn", "Eau Claire", "Florence", "Fond du Lac",
  "Forest", "Grant", "Green", "Green Lake", "Iowa", "Iron", "Jackson",
  "Jefferson", "Juneau", "Kenosha", "Kewaunee", "La Crosse", "Lafayette",
  "Langlade", "Lincoln", "Manitowoc", "Marathon", "Marinette", "Marquette",
  "Menominee", "Milwaukee", "Monroe", "Oconto", "Oneida", "Outagamie",
  "Ozaukee", "Pepin", "Pierce", "Polk", "Portage", "Price", "Racine",
  "Richland", "Rock", "Rusk", "Sauk", "Sawyer", "Shawano", "Sheboygan",
  "St. Croix", "Taylor", "Trempealeau", "Vernon", "Vilas", "Walworth", 
  "Washburn", "Washington", "Waukesha", "Waupaca", "Waushara", "Winnebago", "Wood"
];

const TargetCountySelector = ({ selectedCounty, onSelectCounty }) => {
  return (
    <select value={selectedCounty} onChange={(e) => onSelectCounty(e.target.value)}>
      <option value="">Select a county</option>
      {counties.map((county) => (
        <option key={county} value={county}>
          {county}
        </option>
      ))}
    </select>
  );
};

export default TargetCountySelector;
