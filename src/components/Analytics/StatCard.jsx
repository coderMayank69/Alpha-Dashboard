import React, { memo, useEffect, useState } from 'react';
import './StatCard.css';

function countUp(target, duration = 1500, isFloat = false) {
  return { target, duration, isFloat };
}

const StatCard = memo(function StatCard({ icon: Icon, label, value, prefix = '', suffix = '', color = 'accent', description }) {
  const [displayVal, setDisplayVal] = useState(0);
  const isFloat = !Number.isInteger(value);

  useEffect(() => {
    let start = null;
    const duration = 1200;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      setDisplayVal(eased * value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  const colorMap = {
    accent:  { bg: 'var(--accent-dim)',   icon: 'var(--accent)' },
    success: { bg: 'var(--success-dim)',  icon: 'var(--success)' },
    warning: { bg: 'var(--warning-dim)',  icon: 'var(--warning)' },
    info:    { bg: 'var(--info-dim)',     icon: 'var(--info)' },
    danger:  { bg: 'var(--danger-dim)',   icon: 'var(--danger)' },
  };
  const colors = colorMap[color] || colorMap.accent;

  const formattedVal = isFloat
    ? displayVal.toFixed(2)
    : Math.round(displayVal).toLocaleString();

  return (
    <div className="stat-card card animate-fade-in">
      <div className="stat-header">
        <div className="stat-icon" style={{ background: colors.bg, color: colors.icon }}>
          <Icon size={18} />
        </div>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">
        {prefix}{formattedVal}{suffix}
      </div>
      {description && <p className="stat-description">{description}</p>}
    </div>
  );
});

export default StatCard;
