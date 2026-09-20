const db = require('../config/db.js');
const dateHelpers = require('../utils/dateHelpers.js');

const subscriptionController = {
  createSubscription: async (req, res, next) => {
    try {
      const { product_id, address_line, frequency, custom_days, quantity, start_date } = req.body;

      const [existingAddr] = await db.execute('SELECT id FROM addresses WHERE user_id = ? LIMIT 1', [req.user.id]);
      let addressId;

      if (existingAddr.length > 0) {
        addressId = existingAddr[0].id;
      } else {
        const [newAddr] = await db.execute(
          'INSERT INTO addresses (user_id, address_line1, area_zone, pincode, is_default) VALUES (?, ?, ?, ?, TRUE)',
          [req.user.id, address_line || 'Doorstep Delivery', 'Central Zone', '500001']
        );
        addressId = newAddr.insertId;
      }

      const [result] = await db.execute(
        `INSERT INTO subscriptions (user_id, product_id, address_id, frequency, custom_days, quantity, start_date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
        [
          req.user.id,
          product_id,
          addressId,
          frequency || 'daily',
          JSON.stringify(custom_days || []),
          quantity || 1,
          start_date || new Date().toISOString().split('T')[0]
        ]
      );

      res.status(201).json({ success: true, subscriptionId: result.insertId, message: 'Subscription created!' });
    } catch (error) {
      next(error);
    }
  },

  getUserSubscriptions: async (req, res, next) => {
    try {
      const [subs] = await db.execute(`
        SELECT s.*, p.name AS product_name, p.unit, p.price, p.image_url, a.address_line1, a.area_zone 
        FROM subscriptions s
        JOIN products p ON s.product_id = p.id
        JOIN addresses a ON s.address_id = a.id
        WHERE s.user_id = ?`,
        [req.user.id]
      );
      res.json(subs);
    } catch (error) {
      next(error);
    }
  },

  toggleStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await db.execute('UPDATE subscriptions SET status = ? WHERE id = ? AND user_id = ?', [status, id, req.user.id]);
      res.json({ message: `Subscription status updated to ${status}` });
    } catch (error) {
      next(error);
    }
  },

  deleteSubscription: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // 1. Remove calendar exceptions linked to this plan
      await db.execute('DELETE FROM subscription_exceptions WHERE subscription_id = ?', [id]);

      // 2. Remove the subscription entry for this user
      const [result] = await db.execute(
        'DELETE FROM subscriptions WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Subscription not found or unauthorized.' });
      }

      res.json({ message: 'Subscription deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },

  setException: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { exception_date, action, override_quantity } = req.body;

      const todayStr = new Date().toISOString().split('T')[0];
      if (exception_date === todayStr && !dateHelpers.isBeforeCutoff()) {
        return res.status(400).json({ message: 'Changes for today are locked after the 9:00 PM cutoff.' });
      }

      await db.execute(`
        INSERT INTO subscription_exceptions (subscription_id, exception_date, action, override_quantity)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE action = VALUES(action), override_quantity = VALUES(override_quantity)`,
        [id, exception_date, action, override_quantity || 0]
      );

      res.json({ message: 'Schedule updated successfully!' });
    } catch (error) {
      next(error);
    }
  },

  // FETCH STORED EXCEPTIONS FROM DATABASE
  getExceptions: async (req, res, next) => {
    try {
      const { id } = req.params;
      const [exceptions] = await db.execute(
        `SELECT DATE_FORMAT(exception_date, '%Y-%m-%d') as date, action, override_quantity 
         FROM subscription_exceptions 
         WHERE subscription_id = ?`,
        [id]
      );
      res.json(exceptions);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = subscriptionController;