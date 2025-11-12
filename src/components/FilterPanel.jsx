import { Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchAllHomeworlds, fetchAllFilms, fetchAllSpecies } from '../services/api';

const FilterPanel = ({ onFilterChange, filters }) => {
  const [homeworlds, setHomeworlds] = useState([]);
  const [films, setFilms] = useState([]);
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadFilters = async () => {
      setLoading(true);
      try {
        const [homeworldsData, filmsData, speciesData] = await Promise.all([
          fetchAllHomeworlds(),
          fetchAllFilms(),
          fetchAllSpecies()
        ]);
        setHomeworlds(homeworldsData);
        setFilms(filmsData);
        setSpecies(speciesData);
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilters();
  }, []);

  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value === 'all' ? null : value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      homeworld: null,
      film: null,
      species: null
    });
  };

  const hasActiveFilters = filters.homeworld || filters.film || filters.species;

  return (
    <div className="mb-4 sm:mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-transparent border-2 border-sw-gold rounded text-sw-gold font-display hover:bg-sw-gold hover:text-sw-void transition-all duration-300 mb-3 sm:mb-4"
      >
        <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>FILTERS</span> {hasActiveFilters && <span className="text-sw-amber">●</span>}
      </button>

      {isOpen && (
        <div className="bg-sw-dark border-2 border-sw-gold rounded p-3 sm:p-4 space-y-3 sm:space-y-4" style={{ backgroundColor: '#0f0f0f' }}>
          {loading ? (
            <p className="text-sw-light/80 text-sm sm:text-base font-display">LOADING FILTERS...</p>
          ) : (
            <>
              {/* Homeworld Filter */}
              <div>
                <label className="block text-sw-deep-gold font-display mb-1.5 sm:mb-2 text-sm sm:text-base">HOMEWORLD</label>
                <select
                  value={filters.homeworld || 'all'}
                  onChange={(e) => handleFilterChange('homeworld', e.target.value)}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-sw-space border border-sw-border rounded text-sw-light focus:outline-none focus:border-sw-gold focus:ring-1 focus:ring-sw-blue focus:ring-opacity-30"
                  style={{ backgroundColor: '#0A0A0A' }}
                >
                  <option value="all">All Homeworlds</option>
                  {homeworlds.map(hw => (
                    <option key={hw.url} value={hw.url}>{hw.name}</option>
                  ))}
                </select>
              </div>

              {/* Film Filter */}
              <div>
                <label className="block text-sw-deep-gold font-display mb-1.5 sm:mb-2 text-sm sm:text-base">FILM</label>
                <select
                  value={filters.film || 'all'}
                  onChange={(e) => handleFilterChange('film', e.target.value)}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-sw-space border border-sw-border rounded text-sw-light focus:outline-none focus:border-sw-gold focus:ring-1 focus:ring-sw-blue focus:ring-opacity-30"
                  style={{ backgroundColor: '#0A0A0A' }}
                >
                  <option value="all">All Films</option>
                  {films.map(film => (
                    <option key={film.url} value={film.url}>{film.title}</option>
                  ))}
                </select>
              </div>

              {/* Species Filter */}
              <div>
                <label className="block text-sw-deep-gold font-display mb-1.5 sm:mb-2 text-sm sm:text-base">SPECIES</label>
                <select
                  value={filters.species || 'all'}
                  onChange={(e) => handleFilterChange('species', e.target.value)}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-sw-space border border-sw-border rounded text-sw-light focus:outline-none focus:border-sw-gold focus:ring-1 focus:ring-sw-blue focus:ring-opacity-30"
                  style={{ backgroundColor: '#0A0A0A' }}
                >
                  <option value="all">All Species</option>
                  {species.map(s => (
                    <option key={s.url} value={s.url}>{s.name}</option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-transparent border-2 border-sw-red text-sw-red font-display font-bold rounded hover:bg-sw-red hover:text-sw-white transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                  CLEAR FILTERS
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

