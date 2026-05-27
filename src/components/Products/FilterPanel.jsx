import { useCallback } from 'react';
import { Filter, X } from 'lucide-react';
import './FilterPanel.css';

const STOCK_OPTIONS = ['In Stock', 'Low Stock', 'Out of Stock'];
const RATING_OPTIONS = [4, 3, 2, 1];

export default function FilterPanel({ categories, selectedCategories, selectedRating, selectedStock, onChange, onClear, hasFilters }) {
  const toggleCategory = useCallback((cat) => {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter(c => c !== cat)
      : [...selectedCategories, cat];
    onChange('categories', next);
  }, [selectedCategories, onChange]);

  const toggleStock = useCallback((status) => {
    const next = selectedStock.includes(status)
      ? selectedStock.filter(s => s !== status)
      : [...selectedStock, status];
    onChange('stock', next);
  }, [selectedStock, onChange]);

  return (
    <div className="filter-panel card">
      <div className="filter-header">
        <div className="filter-title">
          <Filter size={14} />
          Filters
          {hasFilters && <span className="filter-count-badge">{
            selectedCategories.length + (selectedRating ? 1 : 0) + selectedStock.length
          }</span>}
        </div>
        {hasFilters && (
          <button className="btn btn-ghost btn-sm clear-btn" onClick={onClear}>
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="filter-section">
        <h4 className="filter-section-title">Category</h4>
        <div className="filter-chips">
          {categories.map(cat => (
            <button
              key={cat.slug}
              className={`filter-chip ${selectedCategories.includes(cat.slug) ? 'active' : ''}`}
              onClick={() => toggleCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="filter-section">
        <h4 className="filter-section-title">Min. Rating</h4>
        <div className="rating-options">
          {RATING_OPTIONS.map(r => (
            <button
              key={r}
              className={`rating-option ${selectedRating === r ? 'active' : ''}`}
              onClick={() => onChange('rating', selectedRating === r ? null : r)}
            >
              {'★'.repeat(r)}{'☆'.repeat(5 - r)}
              <span>&amp; up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div className="filter-section">
        <h4 className="filter-section-title">Stock Status</h4>
        <div className="filter-checks">
          {STOCK_OPTIONS.map(status => (
            <label key={status} className="filter-check-item">
              <input
                type="checkbox"
                checked={selectedStock.includes(status)}
                onChange={() => toggleStock(status)}
              />
              <span>{status}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
