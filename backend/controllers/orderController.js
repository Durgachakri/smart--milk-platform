const db = require('../config/db.js');

const orderController = {
  createOrder: async (req, res, next) => {
    let connection;
    try {
      connection = await db.getConnection();
      const {
        recipient_name,
        phone,
        street_address,
        city,
        delivery_notes,
        time_slot,
        payment_method,
        cart_items,
        subtotal,
        delivery_fee,
        total_amount
      } = req.body;

      if (!cart_items || cart_items.length === 0) {
        return res.status(400).json({ message: 'Cart items cannot be empty.' });
      }

      await connection.beginTransaction();

      const orderNumber = `MLK-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const userId = req.user.id;

      const [orderResult] = await connection.execute(
        `INSERT INTO orders 
        (order_number, user_id, recipient_name, phone, street_address, city, delivery_notes, time_slot, payment_method, subtotal, delivery_fee, total_amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'placed')`,
        [
          orderNumber,
          userId,
          recipient_name || 'Valued Customer',
          phone || '0000000000',
          street_address || 'Doorstep Delivery',
          city || 'Metro City',
          delivery_notes || null,
          time_slot || 'Early Morning (06:00 AM – 08:00 AM)',
          payment_method || 'Cash / UPI on Delivery',
          parseFloat(subtotal) || 0,
          parseFloat(delivery_fee) || 0,
          parseFloat(total_amount) || 0
        ]
      );

      const orderId = orderResult.insertId;

      for (const item of cart_items) {
        let validProductId = null;

        // Check if the product ID actually exists in the database
        if (item.id) {
          const [exists] = await connection.execute('SELECT id FROM products WHERE id = ?', [item.id]);
          if (exists.length > 0) {
            validProductId = item.id;
          }
        }

        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, product_name, unit, price, quantity, image_url)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            validProductId,
            item.name || 'Dairy Item',
            item.unit || '500 ml',
            parseFloat(item.price) || 0,
            parseInt(item.quantity, 10) || 1,
            item.image_url || '/images/Buffalo_milk.png'
          ]
        );
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        orderId,
        orderNumber,
        total_amount: parseFloat(total_amount) || 0,
        time_slot: time_slot || 'Early Morning (06:00 AM – 08:00 AM)'
      });
    } catch (err) {
      if (connection) await connection.rollback();
      console.error('Order creation failed:', err);
      res.status(500).json({ message: err.message || 'Failed to place order.' });
    } finally {
      if (connection) connection.release();
    }
  },

  getMyOrders: async (req, res, next) => {
    try {
      const [orders] = await db.execute(
        `SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC`,
        [req.user.id]
      );

      for (const order of orders) {
        const [items] = await db.execute(
          `SELECT * FROM order_items WHERE order_id = ?`,
          [order.id]
        );
        order.items = items;
      }

      res.json(orders);
    } catch (err) {
      next(err);
    }
  },

  getAllAdminOrders: async (req, res, next) => {
    try {
      const [orders] = await db.execute(
        `SELECT o.*, u.name as account_name, u.phone as account_phone 
         FROM orders o 
         JOIN users u ON o.user_id = u.id 
         ORDER BY o.id DESC`
      );

      for (const order of orders) {
        const [items] = await db.execute(
          `SELECT * FROM order_items WHERE order_id = ?`,
          [order.id]
        );
        order.items = items;
      }

      res.json(orders);
    } catch (err) {
      next(err);
    }
  },

  updateOrderStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
      res.json({ message: `Order status updated to ${status}` });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = orderController;