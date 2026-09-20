import React, { useState, useEffect, useContext } from 'react';
import { Search, Plus, Calendar, Clock, Sparkles } from 'lucide-react';
import API from '../../api/axiosInstance';
import { CartContext } from '../../context/CartContext';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Subscription modal state
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [frequency, setFrequency] = useState('daily');
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [submitting, setSubmitting] = useState(false);

  // Cart Context hook
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'milk', label: 'Milk' },
    { id: 'curd', label: 'Curd & Yogurt' },
    { id: 'paneer', label: 'Fresh Paneer' },
    { id: 'ghee', label: 'Ghee & Butter' },
    { id: 'dairy_special', label: 'Farm Fresh & Beverages' }
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!activeModalProduct) return;

    setSubmitting(true);
    try {
      await API.post('/subscriptions', {
        product_id: activeModalProduct.id,
        frequency,
        quantity: parseInt(quantity, 10),
        start_date: startDate
      });
      alert(`Successfully subscribed to ${activeModalProduct.name}!`);
      setActiveModalProduct(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to establish dairy subscription.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      {/* Header section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f291e', marginBottom: '0.25rem' }}>
          Daily Farm & Dairy Essentials
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem' }}>
          <Clock size={16} /> Guaranteed morning doorstep delivery by 7:00 AM
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products Display */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* Left Category Sidebar */}
        <aside style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '1rem', fontWeight: 800 }}>
            Categories
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 700 : 500,
                    background: isSelected ? '#eff6ff' : 'transparent',
                    color: isSelected ? '#1d4ed8' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Content Area */}
        <main>
          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: '1.75rem' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search milk, curd, ghee, paneer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 46px',
                borderRadius: '30px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: '0.92rem',
                background: '#fff'
              }}
            />
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>Refreshing farm catalog...</p>
          ) : filteredProducts.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b' }}>No products match your search criteria.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {filteredProducts.map((p) => {
                const discount = parseInt(p.discount_percent, 10) || 0;
                const origPrice = p.original_price ? parseFloat(p.original_price) : null;

                return (
                  <div
                    key={p.id}
                    style={{
                      background: '#fff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                    }}
                  >
                    {/* Top-Right Offer Percentage Tag */}
                    {discount > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: '#fef08a',
                          color: '#854d0e',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          zIndex: 2
                        }}
                      >
                        {discount}% OFF
                      </div>
                    )}

                    {/* Product Image */}
                    <div style={{ padding: '1.5rem', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '170px' }}>
                      <img
                        src={p.image_url}
                        alt={p.name}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500';
                        }}
                      />
                    </div>

                    {/* Product Body */}
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          color: '#2563eb',
                          background: '#eff6ff',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          width: 'fit-content',
                          textTransform: 'uppercase',
                          marginBottom: '6px'
                        }}
                      >
                        {p.category?.replace('_', ' ')}
                      </span>

                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>
                        {p.name}
                      </h3>

                      <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 8px' }}>
                        {p.unit}
                      </p>

                      <p
                        style={{
                          fontSize: '0.78rem',
                          color: '#94a3b8',
                          lineHeight: 1.35,
                          minHeight: '34px',
                          margin: '0 0 1rem'
                        }}
                      >
                        {p.description || 'Pure, farm-fresh morning quality daily essential.'}
                      </p>

                      {/* Pricing and Action Buttons */}
                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #f8fafc' }}>
                        <div>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                            ₹{parseFloat(p.price).toFixed(2)}
                          </span>
                          {origPrice && origPrice > parseFloat(p.price) && (
                            <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.78rem', marginLeft: '6px' }}>
                              ₹{origPrice.toFixed(0)}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          {/* Subscribe Button */}
                          <button
                            className="btn btn-secondary btn-sm"
                            title="Set Up Morning Delivery Schedule"
                            style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem' }}
                            onClick={() => {
                              setActiveModalProduct(p);
                              setQuantity(1);
                            }}
                          >
                            <Calendar size={13} /> Subscribe
                          </button>

                          {/* Add To Cart (+) Button */}
                          <button
                            title="Add to Cart"
                            onClick={() => {
                              addToCart(p);
                              alert(`${p.name} added to cart!`);
                            }}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: '#134e4a',
                              color: '#fff',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Subscription Schedule Modal */}
      {activeModalProduct && (
        <div className="modal-backdrop" onClick={() => setActiveModalProduct(null)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#15803d" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f291e' }}>
                  Subscribe to {activeModalProduct.name}
                </h3>
              </div>
              <button onClick={() => setActiveModalProduct(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubscribe}>
              <div className="form-group">
                <label>Frequency</label>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                  <option value="daily">Daily Morning Delivery</option>
                  <option value="alternate">Alternate Days</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="form-group">
                <label>Bottles / Packets Per Delivery</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>First Delivery Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', margin: '1rem 0', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Item Price:</span>
                  <strong>₹{parseFloat(activeModalProduct.price).toFixed(2)} / {activeModalProduct.unit}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Cost Per Dispatch:</span>
                  <strong style={{ color: '#15803d', fontSize: '1rem' }}>
                    ₹{(parseFloat(activeModalProduct.price) * quantity).toFixed(2)}
                  </strong>
                </div>
              </div>

              <button
                className="btn"
                type="submit"
                disabled={submitting}
                style={{ width: '100%', padding: '0.9rem', background: '#134e4a', fontWeight: 800 }}
              >
                {submitting ? 'Setting up schedule...' : 'Confirm Subscription Schedule'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;