import React, { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/admin/analytics').then((res) => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <div className="container">
      <h2>Admin Operations Dashboard</h2>
      {stats && (
        <>
          <div className="grid">
            <div className="card"><h3>Active Plans</h3><p style={{ fontSize: '2rem' }}>{stats.activeSubscriptions}</p></div>
            <div className="card"><h3>Deliveries Made</h3><p style={{ fontSize: '2rem' }}>{stats.completedDeliveries}</p></div>
            <div className="card"><h3>Total Revenue</h3><p style={{ fontSize: '2rem' }}>₹{stats.totalRevenue}</p></div>
          </div>
          <div className="card" style={{ height: 320 }}>
            <h3>Weekly Dispatched Volume (Liters)</h3>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={stats.volumeChart}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="liters" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;