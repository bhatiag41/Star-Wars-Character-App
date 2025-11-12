import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Search characters..." }) => {
  return (
    <div className="relative w-full max-w-full sm:max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-sw-gold" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 text-sm sm:text-base bg-sw-dark border border-sw-border rounded text-sw-light placeholder-sw-dim focus:outline-none focus:border-sw-gold focus:ring-1 focus:ring-sw-blue focus:ring-opacity-30 transition-all duration-300"
        style={{ backgroundColor: '#0f0f0f' }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 text-sw-gold hover:text-sw-red transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

