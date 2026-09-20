import React, { useState, useEffect } from 'react';
import { Package, Users, Plus, Edit2, Trash2, X, CheckCircle2, CalendarDays } from 'lucide-react';
import API from '../../api/axiosInstance';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status confirmation popup state
  const [confirmedPopup, setConfirmedPopup] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'milk',
    unit: '500 ml',
    price: '',
    description: '',
    image_url: '/images/Buffalo_milk.png'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, subRes] = await Promise.all([
        API.get('/products'),
        API.get('/orders/admin/all'),
        API.get('/admin/subscriptions')
      ]);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
      setSubscriptions(subRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update regular delivery order status
  const handleUpdateOrderStatus = async (orderId, newStatus, order) => {
    try {
      await API.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setConfirmedPopup({
        title: 'Order Status Updated!',
        message: `Order #${order.order_number} set to ${newStatus.toUpperCase()}.`
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  // Update subscription status (Active / Paused / Cancelled)
  const handleUpdateSubStatus = async (subId, newStatus, sub) => {
    try {
      await API.patch(`/admin/subscriptions/${subId}/status`, { status: newStatus });
      setSubscriptions(prev =>
        prev.map(s => (s.subscription_id === subId ? { ...s, status: newStatus } : s))
      );
      setConfirmedPopup({
        title: 'Subscription Updated!',
        message: `Plan #${subId} for ${sub.customer_name} set to ${newStatus.toUpperCase()}.`
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update subscription.');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'milk',
      unit: '500 ml',
      price: '',
      description: '',
      image_url: '/images/Buffalo_milk.png'
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      unit: product.unit,
      price: product.price,
      description: product.description || '',
      image_url: product.image_url || '/images/Buffalo_milk.png'
    });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct.id}`, formData);
      } else {
        await API.post('/products', formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product.');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;
    try {
      await API.delete(`/products/${id}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      <div className="page-header">
        <div>
          <h2>SmartMilk Admin Control Center</h2>
          <p>Manage product catalog inventory, recurring subscriptions, and customer orders</p>
        </div>

        {/* 3 Action Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn ${activeTab === 'products' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={15} style={{ marginRight: 6 }} /> Products ({products.length})
          </button>
          
          <button 
            className={`btn ${activeTab === 'orders' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('orders')}
          >
            <Users size={15} style={{ marginRight: 6 }} /> Orders & Tracking ({orders.length})
          </button>

          <button 
            className={`btn ${activeTab === 'subscriptions' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            <CalendarDays size={15} style={{ marginRight: 6 }} /> Subscription Products ({subscriptions.length})
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading control panel data...</p>
      ) : activeTab === 'products' ? (
        /* 1. Products Tab */
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>Catalog Inventory</h3>
            <button className="btn" onClick={openAddModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> Add New Product
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '12px 16px' }}>Item</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Unit</th>
                  <th style={{ padding: '12px 16px' }}>Price</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={p.image_url} 
                        alt="" 
                        style={{ width: 38, height: 38, objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/Buffalo_milk.png';
                        }} 
                      />
                      <strong>{p.name}</strong>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="card-tag">{p.category}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{p.unit}</td>
                    <td style={{ padding: '12px 16px' }}>₹{p.price}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => openEditModal(p)} 
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#2563eb', marginRight: 12 }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(p.id, p.name)} 
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'orders' ? (
        /* 2. Direct Delivery Orders Tab */
        <div>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1rem' }}>Live Delivery Orders</h3>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '12px 16px' }}>Order</th>
                  <th style={{ padding: '12px 16px' }}>Customer</th>
                  <th style={{ padding: '12px 16px' }}>Delivery Address</th>
                  <th style={{ padding: '12px 16px' }}>Items</th>
                  <th style={{ padding: '12px 16px' }}>Slot</th>
                  <th style={{ padding: '12px 16px' }}>Total</th>
                  <th style={{ padding: '12px 16px' }}>Status Tracker</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <strong>#{o.order_number}</strong>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div><strong>{o.recipient_name}</strong></div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{o.phone}</div>
                    </td>
                    <td style={{ padding: '12px 16px', maxWidth: '240px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{o.street_address}</div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{o.city}</div>
                      {o.delivery_notes && (
                        <div style={{ color: '#047857', fontSize: '0.76rem', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px', marginTop: '4px', display: 'inline-block' }}>
                          Note: {o.delivery_notes}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {o.items?.map((it) => (
                        <div key={it.id} style={{ fontSize: '0.82rem' }}>
                          {it.quantity}× {it.product_name}
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.82rem' }}>{o.time_slot}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 800 }}>₹{o.total_amount}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value, o)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          border: '1px solid #cbd5e1',
                          background: o.status === 'delivered' ? '#dcfce7' : o.status === 'confirmed' ? '#dbeafe' : '#fef3c7',
                          color: o.status === 'delivered' ? '#15803d' : o.status === 'confirmed' ? '#1e40af' : '#b45309'
                        }}
                      >
                        <option value="placed">1. Placed (Pending)</option>
                        <option value="confirmed">2. Confirmed & Chilled</option>
                        <option value="out_for_delivery">3. Out for Delivery</option>
                        <option value="delivered">4. Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 3. Subscription Products Tab */
        <div>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1rem' }}>Customer Subscription Plans</h3>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '12px 16px' }}>Plan ID</th>
                  <th style={{ padding: '12px 16px' }}>Customer</th>
                  <th style={{ padding: '12px 16px' }}>Product & Schedule</th>
                  <th style={{ padding: '12px 16px' }}>Delivery Address</th>
                  <th style={{ padding: '12px 16px' }}>Rate / Unit</th>
                  <th style={{ padding: '12px 16px' }}>Subscription Status</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s) => (
                  <tr key={s.subscription_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <strong>Plan #{s.subscription_id}</strong>
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '12px 16px' }}>
                      <div><strong>{s.customer_name}</strong></div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{s.customer_phone}</div>
                    </td>

                    {/* Subscribed Product & Frequency */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img 
                          src={s.image_url || '/images/Buffalo_milk.png'} 
                          alt="" 
                          style={{ width: 32, height: 32, objectFit: 'contain' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/Buffalo_milk.png';
                          }}
                        />
                        <div>
                          <strong>{s.product_name}</strong>
                          <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
                            {s.quantity} × {s.unit} • Frequency: <strong style={{ textTransform: 'capitalize' }}>{s.frequency}</strong>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Address */}
                    <td style={{ padding: '12px 16px', maxWidth: '240px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>
                        {s.address_line1 || 'Primary Residence'}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
                        {s.area_zone ? `${s.area_zone}, ` : ''}{s.city || 'Metro City'}
                      </div>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '12px 16px', fontWeight: 800 }}>
                      ₹{parseFloat(s.price).toFixed(2)}
                    </td>

                    {/* Status Dropdown */}
                    <td style={{ padding: '12px 16px' }}>
                      <select
                        value={s.status}
                        onChange={(e) => handleUpdateSubStatus(s.subscription_id, e.target.value, s)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          border: '1px solid #cbd5e1',
                          background: s.status === 'active' ? '#dcfce7' : s.status === 'paused' ? '#fee2e2' : '#f1f5f9',
                          color: s.status === 'active' ? '#15803d' : s.status === 'paused' ? '#b91c1c' : '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="active">Active Plan</option>
                        <option value="paused">Paused Schedule</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmedPopup && (
        <div className="modal-backdrop" onClick={() => setConfirmedPopup(null)}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{confirmedPopup.title}</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.5rem 0 1.25rem' }}>
              {confirmedPopup.message}
            </p>
            <button className="btn" style={{ width: '100%' }} onClick={() => setConfirmedPopup(null)}>
              Done
            </button>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="milk">Milk</option>
                  <option value="curd">Curd & Yogurt</option>
                  <option value="paneer">Fresh Paneer</option>
                  <option value="ghee">Ghee & Butter</option>
                  <option value="dairy_special">Farm Fresh & Beverages</option>
                </select>
              </div>

              <div className="form-group">
                <label>Unit/Volume</label>
                <input 
                  type="text" 
                  value={formData.unit} 
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={formData.price} 
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input 
                  type="text" 
                  value={formData.image_url} 
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} 
                  required 
                />
              </div>

              <button className="btn" style={{ width: '100%', marginTop: '0.75rem' }} type="submit">
                {editingProduct ? 'Update Product' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;