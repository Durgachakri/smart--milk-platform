import { useState, useEffect, useCallback } from 'react';
import API from '../api/axiosInstance';

const useSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/subscriptions/my');
      setSubscriptions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    await API.patch(`/subscriptions/${id}/status`, { status: nextStatus });
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: nextStatus } : sub))
    );
  };

  const setException = async (id, date, action, qty = 0) => {
    return API.post(`/subscriptions/${id}/exception`, {
      exception_date: date,
      action,
      override_quantity: qty
    });
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return { subscriptions, loading, toggleStatus, setException, reload: fetchSubscriptions };
};

export default useSubscription;