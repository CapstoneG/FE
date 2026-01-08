import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements?: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalElements,
  onPageChange,
  itemLabel = 'items'
}: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 0) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        className="pagination-btn"
        onClick={handlePrevious}
        disabled={currentPage === 0}
      >
        ← Previous
      </button>
      
      <div className="pagination-info">
        {currentPage + 1} of {totalPages}
        {totalElements && ` (${totalElements} ${itemLabel})`}
      </div>

      <button 
        className="pagination-btn"
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
