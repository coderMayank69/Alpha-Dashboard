import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, prefix = '', color = 'accent', description }) {
  const formatted = typeof value === 'number'
    ? value > 9999
      ? `${prefix}${value.toLocaleString()}`
      : `${prefix}${Number.isInteger(value) ? value : value.toFixed(2)}`
    : value;

  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-header">
        <div className={`stat-icon ${color}`}>
          <Icon size={18} />
        </div>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">{formatted}</div>
      {description && <div className="stat-desc">{description}</div>}
    </div>
  );
}
