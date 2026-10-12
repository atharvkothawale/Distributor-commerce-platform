import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ShoppingBag, Search, ShoppingCart, User, Heart, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Announcement Bar */}
      <div style={{ background: '#090d16', color: '#94a3b8', fontSize: '0.8rem', padding: '6px 0', borderBottom: '1px solid #1e293b' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚡ Spring Boot Microservices + React + PostgreSQL + Apache Kafka + Kubernetes</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Final Year B.Tech Project</span>
            <span style={{ color: '#f59e0b', fontWeight: 600 }}>v1.0.0 Live</span>
          </div>
        </div>
      </div>

      {/* Main Brand Header */}
      <header style={{ background: 'var(--color-bg-dark)', color: '#fff', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-md)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', gap: '24px' }}>
          
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: '#fff', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(37,99,235,0.4)' }}>
              <ShoppingBag size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>Shop<span style={{ color: '#f59e0b' }}>Nova</span></span>
              <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', fontWeight: 600 }}>Distributed Commerce</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: '640px', position: 'relative' }}>
            <div style={{ display: 'flex', background: '#ffffff', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <input
                type="text"
                placeholder="Search over 10,000+ products across electronics, fashion, home..."
                style={{ flex: 1, padding: '11px 16px', border: 'none', outline: 'none', fontSize: '0.9rem', color: '#0f172a' }}
              />
              <button style={{ background: '#f59e0b', color: '#0f172a', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* User & Cart Actions */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0', fontSize: '0.875rem' }}>
              <User size={18} />
              <span>Sign In</span>
            </Link>

            <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', background: '#1e293b', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={18} />
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#f59e0b', color: '#0f172a', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0</span>
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Cart</span>
            </Link>

            <Link to="/admin" style={{ fontSize: '0.8rem', padding: '6px 12px', background: '#3b82f6', color: '#fff', borderRadius: '6px', fontWeight: 600 }}>
              Admin Console
            </Link>
          </nav>
        </div>

        {/* Categories Bar */}
        <div style={{ background: '#1e293b', borderTop: '1px solid #334155', padding: '8px 0', fontSize: '0.85rem' }}>
          <div className="container" style={{ display: 'flex', gap: '24px', overflowX: 'auto', color: '#cbd5e1' }}>
            <Link to="/catalog" style={{ fontWeight: 600, color: '#f59e0b' }}>All Categories</Link>
            <Link to="/catalog?category=Electronics">Electronics &amp; Gadgets</Link>
            <Link to="/catalog?category=Computers">Laptops &amp; PCs</Link>
            <Link to="/catalog?category=Fashion">Apparel &amp; Fashion</Link>
            <Link to="/catalog?category=Home">Home &amp; Kitchen</Link>
            <Link to="/catalog?category=Deals" style={{ color: '#ef4444', fontWeight: 600 }}>🔥 Today's Lightning Deals</Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px 0' }}>
        <Routes>
          <Route path="/" element={<HomePlaceholder />} />
          <Route path="/catalog" element={<div className="container"><h2>Product Catalog (Connecting to Catalog Service :8082)</h2></div>} />
          <Route path="/cart" element={<div className="container"><h2>Shopping Cart</h2></div>} />
          <Route path="/login" element={<div className="container"><h2>Sign In / Register (Auth Service :8081)</h2></div>} />
          <Route path="/admin" element={<div className="container"><h2>Administrator Dashboard</h2></div>} />
        </Routes>
      </main>

      {/* Footer */}
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

function HomePlaceholder() {
  return (
    <div className="container animate-fade-in">
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '48px 40px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid #334155',
        marginBottom: '40px'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <span className="badge badge-accent" style={{ marginBottom: '16px' }}>🚀 Cloud Native Microservices</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#fff' }}>
            Enterprise Retail. <span style={{ color: '#60a5fa' }}>Distributed Scale.</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '24px' }}>
            Discover thousands of products delivered with sub-second catalog search, resilient Kafka event-driven order processing, and zero-downtime microservices.
          </p>
          <div style={{ display: 'flex', gap: '14px' }}>
            <Link to="/catalog" className="btn btn-primary">
              <Zap size={18} /> Explore Catalog
            </Link>
            <Link to="/admin" className="btn btn-outline" style={{ color: '#e2e8f0', borderColor: '#475569' }}>
              <ShieldCheck size={18} /> View Architecture
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
