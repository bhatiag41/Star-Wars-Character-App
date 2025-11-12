import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-8 mb-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-3 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-transparent border-2 border-sw-gold rounded font-display text-sw-gold disabled:opacity-50 disabled:cursor-not-allowed disabled:border-sw-border disabled:text-sw-dim hover:bg-sw-gold hover:text-sw-void transition-all duration-300 disabled:hover:bg-transparent"
        style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 inline" />
        <span className="hidden sm:inline">PREVIOUS</span>
      </button>
      
      <div className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-lg bg-transparent border-2 border-transparent rounded font-display text-sw-deep-gold" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 500 }}>
        Page {currentPage} of {totalPages}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-transparent border-2 border-sw-gold rounded font-display text-sw-gold disabled:opacity-50 disabled:cursor-not-allowed disabled:border-sw-border disabled:text-sw-dim hover:bg-sw-gold hover:text-sw-void transition-all duration-300 disabled:hover:bg-transparent"
        style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}
      >
        <span className="hidden sm:inline">NEXT</span>
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 inline" />
      </button>
    </div>
  );
};

export default Pagination;

