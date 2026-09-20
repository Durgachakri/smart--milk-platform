import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axiosInstance';

const Register = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Notice: No 'role' parameter sent in the payload
      const res = await API.post('/auth/register', {
        name: name.trim(),
      phone: phone.trim(),
      password,
      address: address.trim()
      });

      login(res.data);
      navigate('/catalog');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '420px', marginTop: '3rem' }}>
      <div className="modal-content" style={{ padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#0f172a' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Subscribe to daily morning dairy deliveries
        </p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Durga Chakri"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Delivery Address</label>
            <input
              type="text"
              placeholder="Apartment, Street, Area"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <button className="btn" style={{ width: '100%', marginTop: '0.75rem' }} type="submit" disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Sign Up as Customer'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;