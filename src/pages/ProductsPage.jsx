import { useState, useEffect, useMemo, useCallback } from 'react';
import { LayoutGrid, List, RefreshCw, Radio } from 'lucide-react';
import ProductTable from '../components/Products/ProductTable';
import ProductGrid from '../components/Products/ProductGrid';
import SearchBar from '../components/Products/SearchBar';
import SortControls from '../components/Products/SortControls';
import FilterPanel from '../components/Products/FilterPanel';
import Pagination from '../components/Products/Pagination';
import ColumnCustomizer from '../components/Products/ColumnCustomizer';
import { useDebounce } from '../hooks/useDebounce';
import { useURLState } from '../hooks/useURLState';
import { usePolling } from '../hooks/usePolling';
import { useAuth } from '../contexts/AuthContext';
import { useProductStatus } from '../contexts/ProductStatusContext';
import './ProductsPage.css';

const DEFAULT_COLUMNS = ['image', 'name', 'category', 'price', 'stock', 'rating', 'status'];

export default function ProductsPage() {
  const { isAdmin } = useAuth();
  const { isPublished } = useProductStatus();
  const { getParam, getArrayParam, getNumberParam, setParam, setParams, clearParams } = useURLState();

  // --- URL-synced state ---
  const searchRaw    = getParam('q', '');
  const categories   = getArrayParam('category');
  const sortBy       = getParam('sort', 'title');
  const sortOrder    = getParam('order', 'asc');
  const minRating    = getNumberParam('rating', 0) || null;
  const stockFilter  = getArrayParam('stock');
  const page         = getNumberParam('page', 1);
  const limit        = getNumberParam('limit', 20);

  // --- Local state ---
  const [searchInput, setSearchInput] = useState(searchRaw);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS);

  // Performance: debounced search (300ms)
  const debouncedSearch = useDebounce(searchInput, 300);

  // Sync debounced search → URL
  useEffect(() => {
    setParam('q', debouncedSearch);
  }, [debouncedSearch]);

  // Sync URL search → local input on mount
  useEffect(() => {
    setSearchInput(searchRaw);
  }, []);

  // --- Fetch all products ---
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('https://dummyjson.com/products?limit=0');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setAllProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('https://dummyjson.com/products/categories');
      const data = await res.json();
      setAllCategories(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Polling (bonus feature)
  const { isPolling, togglePolling, secondsAgo } = usePolling(fetchProducts, 30000);

  // --- Performance: useMemo for filtering & sorting ---
  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Role-based: users only see published
    if (!isAdmin) {
      products = products.filter(p => isPublished(p.id));
    }

    // Search
    const q = debouncedSearch.toLowerCase().trim();
    if (q) {
      products = products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Category filter (multi)
    if (categories.length > 0) {
      products = products.filter(p => categories.includes(p.category));
    }

    // Rating filter
    if (minRating) {
      products = products.filter(p => p.rating >= minRating);
    }

    // Stock filter
    if (stockFilter.length > 0) {
      products = products.filter(p => stockFilter.includes(p.availabilityStatus));
    }

    // Sort
    products.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return products;
  }, [allProducts, debouncedSearch, categories, sortBy, sortOrder, minRating, stockFilter, isAdmin, isPublished]);

  // Pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / limit);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredProducts.slice(start, start + limit);
  }, [filteredProducts, page, limit]);

  // --- useCallback handlers ---
  const handleSearchChange = useCallback((val) => {
    setSearchInput(val);
    setParam('page', 1);
  }, [setParam]);

  const handleSortChange = useCallback((field, order) => {
    setParams({ sort: field, order, page: 1 });
  }, [setParams]);

  const handleFilterChange = useCallback((key, value) => {
    if (key === 'categories') setParams({ category: value, page: 1 });
    if (key === 'rating')     setParams({ rating: value || '', page: 1 });
    if (key === 'stock')      setParams({ stock: value, page: 1 });
  }, [setParams]);

  const handleClearFilters = useCallback(() => {
    clearParams();
    setSearchInput('');
  }, [clearParams]);

  const handlePageChange = useCallback((p) => setParam('page', p), [setParam]);
  const handleLimitChange = useCallback((l) => setParams({ limit: l, page: 1 }), [setParams]);

  const hasFilters = !!(debouncedSearch || categories.length || minRating || stockFilter.length);

  // --- Loading skeleton ---
  if (loading) return <ProductsSkeleton />;
  if (error) return (
    <div className="empty-state">
      <span style={{ fontSize: 36 }}>⚠️</span>
      <h3>Failed to load products</h3>
      <p>{error}</p>
      <button className="btn btn-primary" onClick={fetchProducts}>Retry</button>
    </div>
  );

  return (
    <div className="products-page animate-fade-in">
      {/* Header */}
      <div className="products-header">
        <div>
          <h1 className="products-title">Products</h1>
          <p className="products-count">
            {filteredProducts.length.toLocaleString()} product{filteredProducts.length !== 1 ? 's' : ''}
            {hasFilters && <span className="filtered-hint"> (filtered)</span>}
          </p>
        </div>
        <div className="header-actions">
          {/* Live polling toggle */}
          <button
            className={`live-btn ${isPolling ? 'active' : ''}`}
            onClick={togglePolling}
            title={isPolling ? `Live — last updated ${secondsAgo}s ago` : 'Enable live updates'}
          >
            <span className={`live-dot ${isPolling ? 'pulsing' : ''}`} />
            {isPolling ? `LIVE · ${secondsAgo}s` : 'LIVE'}
          </button>

          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              aria-label="Table view"
            >
              <List size={15} />
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
          </div>

          {viewMode === 'table' && (
            <ColumnCustomizer
              visibleColumns={visibleColumns}
              onColumnChange={setVisibleColumns}
            />
          )}
        </div>
      </div>

      <div className="products-layout">
        {/* Sidebar Filters */}
        <aside className="filter-sidebar">
          <FilterPanel
            categories={allCategories}
            selectedCategories={categories}
            selectedRating={minRating}
            selectedStock={stockFilter}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            hasFilters={hasFilters}
          />
        </aside>

        {/* Main content */}
        <div className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <SearchBar value={searchInput} onChange={handleSearchChange} />
            <SortControls
              sortBy={sortBy}
              sortOrder={sortOrder}
              onChange={handleSortChange}
            />
          </div>

          {/* Results */}
          {paginatedProducts.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: 36 }}>🔍</span>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters.</p>
              {hasFilters && (
                <button className="btn btn-secondary" onClick={handleClearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          ) : viewMode === 'table' ? (
            <ProductTable
              products={paginatedProducts}
              visibleColumns={visibleColumns}
              onColumnChange={setVisibleColumns}
            />
          ) : (
            <ProductGrid products={paginatedProducts} />
          )}

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="products-page">
      <div className="products-header">
        <div className="skeleton" style={{ width: 120, height: 28, borderRadius: 6 }} />
        <div className="skeleton" style={{ width: 200, height: 34, borderRadius: 8 }} />
      </div>
      <div className="products-layout">
        <div className="filter-sidebar">
          <div className="skeleton" style={{ height: 400, borderRadius: 12 }} />
        </div>
        <div className="products-main">
          <div className="skeleton" style={{ height: 42, borderRadius: 8, marginBottom: 16 }} />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 60, borderRadius: 8, marginBottom: 4, animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
