import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

export default function Pagination({ currentPage, totalPages, totalItems, limit, onPageChange, onLimitChange }) {
  if (totalPages <= 1 && totalItems <= limit) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItems);

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing <strong>{start}–{end}</strong> of <strong>{totalItems}</strong> products
      </div>

      <div className="pagination-controls">
        <button
          className="page-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        {getPageNumbers().map((page, i) =>
          page === '...' ? (
            <span key={`dots-${i}`} className="page-dots">…</span>
          ) : (
            <button
              key={page}
              className={`page-btn page-num ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}

        <button
          className="page-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="pagination-limit">
        <label htmlFor="page-limit" className="limit-label">Per page:</label>
        <select
          id="page-limit"
          className="select limit-select"
          value={limit}
          onChange={e => onLimitChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}
