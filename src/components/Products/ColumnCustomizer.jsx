import { useState, useRef } from 'react';
import { Columns, GripVertical, Check } from 'lucide-react';
import './ColumnCustomizer.css';

const ALL_COLUMNS = [
  { id: 'image',    label: 'Product Image' },
  { id: 'name',     label: 'Name' },
  { id: 'category', label: 'Category' },
  { id: 'price',    label: 'Price' },
  { id: 'stock',    label: 'Stock Status' },
  { id: 'rating',   label: 'Rating' },
  { id: 'status',   label: 'Published Status' },
];

export default function ColumnCustomizer({ visibleColumns, onColumnChange }) {
  const [open, setOpen] = useState(false);
  const [columns, setColumns] = useState(ALL_COLUMNS);
  const dragRef = useRef(null);

  const toggleColumn = (id) => {
    const next = visibleColumns.includes(id)
      ? visibleColumns.filter(c => c !== id)
      : [...visibleColumns, id];
    onColumnChange(next);
  };

  const handleDragStart = (e, idx) => {
    dragRef.current = idx;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (dragRef.current === idx) return;
    const newCols = [...columns];
    const dragged = newCols.splice(dragRef.current, 1)[0];
    newCols.splice(idx, 0, dragged);
    dragRef.current = idx;
    setColumns(newCols);
    const newVisible = newCols.map(c => c.id).filter(id => visibleColumns.includes(id));
    onColumnChange(newVisible);
  };

  const resetColumns = () => {
    setColumns(ALL_COLUMNS);
    onColumnChange(ALL_COLUMNS.map(c => c.id));
  };

  return (
    <div className="col-customizer">
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setOpen(o => !o)}
        id="column-customizer-btn"
        aria-label="Customize columns"
      >
        <Columns size={14} />
        Columns
      </button>

      {open && (
        <>
          <div className="col-backdrop" onClick={() => setOpen(false)} />
          <div className="col-dropdown animate-fade-in">
            <div className="col-dropdown-header">
              <span>Columns</span>
              <button className="btn btn-ghost btn-sm" onClick={resetColumns}>Reset</button>
            </div>
            <p className="col-dropdown-hint">Drag to reorder • Click to toggle</p>
            <div className="col-list">
              {columns.map((col, idx) => (
                <div
                  key={col.id}
                  className="col-item"
                  draggable
                  onDragStart={e => handleDragStart(e, idx)}
                  onDragOver={e => handleDragOver(e, idx)}
                >
                  <GripVertical size={14} className="drag-handle" />
                  <label className="col-item-label">
                    <div className={`col-check ${visibleColumns.includes(col.id) ? 'checked' : ''}`}
                      onClick={() => toggleColumn(col.id)}>
                      {visibleColumns.includes(col.id) && <Check size={10} />}
                    </div>
                    <span>{col.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
