import { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { useCharacters } from './hooks/useCharacters';
import { useDebounce } from './hooks/useDebounce';
import CharacterCard from './components/CharacterCard';
import CharacterModal from './components/CharacterModal';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import Pagination from './components/Pagination';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import LoginForm from './components/Auth/LoginForm';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import StarField from './components/StarField';
import { LogOut } from 'lucide-react';

const Header = () => {
  const { logout, user } = useAuth();

  const titleText = "STAR WARS";
  const titleLetters = titleText.split('');

  return (
    <header className="sticky top-0 z-40 mb-4 sm:mb-8" style={{
      background: 'linear-gradient(180deg, #000000 0%, #0A0A0A 100%)',
      borderBottom: '1px solid #FFE81F',
      boxShadow: '0 4px 20px rgba(255, 232, 31, 0.1)',
      height: '80px',
    }}>
      <div className="container mx-auto px-4 sm:px-8 h-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 h-full">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sw-gold text-2xl sm:text-3xl font-bold">⌜</span>
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-sw-gold tracking-wider animate-header-appear" style={{
                letterSpacing: '0.1em',
                textShadow: '0 0 20px rgba(255, 232, 31, 0.6)',
              }}>
                <span className="text-lg sm:text-xl">★</span>{' '}
                {titleLetters.map((letter, index) => (
                  <span
                    key={index}
                    className="inline-block"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      animation: 'letterAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                      opacity: 0,
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
                {' '}<span className="text-lg sm:text-xl">★</span>
              </h1>
              <span className="text-xs sm:text-sm font-body text-sw-deep-gold tracking-widest mt-0.5" style={{
                letterSpacing: '0.2em',
                fontFamily: 'Rajdhani, sans-serif',
              }}>
                DATABANK
              </span>
            </div>
            <span className="text-sw-gold text-2xl sm:text-3xl font-bold">⌝</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {user && (
              <div className="text-sw-deep-gold text-xs sm:text-sm font-body" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                <span className="text-sw-dim">USER:</span>{' '}
                <span className="text-sw-gold">{user.username.toUpperCase()}</span>
              </div>
            )}
            <button
              onClick={logout}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-transparent border border-sw-gold text-sw-gold text-xs sm:text-sm font-display font-bold rounded hover:bg-sw-gold hover:text-sw-void transition-all duration-300 flex items-center gap-1 sm:gap-2"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">LOGOUT</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const CharacterList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    homeworld: null,
    film: null,
    species: null
  });
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const { characters, loading, error, totalPages } = useCharacters(currentPage);

  const filteredCharacters = useMemo(() => {
    let filtered = characters;

    if (debouncedSearch) {
      filtered = filtered.filter(char =>
        char.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (filters.homeworld) {
      filtered = filtered.filter(char => char.homeworld === filters.homeworld);
    }

    if (filters.film) {
      filtered = filtered.filter(char => 
        char.films && char.films.includes(filters.film)
      );
    }

    if (filters.species) {
      filtered = filtered.filter(char => 
        char.species && char.species.includes(filters.species)
      );
    }

    return filtered;
  }, [characters, debouncedSearch, filters]);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <Header />

      <div className="mb-4 sm:mb-8 space-y-3 sm:space-y-4">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-start md:items-center">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
        />
      </div>

      {!loading && !error && (
        <div className="mb-3 sm:mb-4 text-sw-light text-sm sm:text-base font-display">
          Showing {filteredCharacters.length} character{filteredCharacters.length !== 1 ? 's' : ''}
          {debouncedSearch && ` matching "${debouncedSearch}"`}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} onRetry={handleRetry} />}

      {!loading && !error && filteredCharacters.length === 0 && (
        <div className="text-center py-16">
          <p className="text-2xl font-display text-sw-red mb-2">NO CHARACTERS FOUND</p>
          <p className="text-sw-light font-display">Try adjusting your search or filters</p>
        </div>
      )}

      {!loading && !error && filteredCharacters.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-8">
            {filteredCharacters.map((character) => (
              <CharacterCard
                key={character.url}
                character={character}
                onClick={() => setSelectedCharacter(character.url)}
              />
            ))}
          </div>

          {!debouncedSearch && !filters.homeworld && !filters.film && !filters.species && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {selectedCharacter && (
        <CharacterModal
          characterUrl={selectedCharacter}
          isOpen={!!selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <StarField />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CharacterList />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

