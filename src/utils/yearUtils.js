export const getYearOptions = (timeScale, scaleValue) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are 0-based (Jan is 0, Dec is 11)
  
    // Function to determine if the current season has ended
    const hasSeasonEnded = () => {
      switch (scaleValue) {
        case 'Winter':
          return currentMonth > 2; // Winter ends in February
        case 'Spring':
          return currentMonth > 5; // Spring ends in May
        case 'Summer':
          return currentMonth > 8; // Summer ends in August
        case 'Fall':
          return currentMonth > 11; // Fall ends in November
        default:
          return false;
      }
    };
  
    // Generate year options based on the time scale and whether the season or month has ended
    if (timeScale === 'by_season' && scaleValue === 'Winter') {
      // Winter has special logic
      return Array.from({ length: currentYear - 1896 }, (_, i) => 1896 + i); // Ascending order
    } else if (timeScale === 'by_season' && hasSeasonEnded()) {
      // For seasons that have ended
      return Array.from({ length: currentYear - 1894 }, (_, i) => 1895 + i); // Ascending order
    } else if (timeScale === 'by_month') {
      // For months
      return parseInt(scaleValue, 10) <= currentMonth 
        ? Array.from({ length: currentYear - 1894 }, (_, i) => 1895 + i) // Ascending order
        : Array.from({ length: currentYear - 1895 }, (_, i) => 1895 + i); // Ascending order
    }
    
    // Default case for 'by_year'
    return Array.from({ length: currentYear - 1895 }, (_, i) => 1895 + i); // Ascending order
  };
  