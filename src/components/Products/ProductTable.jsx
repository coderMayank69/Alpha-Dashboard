import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import StarRating from './StarRating';
import { useProductStatus } from '../../contexts/ProductStatusContext';
import { useAuth } from '../../contexts/AuthContext';
import './ProductTable.css';

function StockBadge({ status }) {
  const map = {
    'In Stock':    { cls: 'badge-success', label: 'In Stock' },
    'Low Stock':   { cls: 'badge-warning', label: 'Low Stock' },
    'Out of Stock':{ cls: 'badge-danger',  label: 'Out of Stock' },
  };
  const { cls, label } = map[status] || { cls: 'badge-muted', label: status };
  return <span className={`badge ${cls}`}>{label}</span>;
}

function CategoryBadge({ category }) {
  return (
    <span className="category-badge">
      {category.replace(/-/g, ' ')}
    </span>
  );
}

const ProductRow = memo(function ProductRow({ product, visibleColumns, onToggle, isAdmin }) {
  const navigate = useNavigate();
  const { isPublished } = useProductStatus();
  const published = isPublished(product.id);

  return (
    <tr
      className={`product-row ${!published && isAdmin ? 'hidden-product' : ''}`}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {visibleColumns.includes('image') && (
        <td className="col-image">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="product-thumb"
            loading="lazy"
          />
        </td>
      )}
      {visibleColumns.includes('name') && (
        <td className="col-name">
          <div className="product-name-cell">
            <span className="product-name">{product.title}</span>
            <span className="product-brand">{product.brand || '—'}</span>
          </div>
        </td>
      )}
      {visibleColumns.includes('category') && (
        <td className="col-category">
          <CategoryBadge category={product.category} />
        </td>
      )}
      {visibleColumns.includes('price') && (
        <td className="col-price">
          <div className="price-cell">
            <span className="price">${product.price.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="discount">-{product.discountPercentage.toFixed(0)}%</span>
            )}
          </div>
        </td>
      )}
      {visibleColumns.includes('stock') && (
        <td className="col-stock">
          <StockBadge status={product.availabilityStatus} />
        </td>
      )}
      {visibleColumns.includes('rating') && (
        <td className="col-rating">
          <StarRating rating={product.rating} size={13} />
        </td>
      )}
      {visibleColumns.includes('status') && isAdmin && (
        <td className="col-status" onClick={e => e.stopPropagation()}>
          <div className="status-cell">
            <label className="toggle" title={published ? 'Hide from users' : 'Show to users'}>
              <input
                type="checkbox"
                checked={published}
                onChange={() => onToggle(product.id)}
              />
              <span className="toggle-slider" />
            </label>
            <span className="status-label">{published ? 'Published' : 'Hidden'}</span>
          </div>
        </td>
      )}
    </tr>
  );
});

const COLUMN_DEFS = [
  { id: 'image',    label: 'Image' },
  { id: 'name',     label: 'Name' },
  { id: 'category', label: 'Category' },
  { id: 'price',    label: 'Price' },
  { id: 'stock',    label: 'Stock' },
  { id: 'rating',   label: 'Rating' },
  { id: 'status',   label: 'Status' },
];

export default function ProductTable({ products, visibleColumns, onColumnToggle, onColumnReorder }) {
  const { toggleProduct } = useProductStatus();
  const { isAdmin } = useAuth();

  const shownCols = isAdmin ? visibleColumns : visibleColumns.filter(c => c !== 'status');

  return (
    <div className="table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            {COLUMN_DEFS.filter(c => shownCols.includes(c.id)).map(col => (
              <th key={col.id} className={`col-${col.id}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <ProductRow
              key={product.id}
              product={product}
              visibleColumns={shownCols}
              onToggle={toggleProduct}
              isAdmin={isAdmin}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
