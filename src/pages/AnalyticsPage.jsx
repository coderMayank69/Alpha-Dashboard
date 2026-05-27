import { useState, useEffect, useMemo } from 'react';
import { Package, Star, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import StatCard from '../components/Analytics/StatCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import './AnalyticsPage.css';

const CHART_COLORS = [
  '#7c6ef2', '#22d3c5', '#3b9eff', '#f59e0b',
  '#10b981', '#ec4899', '#8b5cf6', '#06b6d4',
  '#f97316', '#84cc16', '#6366f1', '#ef4444',
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{typeof p.value === 'number' && p.value > 1000
            ? `$${p.value.toLocaleString()}`
            : p.value}
          </strong>
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=0')
      .then(r => r.json())
      .then(d => { setProducts(d.products); setLoading(false); });
  }, []);

  // Performance: useMemo for all computed analytics
  const analytics = useMemo(() => {
    if (!products.length) return null;

    const totalProducts = products.length;
    const avgRating = products.reduce((s, p) => s + p.rating, 0) / totalProducts;
    const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
    const outOfStock = products.filter(p => p.stock === 0).length;

    // Category distribution
    const catMap = {};
    products.forEach(p => {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    });
    const categoryData = Object.entries(catMap)
      .map(([name, count]) => ({ name: name.replace(/-/g, ' '), count }))
      .sort((a, b) => b.count - a.count);

    // Rating distribution
    const ratingDist = [1, 2, 3, 4, 5].map(r => ({
      rating: `${r}★`,
      count: products.filter(p => Math.floor(p.rating) === r).length,
    }));

    // Price distribution
    const priceBuckets = [
      { range: '$0-25', min: 0, max: 25 },
      { range: '$25-100', min: 25, max: 100 },
      { range: '$100-500', min: 100, max: 500 },
      { range: '$500-1000', min: 500, max: 1000 },
      { range: '$1000+', min: 1000, max: Infinity },
    ].map(b => ({
      ...b,
      count: products.filter(p => p.price >= b.min && p.price < b.max).length,
    }));

    // Top category values
    const catValueMap = {};
    products.forEach(p => {
      catValueMap[p.category] = (catValueMap[p.category] || 0) + p.price * p.stock;
    });
    const topCategoryValue = Object.entries(catValueMap)
      .map(([name, value]) => ({ name: name.replace(/-/g, ' '), value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    return { totalProducts, avgRating, totalValue, outOfStock, categoryData, ratingDist, priceBuckets, topCategoryValue };
  }, [products]);

  if (loading) return <AnalyticsSkeleton />;
  if (!analytics) return null;

  return (
    <div className="analytics-page animate-fade-in">
      <div className="analytics-header">
        <h1 className="analytics-title">Analytics</h1>
        <p className="analytics-sub">Insights across {analytics.totalProducts} products</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          icon={Package}
          label="Total Products"
          value={analytics.totalProducts}
          color="accent"
          description="Products in inventory"
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={analytics.avgRating}
          color="warning"
          description="Across all products"
        />
        <StatCard
          icon={DollarSign}
          label="Inventory Value"
          value={analytics.totalValue}
          prefix="$"
          color="success"
          description="Total stock × price"
        />
        <StatCard
          icon={AlertTriangle}
          label="Out of Stock"
          value={analytics.outOfStock}
          color="danger"
          description="Products needing restock"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid-2">
        {/* Category Distribution */}
        <div className="chart-card card">
          <h2 className="chart-title">Products by Category</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.categoryData.slice(0, 12)} margin={{ top: 4, right: 8, left: -8, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  angle={-40}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Products" radius={[4, 4, 0, 0]}>
                  {analytics.categoryData.slice(0, 12).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="chart-card card">
          <h2 className="chart-title">Rating Distribution</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.ratingDist} margin={{ top: 4, right: 8, left: -8, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="rating" tick={{ fill: 'var(--text-muted)', fontSize: 13 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Products" radius={[4, 4, 0, 0]} fill="hsl(38, 92%, 52%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-grid-2">
        {/* Price Distribution */}
        <div className="chart-card card">
          <h2 className="chart-title">Price Range Distribution</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analytics.priceBuckets} margin={{ top: 4, right: 8, left: -8, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Products" radius={[4, 4, 0, 0]} fill="var(--accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Value by Category */}
        <div className="chart-card card">
          <h2 className="chart-title">Top Inventory Value by Category</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={analytics.topCategoryValue}
                layout="vertical"
                margin={{ top: 4, right: 12, left: 60, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Value ($)" radius={[0, 4, 4, 0]}>
                  {analytics.topCategoryValue.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="analytics-page">
      <div className="skeleton" style={{ width: 160, height: 32, borderRadius: 8, marginBottom: 8 }} />
      <div className="stats-grid">
        {[0,1,2,3].map(i => (
          <div key={i} className="skeleton" style={{ height: 110, borderRadius: 12, animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
      <div className="charts-grid-2">
        <div className="skeleton" style={{ height: 340, borderRadius: 12 }} />
        <div className="skeleton" style={{ height: 340, borderRadius: 12 }} />
      </div>
    </div>
  );
}
