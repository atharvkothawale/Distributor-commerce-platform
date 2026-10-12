import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag, Search, ShoppingCart, User, Heart, ShieldCheck, Zap,
  CheckCircle, AlertCircle, Trash2, Plus, Minus, ArrowRight, Package,
  Layers, DollarSign, Users, RefreshCw, X, LogOut, ChevronRight, Lock
} from 'lucide-react';
import api from './api';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

export default function App() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        if (res.data.success) {
          setCategories(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Academic & System Announcement Bar */}
      <div style={{ background: '#090d16', color: '#94a3b8', fontSize: '0.8rem', padding: '6px 0', borderBottom: '1px solid #1e293b' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚡ <strong>ShopNova</strong>: Spring Boot 3 Modular Monolith + React 18 + PostgreSQL + Docker</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Final Year B.Tech Computer Engineering</span>
            <span style={{ color: '#f59e0b', fontWeight: 600 }}>v1.0.0 Live</span>
          </div>
        </div>
      </div>

      {/* Main Brand Header */}
      <header style={{ background: '#0f172a', color: '#fff', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', gap: '20px' }}>
          
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: '#fff', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(37,99,235,0.4)' }}>
              <ShoppingBag size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>Shop<span style={{ color: '#f59e0b' }}>Nova</span></span>
              <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', fontWeight: 600 }}>Modular Commerce</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '600px', display: 'flex', background: '#ffffff', borderRadius: '8px', overflow: 'hidden' }}>
            <input
              type="text"
              placeholder="Search products by title, brand, or specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '10px 16px', border: 'none', outline: 'none', fontSize: '0.9rem', color: '#0f172a' }}
            />
            <button type="submit" style={{ background: '#f59e0b', color: '#0f172a', padding: '0 18px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={18} strokeWidth={2.5} />
            </button>
          </form>

          {/* Actions: User, Cart, Admin */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e2e8f0', fontSize: '0.85rem', background: '#1e293b', padding: '6px 12px', borderRadius: '6px' }}>
                  <Package size={16} />
                  <span>My Orders</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e293b', padding: '6px 12px', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}>
                  <User size={16} color="#60a5fa" />
                  <span>{user.fullName || user.email.split('@')[0]}</span>
                  <button onClick={logout} title="Sign Out" style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}>
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', background: '#2563eb', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                <User size={16} />
                <span>Sign In</span>
              </Link>
            )}

            <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', background: '#1e293b', padding: '8px 16px', borderRadius: '6px', border: '1px solid #334155', textDecoration: 'none' }}>
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={18} />
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#f59e0b', color: '#0f172a', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cart.totalItems || 0}
                </span>
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Cart</span>
            </Link>

            {isAdmin && (
              <Link to="/admin" style={{ fontSize: '0.8rem', padding: '8px 14px', background: '#8b5cf6', color: '#fff', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} /> Admin Console
              </Link>
            )}
          </nav>
        </div>

        {/* Categories Bar */}
        <div style={{ background: '#1e293b', borderTop: '1px solid #334155', padding: '8px 0', fontSize: '0.85rem' }}>
          <div className="container" style={{ display: 'flex', gap: '20px', overflowX: 'auto', color: '#cbd5e1' }}>
            <button
              onClick={() => { setSelectedCategory(''); navigate('/'); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: !selectedCategory ? '#f59e0b' : '#cbd5e1', padding: 0 }}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.slug); navigate(`/?category=${cat.slug}`); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: selectedCategory === cat.slug ? '#f59e0b' : '#cbd5e1', whiteSpace: 'nowrap', padding: 0, fontWeight: selectedCategory === cat.slug ? 700 : 500 }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main style={{ flex: 1, padding: '32px 0' }}>
        <Routes>
          <Route path="/" element={<CatalogView showToast={showToast} selectedCategory={selectedCategory} />} />
          <Route path="/cart" element={<CartView showToast={showToast} />} />
          <Route path="/checkout" element={<CheckoutView showToast={showToast} />} />
          <Route path="/orders" element={<OrdersView showToast={showToast} />} />
          <Route path="/login" element={<AuthView showToast={showToast} />} />
          <Route path="/admin" element={<AdminView showToast={showToast} />} />
        </Routes>
      </main>

      {/* Academic Footer */}
      <footer style={{ background: '#090d16', color: '#94a3b8', padding: '40px 0 24px', borderTop: '1px solid #1e293b' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '12px' }}>ShopNova Distributed Commerce</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>Production-grade, resilient e-commerce architecture built with Spring Boot microservices, Kafka event streaming, and Kubernetes deployment.</p>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '12px' }}>Engineering Team</h4>
            <p style={{ fontSize: '0.85rem' }}>11-Member Final Year Project Team</p>
            <p style={{ fontSize: '0.85rem' }}>Lead: Ayush S. Mule</p>
            <p style={{ fontSize: '0.85rem' }}>Full CI/CD &amp; Kubernetes Stack</p>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '12px' }}>Microservices</h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>• API Gateway (:8080)</li>
              <li>• Identity &amp; Auth Service (:8081)</li>
              <li>• Product Catalog &amp; Inventory (:8082)</li>
              <li>• Order &amp; Checkout Service (:8083)</li>
              <li>• Notification Service (:8084)</li>
            </ul>
          </div>
        </div>
        <div className="container" style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', textAlign: 'center', fontSize: '0.8rem' }}>
          © 2026 ShopNova Project Team. Final Year B.Tech Computer Engineering.
        </div>
      </footer>
    </div>
  );
}

// -------------------------------------------------------------
// 1. CATALOG / STOREFRONT VIEW
// -------------------------------------------------------------
function CatalogView({ showToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get('search') || '';
  const category = queryParams.get('category') || '';

  const fetchProducts = () => {
    setLoading(true);
    let url = '/products?size=24';
    if (search) url += `&keyword=${encodeURIComponent(search)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;

    api.get(url)
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.data.content || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    const result = await addToCart(product.id, 1);
    if (result.requireLogin) {
      showToast('Please sign in to add items to your cart', 'error');
      navigate('/login');
    } else if (result.success) {
      showToast(`Added "${product.name}" to cart!`);
    } else {
      showToast(result.message || 'Failed to add item', 'error');
    }
  };

  return (
    <div className="container">
      {/* Hero Banner */}
      {!search && !category && (
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '12px',
          padding: '40px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid #334155',
          marginBottom: '36px'
        }}>
          <div style={{ maxWidth: '640px' }}>
            <span style={{ background: '#3b82f6', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🚀 Spring Boot 3 + PostgreSQL Engine
            </span>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '14px 0', lineHeight: 1.2 }}>
              Enterprise Retail. <span style={{ color: '#60a5fa' }}>Demonstrated Simplicity.</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Experience smooth catalog browsing, real-time stock deduction, and secure JWT checkout backed by transactional Spring Boot APIs.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => window.scrollTo({ top: 480, behavior: 'smooth' })} style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} /> Explore Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter / Result Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            {category ? `${category.toUpperCase()} Catalog` : search ? `Search Results for "${search}"` : 'Featured Products'}
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Showing {products.length} verified products in database</span>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <p>Loading database products...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <ShoppingBag size={48} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <h3>No products found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Try clearing your search query or selecting another category.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
            >
              {/* Product Image */}
              <div style={{ height: '200px', background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(15, 23, 42, 0.85)', color: '#fff', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  {p.brand || 'ShopNova'}
                </span>
                {p.stockQuantity <= 10 && (
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: '#fff', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    Only {p.stockQuantity} left
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>
                  {p.category?.name || 'General'}
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px', lineHeight: 1.4, height: '44px', overflow: 'hidden' }}>
                  {p.name}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#f59e0b', marginBottom: '12px' }}>
                  <span>★ {p.rating?.toFixed(1) || '4.8'}</span>
                  <span style={{ color: '#94a3b8' }}>({p.reviewCount || 120} reviews)</span>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                      ${p.discountPrice ? p.discountPrice.toFixed(2) : p.price.toFixed(2)}
                    </span>
                    {p.discountPrice && (
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                        ${p.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => handleAddToCart(p, e)}
                  disabled={p.stockQuantity === 0}
                  style={{
                    background: p.stockQuantity === 0 ? '#cbd5e1' : '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: p.stockQuantity === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <ShoppingCart size={16} />
                  <span>{p.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '780px', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            <button
              onClick={() => setSelectedProduct(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '400px' }}>
              <div style={{ background: '#f8fafc', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  style={{ maxWidth: '100%', maxHeight: '340px', objectFit: 'contain', borderRadius: '8px' }}
                />
              </div>
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase' }}>
                  {selectedProduct.brand} • {selectedProduct.category?.name}
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 12px' }}>
                  {selectedProduct.name}
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>SKU: {selectedProduct.sku}</span>
                
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                  {selectedProduct.description || 'Premium retail product verified with authentic manufacturer warranty and rapid dispatch.'}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
                    ${selectedProduct.discountPrice ? selectedProduct.discountPrice.toFixed(2) : selectedProduct.price.toFixed(2)}
                  </span>
                  {selectedProduct.discountPrice && (
                    <span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.85rem', color: selectedProduct.stockQuantity > 0 ? '#10b981' : '#ef4444', fontWeight: 600, marginBottom: '24px' }}>
                  ✓ {selectedProduct.stockQuantity > 0 ? `${selectedProduct.stockQuantity} units in stock ready to ship` : 'Currently Out of Stock'}
                </div>

                <button
                  onClick={(e) => { handleAddToCart(selectedProduct, e); setSelectedProduct(null); }}
                  disabled={selectedProduct.stockQuantity === 0}
                  style={{
                    marginTop: 'auto',
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: selectedProduct.stockQuantity === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 2. SHOPPING CART VIEW
// -------------------------------------------------------------
function CartView({ showToast }) {
  const { cart, updateQuantity, removeItem, clearCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <ShoppingCart size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
        <h2>Sign in to view your cart</h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>Your shopping items are securely saved to your account in PostgreSQL.</p>
        <Link to="/login" style={{ background: '#2563eb', color: '#fff', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
          Sign In Now
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <ShoppingBag size={56} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Your Cart is Empty</h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>Explore over 12+ products in our database catalog and add them to your cart.</p>
        <Link to="/" style={{ background: '#2563eb', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Shopping Cart ({cart.totalItems} items)</h1>
        <button onClick={clearCart} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Trash2 size={16} /> Clear Cart
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Cart Line Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.items.map((item) => (
            <div key={item.id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '20px', alignItems: 'center' }}>
              <img
                src={item.productImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                alt={item.productName}
                style={{ width: '88px', height: '88px', objectFit: 'cover', borderRadius: '8px', background: '#f8fafc' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{item.productName}</h4>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>SKU: {item.productSku}</span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#2563eb', marginTop: '6px' }}>
                  ${item.price.toFixed(2)}
                </div>
              </div>

              {/* Quantity Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>
                <button
                  onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Subtotal & Delete */}
              <div style={{ textAlign: 'right', minWidth: '90px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  ${item.subtotal.toFixed(2)}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', marginTop: '4px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: '#64748b' }}>
            <span>Subtotal ({cart.totalItems} items)</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>${cart.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: '#64748b' }}>
            <span>Estimated Shipping</span>
            <span style={{ fontWeight: 600, color: cart.shipping === 0 ? '#10b981' : '#0f172a' }}>
              {cart.shipping === 0 ? 'FREE' : `$${cart.shipping.toFixed(2)}`}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.9rem', color: '#64748b' }}>
            <span>Estimated Sales Tax (8%)</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>${cart.estimatedTax.toFixed(2)}</span>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Total Amount</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2563eb' }}>${cart.total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            style={{ width: '100%', background: '#f59e0b', color: '#0f172a', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. CHECKOUT & MOCK PAYMENT VIEW
// -------------------------------------------------------------
function CheckoutView({ showToast }) {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recipientName, setRecipientName] = useState(user?.fullName || 'John Doe');
  const [recipientPhone, setRecipientPhone] = useState('+91 98765 43210');
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Green Valley Towers, Shivaji Nagar, Pune, Maharashtra 411005');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.post('/orders/checkout', {
        recipientName,
        recipientPhone,
        shippingAddress,
        paymentMethod,
        cardNumber: '4111222233334444',
        cardCvv: '123',
        cardExpiry: '12/28'
      });

      if (res.data.success) {
        setOrderComplete(res.data.data);
        fetchCart();
        showToast('Payment successful! Order confirmed.');
      } else {
        showToast(res.data.message || 'Checkout failed', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Transaction declined: check stock', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="container" style={{ maxWidth: '640px', textAlign: 'center', padding: '60px 24px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ width: '64px', height: '64px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <CheckCircle size={36} />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Order Confirmed!</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
          Your mock payment has been processed and your order has been placed in the database.
        </p>

        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', textAlign: 'left', marginBottom: '28px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#64748b' }}>Order Number:</span>
            <strong style={{ color: '#0f172a' }}>{orderComplete.orderNumber}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#64748b' }}>Payment Transaction:</span>
            <strong style={{ color: '#0f172a' }}>{orderComplete.paymentTransactionId}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#64748b' }}>Total Paid:</span>
            <strong style={{ color: '#2563eb' }}>${orderComplete.totalAmount.toFixed(2)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Shipping Address:</span>
            <strong style={{ color: '#0f172a', maxWidth: '320px', textAlign: 'right' }}>{orderComplete.shippingAddress}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/orders" style={{ background: '#2563eb', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>
            Track in My Orders
          </Link>
          <Link to="/" style={{ background: '#f1f5f9', color: '#0f172a', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '840px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>Checkout &amp; Payment</h1>

      <form onSubmit={handleCheckoutSubmit} style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '32px' }}>
        {/* Shipping & Payment Fields */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>1. Delivery Address</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Recipient Full Name</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Contact Phone</label>
              <input
                type="text"
                required
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Full Street Address</label>
              <textarea
                required
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }}
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>2. Payment Sandbox</h3>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            {['CARD', 'UPI', 'COD'].map((method) => (
              <button
                type="button"
                key={method}
                onClick={() => setPaymentMethod(method)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '6px',
                  border: paymentMethod === method ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: paymentMethod === method ? '#eff6ff' : '#fff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: paymentMethod === method ? '#2563eb' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {method === 'CARD' ? '💳 Credit/Debit' : method === 'UPI' ? '⚡ UPI App' : '💵 Cash on Delivery'}
              </button>
            ))}
          </div>

          {paymentMethod === 'CARD' && (
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Card Number (Simulated)</label>
                <input type="text" readOnly value="•••• •••• •••• 4242" style={{ width: '100%', padding: '8px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Expires</label>
                  <input type="text" readOnly value="12/28" style={{ width: '100%', padding: '8px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>CVV</label>
                  <input type="text" readOnly value="•••" style={{ width: '100%', padding: '8px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Review & Submit */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>Review Order</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {cart.items.map((i) => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                  {i.quantity}x {i.productName}
                </span>
                <span style={{ fontWeight: 600 }}>${i.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#64748b' }}>
            <span>Subtotal</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#64748b' }}>
            <span>Shipping</span>
            <span>{cart.shipping === 0 ? 'FREE' : `$${cart.shipping.toFixed(2)}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.85rem', color: '#64748b' }}>
            <span>Tax (8%)</span>
            <span>${cart.estimatedTax.toFixed(2)}</span>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb' }}>${cart.total.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px', fontWeight: 800, fontSize: '1rem', cursor: submitting ? 'wait' : 'pointer' }}
          >
            {submitting ? 'Authorizing Payment...' : `Confirm & Pay $${cart.total.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// 4. ORDER HISTORY VIEW
// -------------------------------------------------------------
function OrdersView({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    api.get('/orders')
      .then((res) => {
        if (res.data.success) {
          setOrders(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be returned to inventory.')) return;
    try {
      const res = await api.post(`/orders/${orderId}/cancel`);
      if (res.data.success) {
        showToast('Order cancelled successfully');
        fetchOrders();
      }
    } catch (err) {
      showToast('Failed to cancel order', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return { bg: '#dbeafe', color: '#1d4ed8' };
      case 'PROCESSING': return { bg: '#fef3c7', color: '#b45309' };
      case 'SHIPPED': return { bg: '#e0e7ff', color: '#4338ca' };
      case 'DELIVERED': return { bg: '#dcfce7', color: '#15803d' };
      case 'CANCELLED': return { bg: '#fee2e2', color: '#b91c1c' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <div className="container" style={{ maxWidth: '840px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>My Order History</h1>

      {loading ? (
        <p>Loading your past orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Package size={48} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <h3>No orders placed yet</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>Your completed purchases and delivery tracking will appear here.</p>
          <Link to="/" style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((o) => {
            const badge = getStatusColor(o.status);
            return (
              <div key={o.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{o.orderNumber}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Placed on {new Date(o.createdAt).toLocaleDateString()} at {new Date(o.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ background: badge.bg, color: badge.color, padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {o.status}
                    </span>
                    {o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && (
                      <button onClick={() => handleCancelOrder(o.id)} style={{ background: 'none', border: '1px solid #fca5a5', color: '#ef4444', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {o.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src={item.productImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', background: '#f8fafc' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{item.productName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>${item.subtotal.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div style={{ color: '#64748b' }}>
                    Ship To: <strong>{o.recipientName}</strong> ({o.shippingAddress})
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb' }}>
                    Total: ${o.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 5. AUTH (LOGIN / REGISTER) VIEW
// -------------------------------------------------------------
function AuthView({ showToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        const res = await register(fullName, email, password);
        if (res.success) {
          showToast('Account created successfully!');
          navigate('/');
        } else {
          showToast(res.message || 'Registration failed', 'error');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          showToast(`Welcome back, ${res.user.fullName || res.user.email}!`);
          navigate('/');
        } else {
          showToast(res.message || 'Invalid email or password', 'error');
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsRegister(false);
  };

  return (
    <div className="container" style={{ maxWidth: '440px', padding: '40px 20px' }}>
      <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
        
        {/* Toggle tabs */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px', marginBottom: '24px' }}>
          <button
            onClick={() => setIsRegister(false)}
            style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', background: !isRegister ? '#fff' : 'transparent', color: !isRegister ? '#0f172a' : '#64748b', cursor: 'pointer' }}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsRegister(true)}
            style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', background: isRegister ? '#fff' : 'transparent', color: isRegister ? '#0f172a' : '#64748b', cursor: 'pointer' }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                required
                placeholder="Prathamesh Handifode"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="customer@shopnova.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'wait' : 'pointer', marginTop: '8px' }}
          >
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast-Login Buttons for Academic Viva */}
        <div style={{ marginTop: '28px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
            Viva Fast-Fill Accounts
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => fillCredentials('customer@shopnova.com', 'Password@123')}
              style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              👤 Demo Customer
            </button>
            <button
              onClick={() => fillCredentials('admin@shopnova.com', 'Password@123')}
              style={{ background: '#f3e8ff', border: '1px solid #d8b4fe', color: '#6b21a8', padding: '8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              🛡️ Demo Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 6. ADMIN CONSOLE VIEW (ROLE_ADMIN GUARDED)
// -------------------------------------------------------------
function AdminView({ showToast }) {
  const { user, isAdmin } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'metrics'
  const [loading, setLoading] = useState(true);

  // New product form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('50');
  const [newCatId, setNewCatId] = useState('');
  const [newBrand, setNewBrand] = useState('ShopNova');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');

  if (!isAdmin) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <Lock size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <h2>Administrator Access Required</h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>Please log in with the administrator account (admin@shopnova.com) to access the operations console.</p>
        <Link to="/login" style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
          Switch Account
        </Link>
      </div>
    );
  }

  const loadAdminData = () => {
    setLoading(true);
    Promise.all([
      api.get('/admin/metrics'),
      api.get('/admin/orders?size=30'),
      api.get('/products?size=50'),
      api.get('/categories')
    ]).then(([mRes, oRes, pRes, cRes]) => {
      if (mRes.data.success) setMetrics(mRes.data.data);
      if (oRes.data.success) setOrders(oRes.data.data.content || []);
      if (pRes.data.success) setProducts(pRes.data.data.content || []);
      if (cRes.data.success) {
        setCategories(cRes.data.data);
        if (cRes.data.data.length > 0) setNewCatId(cRes.data.data[0].id);
      }
    }).catch((err) => {
      showToast('Error loading admin dashboard', 'error');
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        showToast(`Order status updated to ${newStatus}`);
        loadAdminData();
      }
    } catch (err) {
      showToast('Failed to update order status', 'error');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/products', {
        name: newTitle,
        sku: newSku,
        price: parseFloat(newPrice),
        stockQuantity: parseInt(newStock),
        categoryId: parseInt(newCatId),
        brand: newBrand,
        imageUrl: newImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
        description: newDesc,
        isFeatured: true
      });

      if (res.data.success) {
        showToast('New product created successfully!');
        setShowAddModal(false);
        loadAdminData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create product', 'error');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Deactivate this product from customer storefront?')) return;
    try {
      await api.delete(`/products/${prodId}`);
      showToast('Product deactivated');
      loadAdminData();
    } catch (err) {
      showToast('Failed to deactivate product', 'error');
    }
  };

  return (
    <div className="container">
      {/* Admin Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>Administrator Console</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Real-time database metrics, inventory management, and order fulfillment</p>
        </div>
        <button onClick={loadAdminData} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={16} /> Refresh Metrics
        </button>
      </div>

      {/* KPI Cards */}
      {metrics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Total Revenue</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>${metrics.totalRevenue.toFixed(2)}</div>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Total Orders</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>{metrics.totalOrders}</div>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Catalog Products</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{metrics.totalProducts}</div>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Registered Users</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>{metrics.totalCustomers}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{ padding: '10px 20px', border: 'none', background: 'none', fontWeight: 700, fontSize: '0.9rem', color: activeTab === 'orders' ? '#2563eb' : '#64748b', borderBottom: activeTab === 'orders' ? '2px solid #2563eb' : 'none', cursor: 'pointer' }}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          style={{ padding: '10px 20px', border: 'none', background: 'none', fontWeight: 700, fontSize: '0.9rem', color: activeTab === 'products' ? '#2563eb' : '#64748b', borderBottom: activeTab === 'products' ? '2px solid #2563eb' : 'none', cursor: 'pointer' }}
        >
          Product Inventory ({products.length})
        </button>
      </div>

      {/* Tab 1: Orders Fulfillment */}
      {activeTab === 'orders' && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Order #</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Customer</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Items</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Total</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Fulfillment Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>{o.orderNumber}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600 }}>{o.recipientName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{o.customerEmail}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>{o.items?.length || 1} line item(s)</td>
                  <td style={{ padding: '14px 16px', fontWeight: 800 }}>${o.totalAmount.toFixed(2)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, background: o.status === 'DELIVERED' ? '#dcfce7' : o.status === 'CANCELLED' ? '#fee2e2' : '#dbeafe', color: o.status === 'DELIVERED' ? '#16a34a' : o.status === 'CANCELLED' ? '#dc2626' : '#2563eb' }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 600, background: '#fff' }}
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Products Catalog Management */}
      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              onClick={() => setShowAddModal(true)}
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={18} /> Add New Product
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Product</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Category</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Price</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Stock</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={p.imageUrl} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.sku}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{p.category?.name}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>${p.price.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: p.stockQuantity < 20 ? '#ef4444' : '#0f172a' }}>
                      {p.stockQuantity} units
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, background: p.isActive ? '#dcfce7' : '#fee2e2', color: p.isActive ? '#15803d' : '#b91c1c' }}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => handleDeleteProduct(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '560px', borderRadius: '16px', padding: '28px', position: 'relative' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>Add New Product</h2>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Product Title</label>
                <input required type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>SKU Code</label>
                  <input required type="text" placeholder="GAD-XYZ-123" value={newSku} onChange={(e) => setNewSku(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Category</label>
                  <select value={newCatId} onChange={(e) => setNewCatId(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Price ($)</label>
                  <input required type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Initial Stock</label>
                  <input required type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Image URL (Unsplash or CDN)</label>
                <input type="text" placeholder="https://images.unsplash.com/..." value={newImage} onChange={(e) => setNewImage(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Description</label>
                <textarea rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              </div>

              <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, marginTop: '8px', cursor: 'pointer' }}>
                Save Product to Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
