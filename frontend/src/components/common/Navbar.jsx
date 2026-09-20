import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Milk, 
  ShoppingBag, 
  CalendarDays, 
  LayoutDashboard, 
  Truck, 
  LogOut, 
  LogIn,
  ClipboardList 
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  // Calculate total item count across cart
  const totalCartCount = (cart || []).reduce((total, item) => total + (item.quantity || 0), 0);

  // Dynamic home destination depending on session role
  const brandDestination = user 
    ? (user.user?.role === 'customer' 
        ? '/catalog' 
        : user.user?.role === 'admin' 
        ? '/admin' 
        : '/delivery')
    : '/login';

  return (
    <nav className="navbar">
      {/* Brand / Logo */}
      <NavLink 
        to={brandDestination} 
        className="brand" 
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Milk color="#1e40af" size={24} />
        <span>SmartMilk</span>
      </NavLink>

      {user ? (
        <div className="nav-links">
          {/* Customer Navigation */}
          {user.user?.role === 'customer' && (
            <>
              <NavLink 
                to="/catalog" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ShoppingBag size={16} /> Catalog
              </NavLink>

              <NavLink 
                to="/subscriptions" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Milk size={16} /> Subscriptions
              </NavLink>

              <NavLink 
                to="/calendar" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <CalendarDays size={16} /> Delivery Calendar
              </NavLink>

              <NavLink 
                to="/orders" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ClipboardList size={16} /> My Orders
              </NavLink>

              {/* Cart Button with Count Badge */}
              <NavLink 
                to="/checkout" 
                className="btn btn-secondary btn-sm" 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}
              >
                <ShoppingBag size={16} /> Cart
                {totalCartCount > 0 && (
                  <span 
                    style={{ 
                      background: '#16a34a', 
                      color: '#ffffff', 
                      borderRadius: '10px', 
                      padding: '1px 6px', 
                      fontSize: '0.72rem', 
                      fontWeight: 800 
                    }}
                  >
                    {totalCartCount}
                  </span>
                )}
              </NavLink>
            </>
          )}

          {/* Admin Navigation */}
          {user.user?.role === 'admin' && (
            <NavLink 
              to="/admin" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
          )}

          {/* Delivery Partner Navigation */}
          {user.user?.role === 'delivery_partner' && (
            <NavLink 
              to="/delivery" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Truck size={16} /> Deliveries
            </NavLink>
          )}

          {/* User Details & Logout */}
          <div className="user-badge">
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.user?.name}</span>
            <span className="user-tag">{user.user?.role}</span>
            <button
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => { logout(); navigate('/login'); }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      ) : (
        /* Guest / Signed-Out Navigation */
        <div className="nav-links">
          <NavLink 
            to="/login" 
            className="btn btn-sm" 
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <LogIn size={14} /> Sign In
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;