import { useState, useEffect } from 'react';
import { fetchHomeworld, fetchSpecies } from '../services/api';

export const useCharacterMetadata = (character) => {
  const [homeworld, setHomeworld] = useState(null);
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset state when character changes
    setHomeworld(null);
    setSpecies([]);
    setLoading(true);

    if (!character || !character.url) {
      setLoading(false);
      return;
    }

    const loadMetadata = async () => {
      try {
        // Fetch homeworld and species in parallel for better performance
        const [hwData, speciesData] = await Promise.all([
          // Fetch homeworld if valid URL
          character.homeworld && 
          typeof character.homeworld === 'string' && 
          character.homeworld.startsWith('http') &&
          character.homeworld !== 'unknown' &&
          character.homeworld !== 'n/a'
            ? fetchHomeworld(character.homeworld)
            : Promise.resolve(null),
          
          // Fetch species - if empty array, default to Human
          character.species && Array.isArray(character.species) && character.species.length > 0
            ? fetchSpecies(character.species)
            : Promise.resolve([])
        ]);

        setHomeworld(hwData);
        
        // According to SWAPI docs: empty species array means Human
        if (speciesData.length === 0 && (!character.species || character.species.length === 0)) {
          // Default to Human when species array is empty
          setSpecies([{ name: 'Human', url: null }]);
        } else {
          setSpecies(speciesData);
        }
      } catch (error) {
        console.error('Error loading character metadata:', error);
        // Set defaults on error
        setHomeworld(null);
        // Default to Human if species fetch fails
        if (!character.species || character.species.length === 0) {
          setSpecies([{ name: 'Human', url: null }]);
        } else {
          setSpecies([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character?.url]);

  return { homeworld, species, loading };
};

