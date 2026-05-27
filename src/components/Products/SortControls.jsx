import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import './SortControls.css';

const SORT_OPTIONS = [
  { value: 'title',  label: 'Name' },
  { value: 'price',  label: 'Price' },
  { value: 'rating', label: 'Rating' },
  { value: 'stock',  label: 'Stock' },
];

export default function SortControls({ sortBy, sortOrder, onChange }) {
  const handleSort = (field) => {
    if (sortBy === field) {
      onChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onChange(field, 'asc');
    }
  };

  return (
    <div className="sort-controls">
      <span className="sort-label">Sort:</span>
      {SORT_OPTIONS.map(({ value, label }) => {
        const active = sortBy === value;
        return (
          <button
            key={value}
            className={`sort-btn ${active ? 'active' : ''}`}
            onClick={() => handleSort(value)}
          >
            {label}
            {active ? (
              sortOrder === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
            ) : (
              <ChevronsUpDown size={13} className="sort-idle-icon" />
            )}
          </button>
        );
      })}
    </div>
  );
}
