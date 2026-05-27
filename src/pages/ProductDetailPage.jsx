import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Star, Package, Truck, RotateCcw, Shield } from 'lucide-react';
import ImageCarousel from '../components/Products/ImageCarousel';
import StarRating from '../components/Products/StarRating';
import { useAuth } from '../contexts/AuthContext';
import { useProductStatus } from '../contexts/ProductStatusContext';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { isPublished, toggleProduct } = useProductStatus();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://dummyjson.com/products/${id}`)
      .then(r => { if (!r.ok) throw new Error('Product not found'); return r.json(); })
      .then(data => { setProduct(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id]);

  if (loading) return <DetailSkeleton />;
  if (error || !product) return (
    <div className="empty-state">
      <span style={{ fontSize: 36 }}>😞</span>
      <h3>Product not found</h3>
      <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go back</button>
    </div>
  );

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const published = isPublished(product.id);

  return (
    <div className="detail-page animate-fade-in">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Back to Products
      </button>

      <div className="detail-layout">
        {/* Left: Image Carousel */}
        <div className="detail-images">
          <ImageCarousel images={product.images || [product.thumbnail]} />
        </div>

        {/* Right: Product Info */}
        <div className="detail-info">
          {/* Category + Brand */}
          <div className="detail-meta-top">
            <span className="detail-category">
              <Tag size={12} />
              {product.category.replace(/-/g, ' ')}
            </span>
            {product.brand && <span className="detail-brand">{product.brand}</span>}
          </div>

          <h1 className="detail-title">{product.title}</h1>

          {/* Rating */}
          <div className="detail-rating">
            <StarRating rating={product.rating} size={16} />
            <span className="review-count">({product.reviews?.length || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="detail-price-block">
            <span className="detail-price">${discountedPrice.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="detail-original">${product.price.toFixed(2)}</span>
                <span className="detail-discount badge badge-success">
                  Save {product.discountPercentage.toFixed(0)}%
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className={`stock-status ${
            product.availabilityStatus === 'In Stock' ? 'in-stock' :
            product.availabilityStatus === 'Low Stock' ? 'low-stock' : 'out-stock'
          }`}>
            <span className="stock-indicator" />
            {product.availabilityStatus}
            {product.stock > 0 && <span className="stock-num">· {product.stock} units</span>}
          </div>

          {/* Description */}
          <p className="detail-description">{product.description}</p>

          {/* Admin toggle */}
          {isAdmin && (
            <div className="admin-toggle-section">
              <span className="toggle-info">Visibility:</span>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={() => toggleProduct(product.id)}
                />
                <span className="toggle-slider" />
              </label>
              <span className={`badge ${published ? 'badge-success' : 'badge-danger'}`}>
                {published ? 'Published' : 'Hidden from users'}
              </span>
            </div>
          )}

          {/* Info Grid */}
          <div className="detail-specs">
            <InfoItem icon={Package} label="SKU" value={product.sku} />
            <InfoItem icon={Package} label="Weight" value={`${product.weight}g`} />
            <InfoItem icon={Truck} label="Shipping" value={product.shippingInformation} />
            <InfoItem icon={RotateCcw} label="Returns" value={product.returnPolicy} />
            <InfoItem icon={Shield} label="Warranty" value={product.warrantyInformation} />
            <InfoItem icon={Package} label="Min. Order" value={`${product.minimumOrderQuantity} units`} />
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="detail-tags">
              {product.tags.map(tag => (
                <span key={tag} className="badge badge-muted">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div className="reviews-section">
          <h2 className="reviews-title">Customer Reviews</h2>
          <div className="reviews-grid">
            {product.reviews.map((review, i) => (
              <div key={i} className="review-card card">
                <div className="review-header">
                  <div className="reviewer-avatar">{review.reviewerName.charAt(0)}</div>
                  <div>
                    <div className="reviewer-name">{review.reviewerName}</div>
                    <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                  </div>
                  <StarRating rating={review.rating} size={13} showValue={false} />
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="info-item">
      <Icon size={14} className="info-icon" />
      <span className="info-label">{label}:</span>
      <span className="info-value">{value}</span>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="detail-page">
      <div className="skeleton" style={{ width: 120, height: 32, borderRadius: 8, marginBottom: 20 }} />
      <div className="detail-layout">
        <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 16 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[60, 200, 80, 100, 120, 300].map((w, i) => (
            <div key={i} className="skeleton" style={{ width: w, height: 24, borderRadius: 6, animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
