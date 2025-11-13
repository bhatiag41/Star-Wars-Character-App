import { SPECIES_COLORS } from '../utils/constants';
import { useCharacterMetadata } from '../hooks/useCharacterMetadata';
import { useMemo } from 'react';

const CharacterCard = ({ character, onClick }) => {
  const { homeworld, species, loading: metadataLoading } = useCharacterMetadata(character);
  
  const nameFontSize = useMemo(() => {
    const nameLength = character.name.length;
    if (nameLength <= 12) return 'text-xl';
    if (nameLength <= 16) return 'text-lg';
    if (nameLength <= 20) return 'text-base';
    return 'text-sm';
  }, [character.name]);
  
  const getCharacterImageUrl = (characterName) => {
    if (!characterName) {
      return 'https://picsum.photos/400/500';
    }
    
    const seed = characterName
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return `https://picsum.photos/seed/${seed}/400/500`;
  };

  const imageUrl = getCharacterImageUrl(character.name);

  const getSpeciesColors = () => {
    if (metadataLoading) {
      return SPECIES_COLORS.default;
    }
    
    if (species.length > 0 && species[0] && species[0].name) {
      const speciesName = species[0].name;
      
      if (SPECIES_COLORS[speciesName]) {
        return SPECIES_COLORS[speciesName];
      }
      
      const speciesKey = Object.keys(SPECIES_COLORS).find(
        key => key.toLowerCase() === speciesName.toLowerCase()
      );
      if (speciesKey) {
        return SPECIES_COLORS[speciesKey];
      }
    }
    return SPECIES_COLORS.default;
  };

  const colors = getSpeciesColors();

  return (
    <div
      onClick={onClick}
      className={`${colors.bg} ${colors.border} border-2 rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 group relative flex flex-col ${colors.glow === 'shadow-glow-red' ? 'hover:shadow-glow-red' : colors.glow === 'shadow-glow-orange' ? 'hover:shadow-glow-orange' : 'hover:shadow-glow-gold'}`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-sw-gold/30 to-transparent animate-scan"></div>
      </div>

      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={character.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const seed = character.name
              .split('')
              .reduce((acc, char) => acc + char.charCodeAt(0), 0);
            e.target.src = `https://picsum.photos/seed/${seed}/400/500`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>

      <div className="p-4 relative z-10 flex flex-col flex-1 min-h-[120px]">
        <h3 className={`${nameFontSize} font-display font-bold text-sw-gold mb-2 text-center min-h-[3rem] flex items-center justify-center px-1 leading-tight`}>
          ★ {character.name.toUpperCase()} ★
        </h3>
        <div className="space-y-1 text-sm mt-auto">
          <p className="truncate">
            <span className="text-sw-dim font-display">SPECIES:</span>{' '}
            {metadataLoading ? (
              <span className="text-sw-dim">LOADING...</span>
            ) : species.length > 0 ? (
              <span className="text-sw-light">{species.map(s => s.name).join(', ').toUpperCase()}</span>
            ) : (
              <span className="text-sw-dim">UNKNOWN</span>
            )}
          </p>
          <p className="truncate">
            <span className="text-sw-dim font-display">HOMEWORLD:</span>{' '}
            {metadataLoading ? (
              <span className="text-sw-dim">LOADING...</span>
            ) : homeworld ? (
              <span className="text-sw-light">{homeworld.name.toUpperCase()}</span>
            ) : (
              <span className="text-sw-dim">UNKNOWN</span>
            )}
          </p>
        </div>
      </div>

      <div className="absolute top-2 left-2 text-sw-gold text-xl font-bold opacity-50">⌜</div>
      <div className="absolute top-2 right-2 text-sw-gold text-xl font-bold opacity-50">⌝</div>
      <div className="absolute bottom-2 left-2 text-sw-gold text-xl font-bold opacity-50">⌞</div>
      <div className="absolute bottom-2 right-2 text-sw-gold text-xl font-bold opacity-50">⌟</div>
    </div>
  );
};

export default CharacterCard;

