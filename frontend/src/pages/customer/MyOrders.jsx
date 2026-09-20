import React, { useState, useEffect } from 'react';
import { CheckCircle2, Package } from 'lucide-react';
import API from '../../api/axiosInstance';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my')
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStepStatus = (currentStatus, stepIndex) => {
    const sequence = ['placed', 'confirmed', 'out_for_delivery', 'delivered'];
    const currentIdx = sequence.indexOf(currentStatus);
    if (currentIdx >= stepIndex) return 'active';
    return 'inactive';
  };

  return (
    <div className="container" style={{ maxWidth: '1080px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f291e' }}>My Delivery Orders</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Real-time tracking for morning farm deliveries and past receipts.
        </p>
      </div>

      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <Package size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3>No Orders Found</h3>
          <p style={{ color: '#64748b' }}>Order items from the catalog to start morning deliveries.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {orders.map((o) => (
            <div key={o.id} style={{ background: '#fff', borderRadius: '18px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              {/* Order Card Header */}
              <div style={{ padding: '1.25rem 1.75rem', background: '#fafafa', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block' }}>Order ID</span>
                    <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>#{o.order_number}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block' }}>Placed Date</span>
                    <strong>{new Date(o.created_at).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block' }}>Slot</span>
                    <strong>{o.time_slot}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>₹{o.total_amount}</span>
                  <span style={{ background: o.status === 'delivered' ? '#dcfce7' : '#fef3c7', color: o.status === 'delivered' ? '#15803d' : '#b45309', fontWeight: 800, fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
                    {o.status}
                  </span>
                </div>
              </div>

              {/* Real-time Stepper Bar (Image 3) */}
              <div style={{ padding: '2.2rem 1.75rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center' }}>
                  {[
                    { title: 'Order Placed', desc: 'Received by farm' },
                    { title: 'Confirmed', desc: 'Packed & Chilled' },
                    { title: 'Out for Delivery', desc: 'Early morning van' },
                    { title: 'Delivered', desc: 'Doorstep arrival' }
                  ].map((step, idx) => {
                    const st = getStepStatus(o.status, idx);
                    const isDone = st === 'active';

                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            marginBottom: '8px',
                            background: isDone ? '#0f766e' : '#e2e8f0',
                            color: isDone ? '#fff' : '#64748b'
                          }}
                        >
                          {isDone ? <CheckCircle2 size={18} /> : idx + 1}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isDone ? '#0f172a' : '#94a3b8' }}>
                          {step.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{step.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items List */}
              <div style={{ padding: '1.5rem 1.75rem' }}>
                {o.items?.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={item.image_url}
                        alt=""
                        style={{ width: 44, height: 44, objectFit: 'contain', background: '#f8fafc', borderRadius: '8px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500';
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.product_name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Qty: {item.quantity} • {item.unit}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800 }}>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                  </div>
                ))}

                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#64748b', flexWrap: 'wrap', gap: '8px' }}>
                  <span>Delivery to: <strong>{o.recipient_name}</strong>, {o.street_address}, {o.city} ({o.phone})</span>
                  <span>Payment: <strong>{o.payment_method}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;