export const formatHeight = (height) => {
  if (!height || height === 'unknown' || height === 'n/a' || height === 'none') return 'Unknown';
  const heightNum = parseFloat(height);
  if (isNaN(heightNum)) return 'Unknown';
  const heightInMeters = heightNum / 100;
  return `${heightInMeters.toFixed(2)}m`;
};

export const formatMass = (mass) => {
  if (!mass || mass === 'unknown' || mass === 'n/a' || mass === 'none') return 'Unknown';
  const massNum = parseFloat(mass);
  if (isNaN(massNum)) return 'Unknown';
  return `${massNum}kg`;
};

export const formatDate = (dateString) => {
  if (!dateString || dateString === 'unknown' || dateString === 'n/a') return 'Unknown';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    return 'Unknown';
  }
};

export const formatPopulation = (population) => {
  if (!population || population === 'unknown' || population === 'n/a' || population === 'none') return 'Unknown';
  const num = parseInt(population);
  if (isNaN(num)) return 'Unknown';
  return num.toLocaleString();
};

export const formatBirthYear = (birthYear) => {
  if (!birthYear || birthYear === 'unknown' || birthYear === 'n/a' || birthYear === 'none') return 'Unknown';
  return birthYear;
};

