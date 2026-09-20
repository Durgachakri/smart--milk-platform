import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Milk, 
  PauseCircle, 
  PlayCircle, 
  CalendarDays, 
  MapPin, 
  Repeat, 
  IndianRupee, 
  PackageCheck, 
  PlusCircle,
  Truck,
  Trash2
} from 'lucide-react';
import API from '../../api/axiosInstance';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchSubscriptions = async () => {
    try {
      const res = await API.get('/subscriptions/my');
      setSubscriptions(res.data);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    setUpdatingId(id);
    try {
      await API.patch(`/subscriptions/${id}/status`, { status: nextStatus });
      setSubscriptions(prev =>
        prev.map(sub => (sub.id === id ? { ...sub, status: nextStatus } : sub))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteSubscription = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to cancel and delete the subscription for "${name}"?`);
    if (!confirmDelete) return;

    setUpdatingId(id);
    try {
      await API.delete(`/subscriptions/${id}`);
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      alert(`Subscription for ${name} removed.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete subscription.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics calculation
  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const estimatedMonthlySpend = subscriptions
    .filter(s => s.status === 'active')
    .reduce((total, s) => total + (parseFloat(s.price || 0) * parseInt(s.quantity, 10) * 30), 0);

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>My Active Subscriptions</h2>
          <p>Manage daily deliveries, pause schedules, or cancel subscriptions</p>
        </div>
        <NavLink to="/catalog" className="btn btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <PlusCircle size={16} /> Explore More Products
        </NavLink>
      </div>

      {/* Top Overview Cards */}
      <div className="sub-stats-grid">
        <div className="sub-stat-card">
          <div className="sub-stat-icon">
            <PackageCheck size={24} />
          </div>
          <div className="sub-stat-info">
            <h4>Active Plans</h4>
            <p>{activeCount} Item{activeCount !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="sub-stat-card">
          <div className="sub-stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
            <Truck size={24} />
          </div>
          <div className="sub-stat-info">
            <h4>Next Delivery</h4>
            <p>{activeCount > 0 ? 'Tomorrow 7:00 AM' : 'No Active Delivery'}</p>
          </div>
        </div>

        <div className="sub-stat-card">
          <div className="sub-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <IndianRupee size={24} />
          </div>
          <div className="sub-stat-info">
            <h4>Est. Monthly Total</h4>
            <p>₹{estimatedMonthlySpend.toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      {loading ? (
        <p>Loading your subscriptions...</p>
      ) : subscriptions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Milk size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3>No Active Subscriptions</h3>
          <p style={{ color: '#64748b', maxWidth: 400, margin: '0.5rem auto 1.5rem' }}>
            Get farm-fresh milk and morning dairy delivered automatically to your doorstep.
          </p>
          <NavLink to="/catalog" className="btn">
            Browse Product Catalog
          </NavLink>
        </div>
      ) : (
        <div>
          {subscriptions.map((sub) => {
            const isActive = sub.status === 'active';

            return (
              <div key={sub.id} className="sub-card">
                {/* Product Image preview */}
                <div className="sub-card-img-wrap">
                  <img
                    src={sub.image_url || '/images/Buffalo_milk.png'}
                    alt={sub.product_name}
                    className="sub-card-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500';
                    }}
                  />
                </div>

                {/* Subscription Details */}
                <div className="sub-card-details">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className={`status-badge ${isActive ? 'status-active' : 'status-paused'}`}>
                      {isActive ? '● Active' : '⏸ Paused'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Plan #{sub.id}</span>
                  </div>

                  <h3>{sub.product_name}</h3>

                  <div className="sub-specs-row">
                    <span className="sub-spec-item">
                      <Milk size={15} color="#2563eb" />
                      <strong>{sub.quantity} × {sub.unit}</strong> daily
                    </span>

                    <span className="sub-spec-item">
                      <Repeat size={15} color="#64748b" />
                      Frequency: <strong style={{ textTransform: 'capitalize' }}>{sub.frequency}</strong>
                    </span>

                    <span className="sub-spec-item">
                      <IndianRupee size={15} color="#16a34a" />
                      ₹{sub.price} / unit
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} /> {sub.address_line1}, {sub.area_zone}
                  </p>
                </div>

                {/* Actions: Modify, Pause/Resume, Delete */}
                <div className="sub-card-actions">
                  <NavLink 
                    to={`/calendar?subId=${sub.id}`} 
                    className="btn btn-secondary btn-sm" 
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <CalendarDays size={15} /> Modify Dates
                  </NavLink>

                  <button
                    className={`btn btn-sm ${isActive ? 'btn-danger' : 'btn'}`}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={() => handleToggleStatus(sub.id, sub.status)}
                    disabled={updatingId === sub.id}
                  >
                    {isActive ? (
                      <><PauseCircle size={15} /> Pause Plan</>
                    ) : (
                      <><PlayCircle size={15} /> Resume Plan</>
                    )}
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '6px',
                      color: '#dc2626',
                      borderColor: '#fecaca',
                      background: '#fff'
                    }}
                    onClick={() => handleDeleteSubscription(sub.id, sub.product_name)}
                    disabled={updatingId === sub.id}
                  >
                    <Trash2 size={15} /> Delete Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;