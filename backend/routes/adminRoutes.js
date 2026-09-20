const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const db = require('../config/db.js');

// Fetch all customer subscriptions
router.get('/subscriptions', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        s.id AS subscription_id,
        s.quantity,
        s.frequency,
        s.status,
        s.start_date,
        s.created_at,
        u.id AS user_id,
        u.name AS customer_name,
        u.phone AS customer_phone,
        p.id AS product_id,
        p.name AS product_name,
        p.unit,
        p.price,
        p.image_url
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      JOIN products p ON s.product_id = p.id
      ORDER BY s.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Admin subscriptions error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update subscription status
router.patch('/subscriptions/:id/status', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.execute('UPDATE subscriptions SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: `Subscription status updated to ${status}` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;