import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import { useProductStatus } from '../../contexts/ProductStatusContext';
import { useAuth } from '../../contexts/AuthContext';
import './ProductGrid.css';

const ProductCard = memo(function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isPublished, toggleProduct } = useProductStatus();
  const { isAdmin } = useAuth();
  const published = isPublished(product.id);

  return (
    <div
      className={`product-card ${!published && isAdmin ? 'hidden-card' : ''}`}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="card-img-wrap">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="card-img"
          loading="lazy"
        />
        <span className="card-category">{product.category.replace(/-/g, ' ')}</span>
        {isAdmin && (
          <button
            className={`card-publish-btn ${published ? 'published' : 'hidden'}`}
            onClick={e => { e.stopPropagation(); toggleProduct(product.id); }}
            title={published ? 'Hide from users' : 'Publish'}
          >
            {published ? '● Published' : '○ Hidden'}
          </button>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{product.title}</h3>
        <div className="card-meta">
          <div className="card-price">
            <span className="price">${product.price.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="original-price">
                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
              </span>
            )}
          </div>
          <StarRating rating={product.rating} size={12} showValue={false} />
        </div>
        <div className="card-footer">
          <span className={`stock-dot ${
            product.availabilityStatus === 'In Stock' ? 'in-stock' :
            product.availabilityStatus === 'Low Stock' ? 'low-stock' : 'out-stock'
          }`} />
          <span className="stock-text">{product.availabilityStatus}</span>
          {product.stock <= 10 && product.stock > 0 && (
            <span className="stock-count">Only {product.stock} left</span>
          )}
        </div>
      </div>
    </div>
  );
});

export default function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
