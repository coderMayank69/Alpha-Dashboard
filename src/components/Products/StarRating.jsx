import React, { memo } from 'react';

const StarRating = memo(function StarRating({ rating, size = 14, showValue = true }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const diff = rating - i;
    if (diff >= 1) return 'full';
    if (diff >= 0.5) return 'half';
    return 'empty';
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span className="stars">
        {stars.map((type, i) => (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={type === 'empty' ? 'none' : (type === 'full' ? 'currentColor' : 'url(#half)')}
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ color: type === 'empty' ? 'var(--bg-hover)' : 'hsl(38, 92%, 52%)' }}
          >
            {type === 'half' && (
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="hsl(38, 92%, 52%)" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        ))}
      </span>
      {showValue && (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
});

export default StarRating;
