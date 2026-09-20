import React, { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';

const TodayDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = () => {
    API.get('/deliveries/today')
      .then((res) => setDeliveries(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/deliveries/${id}/status`, { status });
      setDeliveries(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>Today's Delivery Manifest</h2>
          <p>Morning dispatch schedule & doorstep delivery logs</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchDeliveries}>Refresh List</button>
      </div>

      {loading ? (
        <p>Loading today's route...</p>
      ) : deliveries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>No pending deliveries found for today's run.</p>
        </div>
      ) : (
        <div className="grid">
          {deliveries.map((d) => (
            <div key={d.id} className="card" style={{ borderLeft: d.status === 'delivered' ? '5px solid #16a34a' : '5px solid #2563eb' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="card-tag">{d.area_zone || 'Standard Area'}</span>
                  <strong style={{ color: d.status === 'delivered' ? '#16a34a' : '#d97706', fontSize: '0.85rem' }}>
                    {d.status.toUpperCase()}
                  </strong>
                </div>
                <h3 className="card-title">{d.customer_name}</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '6px' }}>📞 {d.customer_phone}</p>
                <p className="card-desc">📍 {d.address_line1}</p>
                <p><strong>Item:</strong> {d.quantity} x {d.product_name}</p>
              </div>

              <div className="card-footer" style={{ marginTop: '1rem' }}>
                {d.status !== 'delivered' ? (
                  <button className="btn btn-sm" style={{ width: '100%', background: '#16a34a' }} onClick={() => updateStatus(d.id, 'delivered')}>
                    ✓ Mark Delivered
                  </button>
                ) : (
                  <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.9rem' }}>✓ Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodayDeliveries;