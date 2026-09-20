import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axiosInstance';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await API.post('/auth/login', { phone, password });
      login(res.data);

      // Route dynamically based on user role
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else if (res.data.user.role === 'delivery_partner') {
        navigate('/delivery');
      } else {
        navigate('/catalog');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '420px', marginTop: '3rem' }}>
      <div className="modal-content" style={{ padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#0f172a' }}>Sign In</h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Enter your registered credentials
        </p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Registered Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. 8328524155"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn" style={{ width: '100%', marginTop: '0.75rem' }} type="submit" disabled={submitting}>
            {submitting ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: '#64748b' }}>
          New to SmartMilk? <Link to="/register" style={{ color: '#2563eb', fontWeight: 600 }}>Create an Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;