import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { API_URL } from '../config';
import { Search, SlidersHorizontal, Check, RefreshCw, Eye } from 'lucide-react';
import ProductImage from '../components/ProductImage';

const Shop = () => {
  const { addToCart, showToast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for database products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Sidebar Height calculation to prevent clipping in all scroll positions
  const [sidebarMaxHeight, setSidebarMaxHeight] = useState('none');
  const catalogLayoutRef = useRef(null);

  useEffect(() => {
    const updateSidebarHeight = () => {
      if (window.innerWidth <= 1024) {
        setSidebarMaxHeight('none');
        return;
      }
      if (!catalogLayoutRef.current) return;
      const rect = catalogLayoutRef.current.getBoundingClientRect();
      const top = Math.max(100, rect.top);
      // Height fits inside the viewport (viewport height - current top relative to viewport - bottom padding/margin)
      const calculatedHeight = window.innerHeight - top - 40;
      setSidebarMaxHeight(`${Math.max(250, calculatedHeight)}px`);
    };

    window.addEventListener('scroll', updateSidebarHeight, { passive: true });
    window.addEventListener('resize', updateSidebarHeight);
    updateSidebarHeight();

    return () => {
      window.removeEventListener('scroll', updateSidebarHeight);
      window.removeEventListener('resize', updateSidebarHeight);
    };
  }, []);

  // Filter States
  const selectedCategory = searchParams.get('category') || 'all';
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'Rx' | 'OTC'
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Suggestions derived state
  const suggestions = (searchQuery.trim().length > 1 && products.length > 0)
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      showToast("Could not load products. Server is offline.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  // Handle clicking outside suggestions to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedType('all');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrand('all');
    setSearchParams({});
    showToast('Filters reset successfully.', 'info');
  };

  // Get unique brands list for filter option
  const uniqueBrands = ['all', ...new Set(products.map(p => p.brand).filter(Boolean))];

  // Apply filters client-side for immediate visual updates
  const filteredProducts = products.filter(prod => {
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesType = selectedType === 'all' || prod.type === selectedType;
    const matchesBrand = selectedBrand === 'all' || prod.brand === selectedBrand;
    
    const matchesSearch = searchQuery.trim() === '' || 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      prod.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.brand && prod.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMinPrice = minPrice === '' || prod.price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || prod.price <= parseFloat(maxPrice);

    return matchesCategory && matchesType && matchesBrand && matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  const handleSuggestionClick = (name) => {
    setSearchQuery(name);
    setShowSuggestions(false);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2>Medicine & Healthcare Catalog</h2>
          <p>Browse through high-quality healthcare formulations, OTC medicines, wellness vitamins, and daily essentials.</p>
        </div>

        <div className="catalog-layout" ref={catalogLayoutRef}>
          {/* --- SIDEBAR FILTERS --- */}
          <aside className="glass-card filter-sidebar" style={{ textAlign: 'left', maxHeight: sidebarMaxHeight }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 700 }}>
                <SlidersHorizontal size={18} /> Filters
              </h3>
              <button 
                onClick={handleResetFilters} 
                style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <RefreshCw size={12} /> Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="filter-section">
              <h4 className="filter-title">Category</h4>
              <div className="category-list">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'medicines', label: 'Medicines' },
                  { id: 'wellness', label: 'Wellness & Nutrition' },
                  { id: 'personal-care', label: 'Personal Care' },
                  { id: 'baby-care', label: 'Baby Care' }
                ].map(cat => (
                  <div 
                    key={cat.id} 
                    className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => {
                      setSearchParams(cat.id === 'all' ? {} : { category: cat.id });
                    }}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <Check size={14} color="var(--primary)" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Product Type Filter */}
            <div className="filter-section">
              <h4 className="filter-title">Product Type</h4>
              <div className="category-list">
                {[
                  { id: 'all', label: 'All Types' },
                  { id: 'Rx', label: 'Prescription (Rx)' },
                  { id: 'OTC', label: 'Over-The-Counter (OTC)' }
                ].map(typeOpt => (
                  <div 
                    key={typeOpt.id} 
                    className={`category-item ${selectedType === typeOpt.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedType(typeOpt.id);
                    }}
                  >
                    <span>{typeOpt.label}</span>
                    {selectedType === typeOpt.id && <Check size={14} color="var(--primary)" />}
                  </div>
                ))}
              </div>
            </div>



            {/* Brand Filter */}
            <div className="filter-section">
              <h4 className="filter-title">Brand / Manufacturer</h4>
              <select 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)' }}
              >
                {uniqueBrands.map(b => (
                  <option key={b} value={b}>{b === 'all' ? 'All Brands' : b}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="filter-section">
              <h4 className="filter-title">Price Range (₹)</h4>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice} 
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)' }}
                />
                <span style={{ color: 'var(--text-muted)' }}>-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)' }}
                />
              </div>
            </div>
          </aside>

          {/* --- CATALOG RESULTS --- */}
          <main>
            {/* Search Toolbar */}
            <div className="catalog-toolbar">
              <div className="search-box-wrapper" ref={suggestionRef}>
                <div className="search-box">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search medicines, vitamins, brands, ingredients..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                  />
                </div>
                {/* Suggestions list */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.map(item => (
                      <div 
                        key={item.id} 
                        className="suggestion-item" 
                        onClick={() => handleSuggestionClick(item.name)}
                      >
                        {item.name} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({item.brand})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Catalog Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ 
                  border: '4px solid var(--border)', 
                  borderTop: '4px solid var(--primary)', 
                  borderRadius: '50%', 
                  width: '50px', 
                  height: '50px', 
                  animation: 'spin 1s linear infinite', 
                  margin: '0 auto' 
                }}></div>
                <p style={{ marginTop: '20px', color: 'var(--text-muted)', fontWeight: 500 }}>Loading pharmacy products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <SlidersHorizontal size={48} style={{ opacity: 0.4, marginBottom: '20px' }} />
                <h3>No Products Found</h3>
                <p style={{ marginTop: '8px' }}>We couldn't find any items matching your selected criteria. Try adjusting your filters or search terms.</p>
                <button className="btn btn-primary" onClick={handleResetFilters} style={{ marginTop: '20px' }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div>
                <p style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', fontWeight: 500 }}>
                  Showing {filteredProducts.length} health products
                </p>
                <div className="products-grid">
                  {filteredProducts.map(prod => (
                    <div key={prod.id} className="glass-card product-card">
                      <div className="product-badge badge-otc" style={{ textTransform: 'capitalize' }}>
                        {prod.category.replace('-', ' ')}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                        <ProductImage category={prod.category} type={prod.type} name={prod.name} size={110} imgUrl={prod.image} />
                      </div>
                      <h3>{prod.name}</h3>
                      <p className="product-desc">{prod.desc}</p>
                      <div className="product-meta">
                        <span className="product-price">₹{prod.price.toFixed(2)}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link 
                            to={`/product/${prod.id}`} 
                            className="btn-icon" 
                            style={{ backgroundColor: 'var(--bg-surface-secondary)', color: 'var(--text-muted)', width: '38px', height: '38px' }}
                            title="View Details"
                          >
                            <Eye size={18} />
                          </Link>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '8px 14px', fontSize: '0.85rem' }} 
                            onClick={() => addToCart(prod)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
