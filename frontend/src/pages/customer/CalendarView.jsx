import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Milk, Ban, Plus, RotateCcw, X, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import API from '../../api/axiosInstance';
import useSubscription from '../../hooks/useSubscription';

const CalendarView = () => {
  const { subscriptions, loading } = useSubscription();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [exceptions, setExceptions] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Wrap activeSubs in useMemo to prevent unnecessary dependency re-renders
  const activeSubs = useMemo(() => {
    return subscriptions ? subscriptions.filter(s => s.status === 'active') : [];
  }, [subscriptions]);

  // Set initial selected subscription from URL param or first active subscription
  useEffect(() => {
    if (activeSubs.length > 0) {
      const urlSubId = searchParams.get('subId');
      const found = activeSubs.find(s => String(s.id) === String(urlSubId));
      if (found) {
        setSelectedSubId(found.id);
      } else if (!selectedSubId) {
        setSelectedSubId(activeSubs[0].id);
      }
    }
  }, [activeSubs, searchParams, selectedSubId]);

  const currentSub = activeSubs.find(s => s.id === selectedSubId) || activeSubs[0] || null;
  const baseQty = currentSub ? parseInt(currentSub.quantity, 10) : 1;

  // Load database exceptions whenever the selected subscription changes
  const loadStoredExceptions = useCallback(async () => {
    if (!currentSub) return;
    try {
      const res = await API.get(`/subscriptions/${currentSub.id}/exceptions`);
      const map = {};
      res.data.forEach((item) => {
        map[item.date] = {
          status: item.action === 'skip' ? 'skipped' : 'modified',
          qty: item.override_quantity
        };
      });
      setExceptions(map);
    } catch (err) {
      console.error('Failed to load exceptions:', err);
    }
  }, [currentSub]);

  useEffect(() => {
    loadStoredExceptions();
  }, [loadStoredExceptions]);

  const handleSelectSub = (id) => {
    setSelectedSubId(id);
    setSearchParams({ subId: id });
  };

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr, dayName, formatted };
  });

  const handleAction = async (action, qty = baseQty) => {
    if (!currentSub) return;
    try {
      await API.post(`/subscriptions/${currentSub.id}/exception`, {
        exception_date: selectedDate,
        action,
        override_quantity: qty
      });

      setExceptions((prev) => ({
        ...prev,
        [selectedDate]: action === 'skip' ? { status: 'skipped' } : { status: 'modified', qty }
      }));
      setModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
      setModalOpen(false);
    }
  };

  if (loading) return <div className="container"><p>Loading calendar...</p></div>;

  return (
    <div className="container">
      {/* 1. Header with clear formatting */}
      <div className="page-header">
        <div>
          <h2>14-Day Delivery Calendar</h2>
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
            <CalendarIcon size={16} /> 
            {currentSub 
              ? `Managing Schedule for: ${currentSub.product_name} (${baseQty} × ${currentSub.unit} / day)` 
              : 'No active plan found. Go to Catalog to subscribe.'}
          </p>
        </div>
      </div>

      {/* 2. Subscription Plan Switcher Tabs (Formatted as "1 × 500 ml") */}
      {activeSubs.length > 1 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Select Product Plan to Manage:
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {activeSubs.map((sub) => {
              const isSelected = sub.id === currentSub?.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSub(sub.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '24px',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    color: isSelected ? '#1d4ed8' : '#334155',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <Milk size={16} color={isSelected ? '#2563eb' : '#64748b'} />
                  <span>{sub.product_name} ({sub.quantity} × {sub.unit})</span>
                  {isSelected && <CheckCircle2 size={16} color="#2563eb" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Calendar Grid Cards (Formatted as "1 × 500 ml") */}
      <div className="calendar-grid">
        {days.map(({ dateStr, dayName, formatted }) => {
          const exc = exceptions[dateStr];
          const isSkipped = exc?.status === 'skipped';
          const isModified = exc?.status === 'modified';

          return (
            <div
              key={dateStr}
              className={`calendar-card ${isSkipped ? 'delivery-skipped' : 'delivery-active'}`}
              onClick={() => { setSelectedDate(dateStr); setModalOpen(true); }}
            >
              <div>
                <span className="cal-day">{dayName}</span>
                <div className="cal-date">{formatted}</div>
              </div>

              <div 
                className={`cal-badge ${isSkipped ? 'badge-skipped' : 'badge-active'}`} 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                {!currentSub ? (
                  'No Plan'
                ) : isSkipped ? (
                  <><Ban size={12} /> Skipped</>
                ) : isModified ? (
                  <><Milk size={12} /> {exc.qty} × {currentSub.unit}</>
                ) : (
                  <><Milk size={12} /> {baseQty} × {currentSub.unit}</>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Schedule Edit Modal */}
      {modalOpen && currentSub && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3>Schedule: {currentSub.product_name}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Date: <strong>{selectedDate}</strong> (Standard: {baseQty} × {currentSub.unit})
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                className="btn btn-danger" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} 
                onClick={() => handleAction('skip')}
              >
                <Ban size={16} /> Skip Delivery for this Day
              </button>
              
              <button 
                className="btn btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} 
                onClick={() => handleAction('modify_qty', baseQty + 1)}
              >
                <Plus size={16} /> Add +1 Pack ({baseQty + 1} × {currentSub.unit})
              </button>

              <button 
                className="btn btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} 
                onClick={() => handleAction('modify_qty', baseQty + 2)}
              >
                <Plus size={16} /> Add +2 Packs ({baseQty + 2} × {currentSub.unit})
              </button>

              <button 
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} 
                onClick={() => handleAction('modify_qty', baseQty)}
              >
                <RotateCcw size={16} /> Reset to Standard Plan ({baseQty} × {currentSub.unit})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;