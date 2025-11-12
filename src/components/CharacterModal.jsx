import { X } from 'lucide-react';
import { useCharacterDetails } from '../hooks/useCharacterDetails';
import { formatHeight, formatMass, formatDate, formatPopulation, formatBirthYear } from '../utils/formatters';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const CharacterModal = ({ characterUrl, isOpen, onClose }) => {
  const { character, homeworld, species, loading, error } = useCharacterDetails(characterUrl);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Generate random image using character name as seed
  const getCharacterImageUrl = (characterName) => {
    if (!characterName) {
      return 'https://picsum.photos/400/500';
    }
    
    const seed = characterName
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return `https://picsum.photos/seed/${seed}/400/500`;
  };

  const imageUrl = character?.name ? getCharacterImageUrl(character.name) : 'https://picsum.photos/400/500';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-sw-space border-2 border-sw-gold rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col relative animate-slide-up overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        {/* Header - Fixed, no scrollbar */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0 z-10 relative" style={{
          background: 'linear-gradient(90deg, #FFE81F 0%, #D4AF37 50%, #FFA500 100%)',
          height: '60px',
        }}>
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-sw-void relative z-10" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
            ═══ {character?.name?.toUpperCase() || 'LOADING'} ═══
          </h2>
          <button
            onClick={onClose}
            className="text-sw-void hover:text-sw-red transition-colors relative z-10" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content - Scrollable area */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          
          {character && !loading && !error && (
            <div className="space-y-6">
              {/* Image and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:items-start">
                <div className="relative w-full">
                  <img
                    src={imageUrl}
                    alt={character.name}
                    className="w-full h-64 md:h-auto md:min-h-[300px] object-cover rounded border-2 border-sw-gold"
                    onError={(e) => {
                      // Fallback if image fails
                      const seed = character.name
                        .split('')
                        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                      e.target.src = `https://picsum.photos/seed/${seed}/400/500`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded pointer-events-none"></div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-4 rounded border border-sw-border" style={{ backgroundColor: '#0f0f0f' }}>
                    <p className="text-sw-deep-gold font-display mb-1">HEIGHT</p>
                    <p className="text-sw-light text-xl font-bold">{formatHeight(character.height)}</p>
                  </div>
                  
                  <div className="p-4 rounded border border-sw-border" style={{ backgroundColor: '#0f0f0f' }}>
                    <p className="text-sw-deep-gold font-display mb-1">MASS</p>
                    <p className="text-sw-light text-xl font-bold">{formatMass(character.mass)}</p>
                  </div>
                  
                  <div className="p-4 rounded border border-sw-border" style={{ backgroundColor: '#0f0f0f' }}>
                    <p className="text-sw-deep-gold font-display mb-1">BIRTH YEAR</p>
                    <p className="text-sw-light text-xl font-bold">{formatBirthYear(character.birth_year)}</p>
                  </div>
                  
                  <div className="p-4 rounded border border-sw-border" style={{ backgroundColor: '#0f0f0f' }}>
                    <p className="text-sw-deep-gold font-display mb-1">FILMS</p>
                    <p className="text-sw-light text-xl font-bold">{character.films?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* Date Added */}
              <div className="p-4 rounded border border-sw-border" style={{ backgroundColor: '#0f0f0f' }}>
                <p className="text-sw-deep-gold font-display mb-1">DATE ADDED</p>
                <p className="text-sw-light text-xl font-bold">{formatDate(character.created)}</p>
              </div>

              {/* Homeworld */}
              {homeworld && (
                <div className="p-4 rounded border border-sw-border" style={{ backgroundColor: '#0f0f0f' }}>
                  <h3 className="text-sw-gold font-display text-lg mb-3 border-b border-sw-border pb-2" style={{ borderBottomColor: '#333333' }}>
                    ┌─ HOMEWORLD DATA ──────────────┐
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-sw-deep-gold">Name:</span> <span className="text-sw-light">{homeworld.name}</span></p>
                    <p><span className="text-sw-deep-gold">Terrain:</span> <span className="text-sw-light">{homeworld.terrain || 'Unknown'}</span></p>
                    <p><span className="text-sw-deep-gold">Climate:</span> <span className="text-sw-light">{homeworld.climate || 'Unknown'}</span></p>
                    <p><span className="text-sw-deep-gold">Population:</span> <span className="text-sw-light">{formatPopulation(homeworld.population)}</span></p>
                  </div>
                  <p className="text-sw-dim mt-2">└────────────────────────────────┘</p>
                </div>
              )}

              {/* Species */}
              {species.length > 0 && (
                <div className="p-4 rounded border border-sw-border" style={{ backgroundColor: '#0f0f0f' }}>
                  <p className="text-sw-deep-gold font-display mb-1">SPECIES</p>
                  <p className="text-sw-light text-xl font-bold">{species.map(s => s.name).join(', ')}</p>
                </div>
              )}

              {/* Close Button */}
              <div className="pt-4 flex justify-center">
                <button
                  onClick={onClose}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-transparent border-2 border-sw-gold text-sw-gold text-sm sm:text-base font-display font-bold rounded hover:bg-sw-gold hover:text-sw-void transition-all duration-300"
                >
                  CLOSE TRANSMISSION
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;

