import { useState, useEffect } from 'react';
import { fetchCharacterDetails, fetchHomeworld, fetchSpecies } from '../services/api';

export const useCharacterDetails = (characterUrl) => {
  const [character, setCharacter] = useState(null);
  const [homeworld, setHomeworld] = useState(null);
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when URL changes
    setCharacter(null);
    setHomeworld(null);
    setSpecies([]);
    setError(null);

    if (!characterUrl) {
      setLoading(false);
      return;
    }

    const loadCharacterDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch character data
        const charData = await fetchCharacterDetails(characterUrl);
        setCharacter(charData);

        // Fetch homeworld and species in parallel
        const [hwData, speciesData] = await Promise.all([
          // Fetch homeworld if valid
          charData.homeworld && 
          typeof charData.homeworld === 'string' && 
          charData.homeworld.startsWith('http') &&
          charData.homeworld !== 'unknown' &&
          charData.homeworld !== 'n/a'
            ? fetchHomeworld(charData.homeworld)
            : Promise.resolve(null),
          
          // Fetch species - empty array means Human per SWAPI docs
          charData.species && Array.isArray(charData.species) && charData.species.length > 0
            ? fetchSpecies(charData.species)
            : Promise.resolve([])
        ]);

        setHomeworld(hwData);
        
        // According to SWAPI: empty species array = Human
        if (speciesData.length === 0 && (!charData.species || charData.species.length === 0)) {
          setSpecies([{ name: 'Human', url: null }]);
        } else {
          setSpecies(speciesData);
        }
      } catch (err) {
        setError(err.message || 'Failed to load character details');
        // Set defaults on error
        setHomeworld(null);
        setSpecies([]);
      } finally {
        setLoading(false);
      }
    };

    loadCharacterDetails();
  }, [characterUrl]);

  return { character, homeworld, species, loading, error };
};

