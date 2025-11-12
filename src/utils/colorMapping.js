import { SPECIES_COLORS } from './constants';

export const getSpeciesColor = (species) => {
  if (!species || species.length === 0) {
    return SPECIES_COLORS.default;
  }
  
  // Get the first species name (API returns array of species URLs)
  // For now, we'll use a simple mapping based on common species
  // In a real app, you'd fetch the species data first
  const speciesName = species[0]?.name || 'Unknown';
  
  return SPECIES_COLORS[speciesName] || SPECIES_COLORS.default;
};

export const getSpeciesName = async (speciesUrl) => {
  if (!speciesUrl || speciesUrl.length === 0) return 'Unknown';
  
  try {
    const response = await fetch(speciesUrl);
    const data = await response.json();
    return data.name || 'Unknown';
  } catch (error) {
    return 'Unknown';
  }
};

