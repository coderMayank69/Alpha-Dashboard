import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ value, onChange }) {
  const handleClear = useCallback(() => onChange(''), [onChange]);

  return (
    <div className="search-bar">
      <Search size={16} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Search products..."
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Search products"
        id="search-input"
      />
      {value && (
        <button className="search-clear btn-icon" onClick={handleClear} aria-label="Clear search">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
