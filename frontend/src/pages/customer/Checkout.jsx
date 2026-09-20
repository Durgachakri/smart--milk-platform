import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, CreditCard, QrCode, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axiosInstance';

const Checkout = () => {
  const { cart, subtotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    recipient_name: user?.user?.name || '',
    phone: user?.user?.phone || '',
    street_address: 'Flat 402, Sun Villa Apartments, High Street, City',
    city: 'Metro City',
    delivery_notes: 'Ring bell or drop in milk cooler'
  });

  const [timeSlot, setTimeSlot] = useState('Early Morning (06:00 AM – 08:00 AM)');
  const [paymentMethod, setPaymentMethod] = useState('Cash / UPI on Delivery');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = subtotal > 0 ? 30.0 : 0.0;
  const totalPayable = subtotal + deliveryFee;

  const handleFillSample = () => {
    setForm({
      recipient_name: 'Rahul Sharma',
      phone: '+91 9812345678',
      street_address: 'Flat 402, Sun Villa Apartments, High Street, City',
      city: 'Metro City',
      delivery_notes: 'Ring bell or drop in milk cooler'
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) {
      alert('Your cart is empty! Add products first.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        recipient_name: form.recipient_name,
        phone: form.phone,
        street_address: form.street_address,
        city: form.city,
        delivery_notes: form.delivery_notes,
        time_slot: timeSlot,
        payment_method: paymentMethod,
        cart_items: cart,
        subtotal: parseFloat(subtotal),
        delivery_fee: parseFloat(deliveryFee),
        total_amount: parseFloat(totalPayable)
      };

      const res = await API.post('/orders', payload);
      setPlacedOrder(res.data);
      clearCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place delivery order. Check database connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1150px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f291e' }}>Delivery Checkout</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Schedule fresh morning delivery directly from our dairy farm to your home.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Steps */}
        <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Step 1: Address */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: '#e6f4ea', color: '#134e4a', fontWeight: 800, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f291e' }}>Doorstep Delivery Address</h3>
              </div>
              <button type="button" onClick={handleFillSample} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0' }}>
                <Zap size={14} /> Quick Fill Sample
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label>Recipient Full Name</label>
                <input type="text" value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone Number (for Delivery SMS)</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Street Address & House / Flat No.</label>
              <input type="text" value={form.street_address} onChange={(e) => setForm({ ...form, street_address: e.target.value })} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>City</label>
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Delivery Notes (Optional)</label>
                <input type="text" placeholder="e.g. Ring bell or drop in milk cooler" value={form.delivery_notes} onChange={(e) => setForm({ ...form, delivery_notes: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Step 2: Time Slot */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.35rem' }}>
              <span style={{ background: '#e6f4ea', color: '#134e4a', fontWeight: 800, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f291e' }}>Choose Delivery Time Slot</h3>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem', marginLeft: '38px' }}>
              Fresh milk is packed early morning to maintain maximum cold-chain freshness.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div
                onClick={() => setTimeSlot('Early Morning (06:00 AM – 08:00 AM)')}
                style={{
                  border: timeSlot.includes('Early Morning') ? '2px solid #0f766e' : '1px solid #e2e8f0',
                  background: timeSlot.includes('Early Morning') ? '#f0fdfa' : '#fff',
                  borderRadius: '14px',
                  padding: '1rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.95rem' }}>Early Morning</strong>
                  <span style={{ background: '#ccfbf1', color: '#0f766e', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>MOST POPULAR</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', fontSize: '0.85rem' }}>
                  <Clock size={15} /> 06:00 AM – 08:00 AM
                </div>
              </div>

              <div
                onClick={() => setTimeSlot('Evening Dispatch (05:00 PM – 07:00 PM)')}
                style={{
                  border: timeSlot.includes('Evening') ? '2px solid #0f766e' : '1px solid #e2e8f0',
                  background: timeSlot.includes('Evening') ? '#f0fdfa' : '#fff',
                  borderRadius: '14px',
                  padding: '1rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.95rem' }}>Evening Dispatch</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', fontSize: '0.85rem' }}>
                  <Clock size={15} /> 05:00 PM – 07:00 PM
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <span style={{ background: '#e6f4ea', color: '#134e4a', fontWeight: 800, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f291e' }}>Payment Method</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { id: 'Cash / UPI on Delivery', title: 'Cash / UPI on Delivery', desc: 'Pay your delivery agent upon doorstep arrival via cash or QR.', icon: Truck },
                { id: 'Instant Online UPI (GPay / PhonePe / Paytm)', title: 'Instant Online UPI (GPay / PhonePe / Paytm)', desc: 'Fast, automated mock checkout confirmation.', icon: QrCode },
                { id: 'Credit or Debit Card', title: 'Credit or Debit Card', desc: 'Visa, Mastercard, RuPay cards accepted.', icon: CreditCard }
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <label
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #0f766e' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0fdf4' : '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <input type="radio" checked={isSelected} readOnly />
                    <Icon size={20} color="#0f766e" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{m.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{m.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            className="btn"
            type="submit"
            disabled={submitting || !cart || cart.length === 0}
            style={{ padding: '1.1rem', fontSize: '1.1rem', fontWeight: 800, background: '#134e4a', borderRadius: '14px' }}
          >
            {submitting ? 'Placing Order...' : `Place Delivery Order • ₹${totalPayable.toFixed(0)}`}
          </button>
        </form>

        {/* Right Summary */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Order Summary ({cart?.length || 0} items)
          </h3>

          {!cart || cart.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>Your cart is empty.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Qty: {item.quantity} • {item.unit}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800 }}>₹{(parseFloat(item.price) * item.quantity).toFixed(0)}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Items Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Chilled Delivery</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
              <span>Total Payable</span>
              <span>₹{totalPayable.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '1.5rem', color: '#166534', fontSize: '0.82rem' }}>
            <ShieldCheck size={18} />
            <span>100% Purity and Replacement Guarantee if seal is broken.</span>
          </div>
        </div>
      </div>

      {/* POPUP MODAL (Exact match for Image 2) */}
      {placedOrder && (
        <div className="modal-backdrop">
          <div style={{ background: '#fff', borderRadius: '24px', padding: '2.5rem', maxWidth: '520px', width: '100%', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#a7f3d0', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={36} />
            </div>

            <span style={{ background: '#d1fae5', color: '#065f46', fontWeight: 800, fontSize: '0.75rem', padding: '4px 12px', borderRadius: '16px', letterSpacing: '0.04em' }}>
              ORDER CONFIRMED & FARM NOTIFIED
            </span>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '1rem 0 0.5rem' }}>
              Thank You for Your Order!
            </h2>

            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Your order <strong>#{placedOrder.orderNumber}</strong> has been received by our dairy dispatcher.
            </p>

            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.25rem', margin: '1.75rem 0', textAlign: 'left', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#64748b' }}>Scheduled Slot:</span>
                <strong>{placedOrder.time_slot}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#64748b' }}>Payment Total:</span>
                <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>₹{placedOrder.total_amount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', alignItems: 'center' }}>
                <span style={{ color: '#64748b' }}>Current Status:</span>
                <span style={{ background: '#fef3c7', color: '#b45309', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem' }}>
                  PENDING DISPATCH
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn" 
                style={{ flex: 1, background: '#134e4a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} 
                onClick={() => navigate('/orders')}
              >
                Track Live Delivery Status <ArrowRight size={15} />
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }} 
                onClick={() => navigate('/catalog')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;