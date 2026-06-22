import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sun, Moon, ShoppingCart, Menu, X, LogOut, User, LayoutDashboard, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const { 
    theme, toggleTheme, 
    user, logout, 
    cart, cartCount, cartTotal, updateCartQty, removeFromCart 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const handleCheckoutClick = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  const handleCartPageClick = () => {
    setCartOpen(false);
    navigate('/cart');
  };

  return (
    <>
      <header className="header" id="header">
        <div className="container nav-wrapper">
          {/* Logo */}
          <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-icon">LN</div>
            <div className="logo-text">Laxmi <span>Narsimha</span></div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav>
            <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
              <li>
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Browse Catalog</NavLink>
              </li>
              <li>
                <NavLink to="/prescription" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Upload Rx</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Contact Us</NavLink>
              </li>
              {user && user.role === 'admin' && (
                <li>
                  <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <LayoutDashboard size={16} /> Admin
                    </span>
                  </NavLink>
                </li>
              )}
              {user && (
                <li>
                  <NavLink to="/my-orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShoppingBag size={16} /> My Orders
                    </span>
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          {/* Action Buttons */}
          <div className="nav-actions">
            {/* Theme Toggle */}
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Cart Button */}
            <button className="theme-toggle" onClick={toggleCart} aria-label="Open Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }} className="user-greeting">
                  <User size={16} /> {user.name.split(' ')[0]}
                </span>
                <button className="btn-icon" onClick={handleLogout} title="Logout" style={{ backgroundColor: 'var(--danger-hover)', color: 'white' }}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle Menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Sliding Cart Side Panel */}
      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={toggleCart}></div>
      <div className={`cart-panel ${cartOpen ? 'open' : ''}`}>
        <div className="cart-panel-header">
          <h3 style={{ fontWeight: 700 }}>Your Cart</h3>
          <button onClick={toggleCart} style={{ cursor: 'pointer' }} aria-label="Close Cart">
            <X size={24} />
          </button>
        </div>

        <div className="cart-panel-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingCart size={48} />
              <p>Your shopping cart is empty.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item-card" style={{ padding: '12px 16px' }}>
                <div className="cart-item-card-info" style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{item.price.toFixed(2)} each</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="qty-controls" style={{ transform: 'scale(0.85)' }}>
                    <button className="qty-btn" onClick={() => updateCartQty(item.id, -1)}><Minus size={14} /></button>
                    <span style={{ fontSize: '0.9rem' }}>{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateCartQty(item.id, 1)}><Plus size={14} /></button>
                  </div>
                  <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-panel-footer">
            <div className="summary-row" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
              <span>Total Estimate:</span>
              <span style={{ color: 'var(--primary)' }}>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={handleCartPageClick} style={{ width: '100%' }}>
                View Cart Page
              </button>
              <button className="btn btn-primary" onClick={handleCheckoutClick} style={{ width: '100%' }}>
                Checkout Now
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
